// supabase/functions/answer-with-rag/index.ts
// Retrieval-Augmented answer using site_content + shared_faqs + Lovable AI.
// Returns { answer, sources: [{title, url}], grounded: boolean }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

interface ReqBody {
  question: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Supabase env not configured");

    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { question } = (await req.json()) as ReqBody;
    if (!question || typeof question !== "string" || question.length > 500) {
      return new Response(JSON.stringify({ error: "Invalid question" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Build a tsquery from the user question (keep alphanumerics)
    const terms = question
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .slice(0, 8);
    const tsQuery = terms.length ? terms.map((t) => `${t}:*`).join(" | ") : null;

    // 1) Retrieve top scraped pages
    let pages: { title: string | null; url: string; content: string }[] = [];
    if (tsQuery) {
      const { data } = await admin
        .from("site_content")
        .select("title, url, content")
        .textSearch("content", tsQuery, { type: "websearch", config: "english" })
        .limit(4);
      pages = data ?? [];
      if (pages.length === 0) {
        // Fallback: most recent pages
        const { data: recent } = await admin
          .from("site_content")
          .select("title, url, content")
          .order("scraped_at", { ascending: false })
          .limit(3);
        pages = recent ?? [];
      }
    }

    // 2) Retrieve top resolved-FAQ matches
    const { data: faqs } = await admin
      .from("shared_faqs")
      .select("question, answer")
      .limit(50);
    const faqMatches = (faqs ?? [])
      .map((f) => {
        const q = f.question.toLowerCase();
        const score = terms.filter((t) => q.includes(t)).length;
        return { ...f, score };
      })
      .filter((f) => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // 3) Build prompt
    const contextParts: string[] = [];
    if (faqMatches.length) {
      contextParts.push(
        "Previously resolved Q&A:\n" +
          faqMatches.map((f, i) => `[FAQ ${i + 1}] Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
      );
    }
    if (pages.length) {
      contextParts.push(
        "Pages from cpur.in:\n" +
          pages
            .map(
              (p, i) =>
                `[Source ${i + 1}] ${p.title ?? "Untitled"} (${p.url})\n${p.content.slice(0, 1500)}`
            )
            .join("\n\n---\n\n")
      );
    }

    const grounded = contextParts.length > 0;
    const systemPrompt = grounded
      ? `You are CPU Bot, the official assistant for Career Point University.
Answer the student's question using ONLY the context below. Be concise (under 120 words), friendly, and use bullet points when listing things.
If the context doesn't contain the answer, say: "I don't have that info yet — try asking an admin." Never invent facts.

CONTEXT:
${contextParts.join("\n\n")}`
      : `You are CPU Bot. Tell the student you don't have that information yet and suggest they submit it to an admin via the chat. Keep it under 40 words.`;

    const aiRes = await fetch(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
      }),
    });

    if (aiRes.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (aiRes.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add funds in workspace settings." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error", aiRes.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const answer = aiJson.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate an answer.";

    const sources = pages.map((p) => ({ title: p.title ?? p.url, url: p.url }));

    return new Response(
      JSON.stringify({ answer, sources, grounded }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("answer-with-rag error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
