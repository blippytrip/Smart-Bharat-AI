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
  Scholarship: "bg-blue-50 text-blue-700 border-blue-200",
  Subsidy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Welfare: "bg-purple-50 text-purple-700 border-purple-200",
  Health: "bg-red-50 text-red-700 border-red-200",
  Loan: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Housing: "bg-orange-50 text-orange-700 border-orange-200",
  Savings: "bg-teal-50 text-teal-700 border-teal-200",
  Sanitation: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Entrepreneurship: "bg-pink-50 text-pink-700 border-pink-200",
  "Skill Development": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Girl Child": "bg-rose-50 text-rose-700 border-rose-200",
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
      setBannerMessage("Running in Demo Mode — Gemini API Limit Exhausted");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-offwhite">
      <DemoBanner show={demoMode} message={bannerMessage || undefined} />

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100 shadow-sm">
            <Star className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-black text-navy-950 sm:text-5xl tracking-tight">Scheme Finder</h1>
          <p className="mt-4 text-lg text-gray-600 font-medium max-w-xl mx-auto">
            Tell us about yourself and we&apos;ll show you every government scheme, scholarship, and subsidy you qualify for.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 mb-10 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-60"></div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Age */}
            <div>
              <label className="block text-sm font-bold text-navy-950 mb-2 uppercase tracking-wide">Your Age</label>
              <input
                id="scheme-age"
                type="number"
                min="1"
                max="100"
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
                placeholder="e.g., 22"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-navy-950 font-semibold text-sm placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-bold text-navy-950 mb-2 uppercase tracking-wide">Occupation</label>
              <div className="relative">
                <select
                  id="scheme-occupation"
                  value={form.occupation}
                  onChange={(e) => update("occupation", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold text-navy-950 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all cursor-pointer shadow-inner"
                >
                  <option value="">— Select —</option>
                  {occupations.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-bold text-navy-950 mb-2 uppercase tracking-wide">State / UT</label>
              <div className="relative">
                <select
                  id="scheme-state"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold text-navy-950 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all cursor-pointer shadow-inner"
                >
                  <option value="">— Select State —</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Income */}
            <div>
              <label className="block text-sm font-bold text-navy-950 mb-2 uppercase tracking-wide">Annual Income</label>
              <div className="relative">
                <select
                  id="scheme-income"
                  value={form.incomeCategory}
                  onChange={(e) => update("incomeCategory", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold text-navy-950 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all cursor-pointer shadow-inner"
                >
                  <option value="">— Select Range —</option>
                  {incomeCategories.map((ic) => (
                    <option key={ic.value} value={ic.value}>{ic.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <button
            id="find-schemes-btn"
            onClick={findSchemes}
            disabled={loading || !canSubmit}
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-navy-950 py-4 text-base font-bold text-white shadow-lg shadow-navy-950/20 transition-all hover:bg-navy-900 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin text-purple-400" /> Finding Schemes...</>
            ) : (
              <><Search className="h-5 w-5 text-purple-400" /> Find My Schemes</>
            )}
          </button>
        </div>

        {/* Results */}
        {schemes !== null && (
          <div className="space-y-8 fade-in">
            {/* AI Summary */}
            {aiSummary && (
              <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-2 rounded-lg shrink-0 mt-0.5">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-600 mb-1.5 uppercase tracking-wide">AI Recommendation</p>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">{aiSummary}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Count */}
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-navy-950">
                {schemes.length > 0
                  ? `${schemes.length} Scheme${schemes.length > 1 ? "s" : ""} Found`
                  : "No Schemes Found"}
              </h2>
              {schemes.length > 0 && (
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  {schemes.length} eligible
                </span>
              )}
            </div>

            {schemes.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm">
                <div className="text-6xl mb-6 drop-shadow-md">🔍</div>
                <h3 className="text-2xl font-black text-navy-950">No Schemes Found</h3>
                <p className="mt-3 text-base font-medium text-gray-500 max-w-sm mx-auto">
                  Try adjusting your age, occupation or income category. You may still be eligible for state-specific schemes.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {schemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-4xl drop-shadow-sm">{scheme.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-navy-950 text-base leading-snug">{scheme.name}</h3>
                        <span className={`mt-2 inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${categoryColors[scheme.category] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                          {scheme.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-gray-600 mb-5 leading-relaxed flex-1">{scheme.description}</p>

                    <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2.5 text-sm">
                        <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-emerald-700 font-bold">{scheme.amount}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm">
                        <Calendar className="h-4 w-4 text-saffron shrink-0" />
                        <span className="text-gray-600 font-medium">{scheme.deadline}</span>
                      </div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-1">{scheme.ministry}</div>
                    </div>

                    <a
                      href={scheme.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-3.5 text-sm font-bold text-navy-950 hover:bg-gray-50 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm"
                    >
                      Apply Now <ExternalLink className="h-4 w-4" />
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
