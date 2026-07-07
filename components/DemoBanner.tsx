"use client";

import { AlertTriangle } from "lucide-react";

interface DemoBannerProps {
  show?: boolean;
  message?: string;
}

export default function DemoBanner({ show, message }: DemoBannerProps) {
  if (!show) return null;
  return (
    <div className="demo-banner flex items-center justify-center gap-2 px-4 py-2 text-sm text-amber-300">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>
        {message ? (
          <strong>{message}</strong>
        ) : (
          <>
            <strong>Running in Demo Mode</strong> — Add{" "}
            <code className="rounded bg-white/10 px-1 text-xs">GEMINI_API_KEY</code> to{" "}
            <code className="rounded bg-white/10 px-1 text-xs">.env.local</code> for live AI responses.
          </>
        )}
      </span>
    </div>
  );
}
