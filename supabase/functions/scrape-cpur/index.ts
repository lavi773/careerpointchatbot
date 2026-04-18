// supabase/functions/scrape-cpur/index.ts
// Scrapes cpur.in pages via Firecrawl and stores them in site_content.
// Admin-triggered (verifies caller has admin role) OR cron-triggered (no JWT).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

interface ScrapeReq {
  urls?: string[];
  rootUrl?: string;
  limit?: number;
}

const DEFAULT_ROOT = "https://cpur.in";
const DEFAULT_SEEDS = [
  "https://cpur.in",
  "https://cpur.in/about-us/",
  "https://cpur.in/admission/",
  "https://cpur.in/fee-structure/",
  "https://cpur.in/hostel/",
  "https://cpur.in/placement/",
  "https://cpur.in/contact-us/",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY is not configured");
    if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Supabase env not configured");

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // If a JWT is present, verify the caller is admin
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ") && !authHeader.endsWith(SERVICE_KEY)) {
      const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "", {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: roles } = await admin
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");
      if (!roles || roles.length === 0) {
        return new Response(JSON.stringify({ error: "Admin role required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const body = (await req.json().catch(() => ({}))) as ScrapeReq;

    // Resolve URLs to scrape
    let urls: string[] = [];
    if (body.urls?.length) {
      urls = body.urls;
    } else {
      const root = body.rootUrl ?? DEFAULT_ROOT;
      const limit = Math.min(body.limit ?? 15, 30);
      // 1) Map the site to discover URLs
      try {
        const mapRes = await fetch(`${FIRECRAWL_V2}/map`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: root, limit, includeSubdomains: false }),
        });
        const mapJson = await mapRes.json();
        if (mapRes.ok && Array.isArray(mapJson.links)) {
          urls = mapJson.links.slice(0, limit);
        }
      } catch (e) {
        console.error("map failed", e);
      }
      if (urls.length === 0) urls = DEFAULT_SEEDS;
    }

    const results: { url: string; ok: boolean; error?: string }[] = [];

    for (const url of urls) {
      try {
        const scrapeRes = await fetch(`${FIRECRAWL_V2}/scrape`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            formats: ["markdown"],
            onlyMainContent: true,
          }),
        });
        const data = await scrapeRes.json();
        if (!scrapeRes.ok) {
          results.push({ url, ok: false, error: `Firecrawl ${scrapeRes.status}` });
          continue;
        }
        const markdown: string =
          data.markdown ?? data.data?.markdown ?? "";
        const title: string =
          data.metadata?.title ?? data.data?.metadata?.title ?? null;
        if (!markdown || markdown.length < 80) {
          results.push({ url, ok: false, error: "empty content" });
          continue;
        }
        // Trim to a reasonable size to keep RLS table snappy
        const trimmed = markdown.slice(0, 12000);
        const summary = trimmed.slice(0, 400);

        const { error } = await admin
          .from("site_content")
          .upsert(
            {
              url,
              title,
              content: trimmed,
              summary,
              source: "cpur.in",
              scraped_at: new Date().toISOString(),
            },
            { onConflict: "url" }
          );
        if (error) {
          results.push({ url, ok: false, error: error.message });
        } else {
          results.push({ url, ok: true });
        }
      } catch (e) {
        results.push({ url, ok: false, error: String(e) });
      }
      // Tiny politeness delay
      await new Promise((r) => setTimeout(r, 250));
    }

    const ok = results.filter((r) => r.ok).length;
    return new Response(
      JSON.stringify({ scanned: urls.length, saved: ok, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("scrape-cpur error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
