"use client";

import { useState } from "react";
import {
  Star,
  ChevronDown,
  Search,
  Loader2,
  ExternalLink,
  Calendar,
  Zap,
  BadgeCheck,
} from "lucide-react";
import DemoBanner from "@/components/DemoBanner";

interface Scheme {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  amount: string;
  deadline: string;
  applyLink: string;
  ministry: string;
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh",
];

const occupations = [
  { value: "student", label: "🎓 Student" },
  { value: "farmer", label: "🌾 Farmer" },
  { value: "self_employed", label: "💼 Self-Employed / Business" },
  { value: "unemployed", label: "🔍 Unemployed" },
  { value: "homemaker", label: "🏠 Homemaker" },
  { value: "other", label: "👤 Other" },
];

const incomeCategories = [
  { value: "below_1l", label: "Below ₹1 Lakh/year" },
  { value: "1l_3l", label: "₹1 Lakh – ₹3 Lakh/year" },
  { value: "3l_6l", label: "₹3 Lakh – ₹6 Lakh/year" },
  { value: "above_6l", label: "Above ₹6 Lakh/year" },
];

const categoryColors: Record<string, string> = {
  Scholarship: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Subsidy: "bg-green-500/20 text-green-300 border-green-500/30",
  Welfare: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Health: "bg-red-500/20 text-red-300 border-red-500/30",
  Loan: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Housing: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Savings: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Sanitation: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Entrepreneurship: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Skill Development": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Girl Child": "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

export default function SchemeFinderPage() {
  const [form, setForm] = useState({
    age: "",
    occupation: "",
    state: "",
    incomeCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState<Scheme[] | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const getLang = () => {
    if (typeof window !== "undefined") return localStorage.getItem("sb_lang") || "en";
    return "en";
  };

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const canSubmit = form.age && form.occupation && form.state && form.incomeCategory;

  async function findSchemes() {
    if (!canSubmit) return;
    setLoading(true);
    setSchemes(null);
    setAiSummary("");

    try {
      const res = await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang: getLang() }),
      });
      const data = await res.json();
      setSchemes(data.schemes || []);
      setAiSummary(data.aiSummary || "");
      setDemoMode(data.demoMode);
      if (data.error) {
        setBannerMessage(`Gemini API Error: ${data.error}. Using demo mock response.`);
      } else {
        setBannerMessage(null);
      }
    } catch {
      setSchemes([]);
      setAiSummary("Unable to load schemes. Please try again.");
      setDemoMode(true);
      setBannerMessage("Request failed. Using demo mock response.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <DemoBanner show={demoMode} message={bannerMessage || undefined} />

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-500/30">
            <Star className="h-7 w-7 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Scheme Finder</h1>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Tell us about yourself and we&apos;ll show you every government scheme, scholarship, and subsidy you qualify for.
          </p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Age</label>
              <input
                id="scheme-age"
                type="number"
                min="1"
                max="100"
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
                placeholder="e.g., 22"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Occupation</label>
              <div className="relative">
                <select
                  id="scheme-occupation"
                  value={form.occupation}
                  onChange={(e) => update("occupation", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all cursor-pointer"
                >
                  <option value="" className="bg-navy-900">— Select —</option>
                  {occupations.map((o) => (
                    <option key={o.value} value={o.value} className="bg-navy-900">{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State / UT</label>
              <div className="relative">
                <select
                  id="scheme-state"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all cursor-pointer"
                >
                  <option value="" className="bg-navy-900">— Select State —</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s} className="bg-navy-900">{s}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Income */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Annual Income</label>
              <div className="relative">
                <select
                  id="scheme-income"
                  value={form.incomeCategory}
                  onChange={(e) => update("incomeCategory", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all cursor-pointer"
                >
                  <option value="" className="bg-navy-900">— Select Range —</option>
                  {incomeCategories.map((ic) => (
                    <option key={ic.value} value={ic.value} className="bg-navy-900">{ic.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            id="find-schemes-btn"
            onClick={findSchemes}
            disabled={loading || !canSubmit}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 text-base font-bold text-white shadow-lg shadow-purple-900/30 transition-all hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Finding Schemes...</>
            ) : (
              <><Search className="h-5 w-5" /> Find My Schemes</>
            )}
          </button>
        </div>

        {/* Results */}
        {schemes !== null && (
          <div className="space-y-6 fade-in">
            {/* AI Summary */}
            {aiSummary && (
              <div className="rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-500/10 to-transparent p-5">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-purple-400 mb-1 uppercase tracking-wide">AI Recommendation</p>
                    <p className="text-sm text-gray-300">{aiSummary}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Count */}
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">
                {schemes.length > 0
                  ? `${schemes.length} Scheme${schemes.length > 1 ? "s" : ""} Found`
                  : "No Schemes Found"}
              </h2>
              {schemes.length > 0 && (
                <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 text-xs font-bold text-purple-300">
                  {schemes.length} eligible
                </span>
              )}
            </div>

            {schemes.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-300">No Schemes in Database Match Your Profile</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your age, occupation or income category. You may still be eligible for state-specific schemes.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {schemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="glass rounded-2xl p-5 glass-hover transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{scheme.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm leading-snug">{scheme.name}</h3>
                        <span className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${categoryColors[scheme.category] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                          {scheme.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mb-3 leading-relaxed">{scheme.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs">
                        <BadgeCheck className="h-3.5 w-3.5 text-green-400 shrink-0" />
                        <span className="text-green-300 font-medium">{scheme.amount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                        <span className="text-gray-400">{scheme.deadline}</span>
                      </div>
                      <div className="text-xs text-gray-500">{scheme.ministry}</div>
                    </div>

                    <a
                      href={scheme.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 px-4 py-2.5 text-sm font-semibold text-purple-300 hover:bg-purple-600/40 hover:text-white transition-all"
                    >
                      Apply Now <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
