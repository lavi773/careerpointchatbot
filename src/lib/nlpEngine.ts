import { faqData, fallbackResponses, type FAQ } from "@/data/faqData";

// Simple stopwords
const stopwords = new Set([
  "i", "me", "my", "we", "our", "you", "your", "it", "its", "is", "am", "are",
  "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "shall", "should", "may", "might", "can", "could", "a", "an",
  "the", "and", "but", "or", "nor", "not", "so", "if", "then", "than", "too",
  "very", "just", "about", "to", "of", "in", "for", "on", "with", "at", "by",
  "from", "as", "into", "through", "during", "before", "after", "above", "below",
  "up", "down", "out", "off", "over", "under", "again", "further", "there", "here",
  "when", "where", "why", "how", "all", "each", "every", "both", "few", "more",
  "most", "some", "any", "no", "only", "own", "same", "that", "this", "what",
  "which", "who", "whom", "please", "tell", "know", "want", "need",
]);

// Simple lemmatization rules
function lemmatize(word: string): string {
  if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
  if (word.endsWith("tion")) return word;
  if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) return word.slice(0, -1);
  if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
  return word;
}

// Tokenize and clean
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-\/]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 1 && !stopwords.has(w))
    .map(lemmatize);
}

// Compute similarity between token sets
function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

// Keyword overlap score
function keywordScore(tokens: string[], faq: FAQ): number {
  const matched = tokens.filter(t => faq.keywords.some(k => k.includes(t) || t.includes(k)));
  return faq.keywords.length === 0 ? 0 : matched.length / faq.keywords.length;
}

// Pattern similarity - best match among patterns
function patternScore(input: string, faq: FAQ): number {
  const inputTokens = tokenize(input);
  return Math.max(0, ...faq.patterns.map(p => jaccardSimilarity(inputTokens, tokenize(p))));
}

// Exact substring match bonus
function exactMatchBonus(input: string, faq: FAQ): number {
  const lower = input.toLowerCase();
  for (const pattern of faq.patterns) {
    if (lower.includes(pattern) || pattern.includes(lower)) return 0.5;
  }
  return 0;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function processQuery(input: string): string {
  if (!input.trim()) return "Please type a question! I'm here to help 😊";

  const tokens = tokenize(input);

  let bestScore = 0;
  let bestFaq: FAQ | null = null;

  for (const faq of faqData) {
    const kScore = keywordScore(tokens, faq) * 0.4;
    const pScore = patternScore(input, faq) * 0.4;
    const eScore = exactMatchBonus(input, faq) * 0.2;
    const total = kScore + pScore + eScore;

    if (total > bestScore) {
      bestScore = total;
      bestFaq = faq;
    }
  }

  if (bestFaq && bestScore > 0.15) {
    return bestFaq.response;
  }

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Chat history storage
const HISTORY_KEY = "unibot_history";

export function saveToHistory(question: string, answer: string) {
  const history = getHistory();
  history.unshift({ question, answer, timestamp: new Date().toISOString() });
  if (history.length > 50) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory(): { question: string; answer: string; timestamp: string }[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
