import { GoogleGenerativeAI } from "@google/generative-ai";

// Runtime function — evaluated on every request so Vercel env vars are always fresh
export function isDemoMode(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return !key || key.trim() === "" || key === "your_gemini_api_key_here";
}

// Keep DEMO_MODE as an alias for backwards compatibility but point to function
export const DEMO_MODE = false; // overridden per-request via isDemoMode()

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient() {
  if (isDemoMode()) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  return genAI;
}

export function getTextModel() {
  const client = getGeminiClient();
  if (!client) return null;
  return client.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export function getVisionModel() {
  const client = getGeminiClient();
  if (!client) return null;
  return client.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export function generateTrackingId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SB-${num}`;
}
