import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function keywordSearch(text: string, keywordsMap: Record<string, string[]>): string | null {
  const lower = text.toLowerCase();
  for (const [key, keywords] of Object.entries(keywordsMap)) {
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return key;
    }
  }
  return null;
}
