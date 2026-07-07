"use client";

import { useState, useCallback } from "react";
import {
  Camera,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Copy,
  MapPin,
  FileText,
  Zap,
  Shield,
} from "lucide-react";
import DemoBanner from "@/components/DemoBanner";

interface IssueResult {
  issueType: string;
  department: string;
  priority: string;
  escalationDept: string;
  trackingId: string;
  complaintText: string;
  submittedAt: string;
  demoMode: boolean;
}

interface Complaint extends IssueResult {
  imagePreview?: string;
  location: string;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  Critical: { label: "🚨 Critical", className: "priority-critical" },
  High: { label: "🔴 High", className: "priority-high" },
  Medium: { label: "🟡 Medium", className: "priority-medium" },
  Low: { label: "🟢 Low", className: "priority-low" },
};

const exampleIssues = [
  { icon: "🕳️", label: "Pothole", hint: "Large pothole on main road" },
  { icon: "💡", label: "Broken Streetlight", hint: "Street light not working for 3 days" },
  { icon: "🗑️", label: "Garbage Dump", hint: "Illegal garbage dumping near park" },
  { icon: "💧", label: "Water Leakage", hint: "Water pipe burst causing wastage" },
];

export default function IssueReporterPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IssueResult | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const setQuickFill = (hint: string) => {
    setDescription(hint);
  };

  async function submitIssue() {
    if (!description.trim() && !image) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (image) formData.append("image", image);
      formData.append("description", description);
      formData.append("location", location);

      const res = await fetch("/api/issue", { method: "POST", body: formData });
      const data: IssueResult & { error?: string } = await res.json();
      setResult(data);
      setDemoMode(data.demoMode);
      if (data.error) {
        setBannerMessage(`Gemini API Error: ${data.error}. Using demo mock response.`);
      } else {
        setBannerMessage(null);
      }

      // Add to complaint tracker
      setComplaints((prev) => [
        {
          ...data,
          imagePreview: imagePreview || undefined,
          location: location || "Location not specified",
        },
        ...prev,
      ]);
    } catch {
      setResult({
        issueType: "Unknown Issue",
        department: "Municipal Department",
        priority: "Medium",
        escalationDept: "Urban Local Body",
        trackingId: `SB-${Math.floor(1000 + Math.random() * 9000)}`,
        complaintText: "Please try again.",
        submittedAt: new Date().toISOString(),
        demoMode: true,
      });
      setDemoMode(true);
      setBannerMessage("Request failed. Using demo mock response.");
    } finally {
      setLoading(false);
    }
  }

  function copyComplaint() {
    if (result?.complaintText) {
      navigator.clipboard.writeText(result.complaintText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function resetForm() {
    setImage(null);
    setImagePreview(null);
    setDescription("");
    setLocation("");
    setResult(null);
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <DemoBanner show={demoMode} message={bannerMessage || undefined} />

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron/20 border border-saffron/30">
            <Camera className="h-7 w-7 text-saffron" />
          </div>
          <div className="inline-flex items-center gap-2 mb-3 rounded-full bg-saffron/10 border border-saffron/25 px-3 py-1 text-xs text-saffron">
            <Zap className="h-3 w-3" /> AI-Powered Civic Issue Reporter
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Report a Civic Issue</h1>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Upload a photo of any civic problem — potholes, garbage, broken streetlights — and our AI will categorize it,
            assign the right department, and generate an official complaint.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Input Form */}
          <div className="space-y-5">
            {/* Quick Examples */}
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">Quick Examples</p>
              <div className="grid grid-cols-2 gap-2">
                {exampleIssues.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => setQuickFill(ex.hint)}
                    className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 p-3 text-left hover:border-saffron/25 hover:bg-saffron/5 transition-all"
                  >
                    <span className="text-xl">{ex.icon}</span>
                    <span className="text-sm text-gray-300">{ex.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="glass rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <Camera className="inline h-4 w-4 mr-1.5 text-saffron" />
                Upload Issue Photo (Recommended)
              </label>

              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Issue" className="w-full max-h-56 object-cover" />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
                    📸 {image?.name}
                  </div>
                </div>
              ) : (
                <div
                  onDrop={handleImageDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                    dragOver
                      ? "border-saffron/60 bg-saffron/10"
                      : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                  }`}
                  onClick={() => document.getElementById("image-input")?.click()}
                >
                  <Upload className="mx-auto mb-2 h-8 w-8 text-gray-500" />
                  <p className="text-sm text-gray-400">Drop image here or <span className="text-saffron">click to upload</span></p>
                  <p className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP supported</p>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Issue Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="issue-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the issue in detail (e.g., 'Large pothole on MG Road causing accidents...')"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-saffron/40 focus:ring-1 focus:ring-saffron/20 transition-all resize-none"
              />
            </div>

            {/* Location */}
            <div className="glass rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <MapPin className="inline h-4 w-4 mr-1.5 text-blue-400" />
                Location
              </label>
              <input
                id="issue-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., MG Road, near City Mall, Bengaluru"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-saffron/40 focus:ring-1 focus:ring-saffron/20 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              id="submit-issue-btn"
              onClick={submitIssue}
              disabled={loading || (!description.trim() && !image)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-saffron py-4 text-base font-bold text-white shadow-lg shadow-saffron/25 transition-all hover:bg-saffron-light disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Analyze & Generate Complaint
                </>
              )}
            </button>
          </div>

          {/* Right: Results */}
          <div className="space-y-5">
            {!result && !loading && (
              <div className="glass rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-64">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-lg font-semibold text-gray-300">AI Analysis Will Appear Here</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Submit an issue to see department assignment, priority level, and auto-generated complaint.
                </p>
              </div>
            )}

            {loading && (
              <div className="glass rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-64">
                <div className="relative mb-4">
                  <Loader2 className="h-12 w-12 animate-spin text-saffron" />
                  <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-saffron/20 animate-ping" />
                </div>
                <p className="text-gray-300 font-medium">Analyzing image with Gemini Vision...</p>
                <p className="mt-1 text-sm text-gray-500">Categorizing issue and assigning department</p>
              </div>
            )}

            {result && (
              <div className="space-y-4 fade-in">
                {/* Tracking ID Banner */}
                <div className="rounded-2xl border border-saffron/30 bg-gradient-to-r from-saffron/15 to-saffron/5 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tracking ID</p>
                    <p className="text-2xl font-black text-saffron">{result.trackingId}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted {new Date(result.submittedAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 border-2 border-green-400">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                    <span className="text-xs text-green-400 font-medium">Submitted</span>
                  </div>
                </div>

                {/* Issue Details */}
                <div className="glass rounded-2xl p-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Issue Type</p>
                    <p className="text-sm font-semibold text-white">{result.issueType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Priority</p>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${priorityConfig[result.priority]?.className || "priority-medium"}`}>
                      {priorityConfig[result.priority]?.label || result.priority}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Responsible Department</p>
                    <p className="text-sm font-semibold text-blue-300">{result.department}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Escalation (if unresolved in 7 days)</p>
                    <p className="text-sm text-gray-400">{result.escalationDept}</p>
                  </div>
                </div>

                {/* Generated Complaint */}
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="flex items-center gap-2 font-bold text-white text-sm">
                      <FileText className="h-4 w-4 text-saffron" />
                      Generated Official Complaint
                    </h3>
                    <button
                      onClick={copyComplaint}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        copied
                          ? "bg-green-500/20 text-green-400"
                          : "border border-white/10 bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {copied ? (
                        <><CheckCircle className="h-3.5 w-3.5" /> Copied!</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /> Copy</>
                      )}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-xs text-gray-300 bg-white/3 rounded-xl p-4 max-h-56 overflow-y-auto leading-relaxed">
                    {result.complaintText}
                  </pre>
                </div>

                {/* Report another */}
                <button
                  onClick={resetForm}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  + Report Another Issue
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Complaint Tracker */}
        {complaints.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-saffron" />
              <h2 className="text-xl font-bold text-white">Complaint Tracker</h2>
              <span className="rounded-full bg-saffron/20 px-2 py-0.5 text-xs text-saffron font-bold">
                {complaints.length}
              </span>
            </div>
            <div className="space-y-3">
              {complaints.map((c, i) => (
                <div key={i} className="glass rounded-xl p-4 flex items-start gap-4 fade-in">
                  {c.imagePreview && (
                    <img
                      src={c.imagePreview}
                      alt="Issue"
                      className="h-14 w-14 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-white text-sm">{c.issueType}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.department}</p>
                        {c.location !== "Location not specified" && (
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {c.location}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-saffron">{c.trackingId}</p>
                        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${priorityConfig[c.priority]?.className || "priority-medium"}`}>
                          {c.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                    <span className="text-xs text-green-400">Submitted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
