import { GoogleGenerativeAI } from "@google/generative-ai";

export const DEMO_MODE = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here";

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient() {
  if (DEMO_MODE) return null;
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
