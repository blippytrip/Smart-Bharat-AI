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
  Mic,
  MicOff,
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
  const [isListening, setIsListening] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Default to Indian English

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInput(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const getLang = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sb_lang") || "en";
    }
    return "en";
  };

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Set language before starting
      const lang = getLang();
      recognitionRef.current.lang = lang === "hi" ? "hi-IN" : lang === "te" ? "te-IN" : "en-IN";
      setInput("");
      recognitionRef.current.start();
    }
  };

  async function sendMessage(text?: string) {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
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

  const thinkingStates = [
    "Analyzing query...",
    "Searching government databases...",
    "Cross-referencing official requirements...",
    "Synthesizing response...",
  ];

  const [thinkingIndex, setThinkingIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setThinkingIndex(0);
      interval = setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % thinkingStates.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-offwhite">
      <DemoBanner show={demoMode} message={bannerMessage || undefined} />

      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 shadow-sm z-10">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-black text-navy-950">AI Civic Companion</h1>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                Powered by Gemini AI
              </div>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:text-navy-950 hover:bg-gray-50 shadow-sm transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-4 fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "model" && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-navy-950 text-white rounded-tr-sm"
                    : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm"
                }`}
              >
                {msg.role === "model" ? (
                  <div className="prose prose-sm max-w-none prose-headings:text-navy-950 prose-headings:font-black prose-p:text-gray-600 prose-p:font-medium prose-li:text-gray-600 prose-li:font-medium prose-strong:text-navy-950 prose-strong:font-bold">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="font-medium">{msg.content}</span>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-saffron/20 border border-saffron/30">
                  <User className="h-5 w-5 text-saffron" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 fade-in">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4">
                <div className="flex items-center gap-3 text-gray-500 text-sm font-bold min-w-[200px]">
                  <Loader2 className="h-4 w-4 animate-spin text-saffron shrink-0" />
                  <span className="animate-pulse">{thinkingStates[thinkingIndex]}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:border-saffron hover:text-navy-950 shadow-sm transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-5 sm:px-6 z-10 relative">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-3 relative">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any government service or scheme..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 pr-14 text-sm font-medium text-navy-950 placeholder-gray-400 shadow-inner outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 focus:bg-white transition-all"
                disabled={loading}
              />
              <button
                onClick={toggleListen}
                disabled={loading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                  isListening 
                    ? "bg-red-50 text-red-500 animate-pulse" 
                    : "text-gray-400 hover:bg-gray-100 hover:text-navy-950"
                }`}
                title="Voice input"
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </div>
            <button
              id="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={loading || (!input.trim() && !isListening)}
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-950 text-white shadow-md transition-all hover:bg-navy-900 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-saffron" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="mt-3 text-center text-xs font-semibold text-gray-400">
            <Zap className="inline h-3.5 w-3.5 text-saffron mb-0.5" /> Powered by Google Gemini 2.0 Flash
          </p>
        </div>
      </div>
    </div>
  );
}
