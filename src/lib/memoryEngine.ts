import { supabase } from "@/integrations/supabase/client";

export type MemoryMap = Record<string, string>;

export async function fetchMemory(userId: string): Promise<MemoryMap> {
  const { data, error } = await supabase
    .from("user_memory")
    .select("key, value")
    .eq("user_id", userId);
  if (error) {
    console.error("memory fetch error", error);
    return {};
  }
  const map: MemoryMap = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}

export async function setMemory(userId: string, key: string, value: string) {
  const { error } = await supabase
    .from("user_memory")
    .upsert({ user_id: userId, key, value }, { onConflict: "user_id,key" });
  if (error) console.error("memory upsert error", error);
}

/**
 * Try to answer a query from the stored memory.
 * Returns the answer string, or null if memory doesn't cover it.
 */
export function answerFromMemory(query: string, mem: MemoryMap): string | null {
  const q = query.toLowerCase();

  // Farewell
  if (/\bfarewell\b|\bfair well\b/.test(q)) {
    const date = mem.farewell_date;
    const time = mem.farewell_time;
    if (date && time) return `🎉 Farewell is on **${date}** from **${time}**. See you there!`;
    if (date) return `🎉 Farewell is on **${date}**.`;
  }

  // Practicals
  if (/\bpractical/.test(q) || /\bpracticals?\b/.test(q)) {
    if (mem.bca_practicals_start) return `🧪 BCA practicals start from **${mem.bca_practicals_start}**.`;
  }

  // Exams / major exam
  if (/\bexam(s)?\b|\bmajor\b|\btheory\b/.test(q)) {
    const exam = mem.bca_major_exam_start;
    const note = mem.note;
    if (exam) return `📝 BCA major exams start from **${exam}**.${note ? ` ${note}.` : ""}`;
  }

  // Viva (dynamic example)
  if (/\bviva\b/.test(q) && mem.viva_date) {
    return `🎤 Your viva is on **${mem.viva_date}**.`;
  }

  // Generic key match: "when is X" / "what time is X"
  const keyMatch = q.match(/\b(?:when|what time|date of|time of)(?:\s+is)?\s+([a-z][a-z0-9 _-]{1,40})/i);
  if (keyMatch) {
    const phrase = keyMatch[1].trim().replace(/\s+/g, "_");
    const candidates = [phrase, `${phrase}_date`, `${phrase}_time`];
    for (const c of candidates) {
      if (mem[c]) return `📌 ${humanize(c)}: **${mem[c]}**`;
    }
  }

  return null;
}

/**
 * Detect statements teaching the bot something:
 *   "our viva is on 30 April"
 *   "remember farewell is on 25 April"
 *   "set hostel_curfew = 10 PM"
 * Returns { key, value } or null.
 */
export function extractTeaching(input: string): { key: string; value: string } | null {
  const text = input.trim();

  // explicit set: "set X = Y" or "remember X is Y"
  const setEq = text.match(/^(?:set|remember|save|note)\s+([a-zA-Z][\w\s-]{1,40})\s*(?:=|is|:|to)\s+(.{1,200})$/i);
  if (setEq) return { key: normalizeKey(setEq[1]), value: setEq[2].trim().replace(/[.!]+$/, "") };

  // "our X is on Y" / "my X is Y" / "the X is Y"
  const possessive = text.match(/^(?:our|my|the)\s+([a-zA-Z][\w\s-]{1,40}?)\s+(?:is|will be|starts|begins|happens)\s+(?:on\s+|at\s+|from\s+)?(.{1,200})$/i);
  if (possessive) {
    const key = normalizeKey(possessive[1]);
    const value = possessive[2].trim().replace(/[.!]+$/, "");
    // ignore overly generic keys
    if (key.length >= 3 && !["name", "school", "college"].includes(key)) {
      return { key, value };
    }
  }

  return null;
}

function normalizeKey(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function humanize(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
