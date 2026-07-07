"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  RotateCcw,
  Zap,
} from "lucide-react";
import DemoBanner from "@/components/DemoBanner";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "How do I apply for a passport?",
  "What documents do I need for a PAN card?",
  "How to get a driving license?",
  "What scholarships are available for students?",
  "How to apply for Ayushman Bharat?",
  "What is PM-KISAN scheme?",
];

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `## Namaste! 🙏 I'm Smart Bharat AI

I'm your AI Civic Action Agent — here to help you navigate India's government services.

**I can help you with:**
- 📋 Document checklists for any government service
- 🛂 Passport, Driving License, PAN Card guidance  
- 🌾 Government schemes and scholarships
- 🏥 Health schemes like Ayushman Bharat
- 💼 Business loans like PM Mudra Yojana

**Ask me anything** — I'll give you a complete action plan!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getLang = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sb_lang") || "en";
    }
    return "en";
  };

  async function sendMessage(text?: string) {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;

    const userMsg: Message = { role: "user", content: userMessage, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history, lang: getLang() }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        role: "model",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setDemoMode(data.demoMode);
      if (data.error) {
        setBannerMessage(`Gemini API Error: ${data.error}. Using demo mock response.`);
      } else {
        setBannerMessage(null);
      }
      setHistory((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "model", content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "⚠️ Connection error. Please try again.",
          timestamp: new Date(),
        },
      ]);
      setDemoMode(true);
      setBannerMessage("Running in Demo Mode — Gemini API Limit Exhausted");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function resetChat() {
    setMessages([{
      role: "model",
      content: "Chat reset. How can I help you today?",
      timestamp: new Date(),
    }]);
    setHistory([]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <DemoBanner show={demoMode} message={bannerMessage || undefined} />

      {/* Header */}
      <div className="border-b border-white/8 bg-navy-900/50 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Bot className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="font-bold text-white">AI Civic Companion</h1>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Powered by Gemini AI
              </div>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "model" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
                  <Bot className="h-4 w-4 text-blue-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-saffron text-white rounded-tr-sm"
                    : "glass text-gray-200 rounded-tl-sm"
                }`}
              >
                {msg.role === "model" ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saffron/20 border border-saffron/30">
                  <User className="h-4 w-4 text-saffron" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
                <Bot className="h-4 w-4 text-blue-400" />
              </div>
              <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="mb-2 text-xs text-gray-500">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:border-saffron/30 hover:text-white transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/8 bg-navy-900/50 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any government service or scheme..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-saffron/40 focus:ring-1 focus:ring-saffron/20 transition-all"
                disabled={loading}
              />
            </div>
            <button
              id="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron text-white transition-all hover:bg-saffron-light disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-600">
            <Zap className="inline h-3 w-3 text-saffron" /> Powered by Google Gemini 2.0 Flash
          </p>
        </div>
      </div>
    </div>
  );
}
