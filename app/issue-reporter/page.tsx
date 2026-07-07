"use client";

import { useState, useCallback } from "react";
import {
  Camera,
  Upload,
  X,
  Loader2,
  CheckCircle,
  Copy,
  MapPin,
  FileText,
  Zap,
  Shield,
  ArrowRight,
  Share2
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
      setBannerMessage("Running in Demo Mode — Gemini API Limit Exhausted");
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

  function shareOnWhatsApp() {
    if (result?.complaintText) {
      const text = `I just reported a civic issue via Smart Bharat AI. \n\nTracking ID: ${result.trackingId}\nDepartment: ${result.department}\n\nComplaint:\n${result.complaintText}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
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
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-offwhite">
      <DemoBanner show={demoMode} message={bannerMessage || undefined} />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron/10 border border-saffron/20 shadow-sm shadow-saffron/5">
            <Camera className="h-8 w-8 text-saffron" />
          </div>
          <h1 className="text-4xl font-black text-navy-950 sm:text-5xl tracking-tight mb-4">Civic Issue Reporter</h1>
          <p className="text-lg text-gray-600 font-medium">
            Upload a photo of a civic problem. Our AI analyzes it, identifies the correct municipal department, and routes an official complaint instantly.
          </p>
        </div>

        {/* Workflow visualization */}
        <div className="mb-12 hidden md:flex items-center justify-center gap-4 text-sm font-bold text-gray-400">
           <div className="flex items-center gap-2 text-saffron bg-saffron/10 px-4 py-2 rounded-full border border-saffron/20">
             <span className="w-6 h-6 rounded-full bg-saffron text-white flex items-center justify-center">1</span> Upload Photo
           </div>
           <ArrowRight className="w-5 h-5 text-gray-300" />
           <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
             <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">2</span> AI Analysis
           </div>
           <ArrowRight className="w-5 h-5 text-gray-300" />
           <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
             <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">3</span> Official Routing
           </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Input Form */}
          <div className="space-y-6">
            {/* Quick Examples */}
            <div className="glass rounded-2xl p-6">
              <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">Quick Examples</p>
              <div className="grid grid-cols-2 gap-3">
                {exampleIssues.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => setQuickFill(ex.hint)}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left hover:border-saffron hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{ex.icon}</span>
                    <span className="text-sm font-semibold text-navy-950">{ex.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="glass rounded-2xl p-6">
              <label className="block text-sm font-bold text-navy-950 mb-3">
                <Camera className="inline h-4 w-4 mr-1.5 text-saffron" />
                Upload Issue Photo (Recommended)
              </label>

              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  <img src={imagePreview} alt="Issue" className="w-full max-h-64 object-cover" />
                  <button
                    onClick={removeImage}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-md hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-navy-950 shadow-sm">
                    📸 {image?.name}
                  </div>
                </div>
              ) : (
                <div
                  onDrop={handleImageDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
                    dragOver
                      ? "border-saffron bg-saffron/5"
                      : "border-gray-300 bg-gray-50 hover:border-saffron/50 hover:bg-white"
                  }`}
                  onClick={() => document.getElementById("image-input")?.click()}
                >
                  <Upload className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                  <p className="text-sm font-medium text-gray-600">Drop image here or <span className="text-saffron font-bold">click to upload</span></p>
                  <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG, WEBP supported</p>
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

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Description */}
              <div className="glass rounded-2xl p-6 sm:col-span-2">
                <label className="block text-sm font-bold text-navy-950 mb-3">
                  Issue Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="issue-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the issue in detail (e.g., 'Large pothole on MG Road causing accidents...')"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-950 font-medium placeholder-gray-400 shadow-sm outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all resize-none"
                />
              </div>

              {/* Location */}
              <div className="glass rounded-2xl p-6 sm:col-span-2">
                <label className="block text-sm font-bold text-navy-950 mb-3">
                  <MapPin className="inline h-4 w-4 mr-1.5 text-blue-500" />
                  Location
                </label>
                <input
                  id="issue-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., MG Road, near City Mall, Bengaluru"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-950 font-medium placeholder-gray-400 shadow-sm outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="submit-issue-btn"
              onClick={submitIssue}
              disabled={loading || (!description.trim() && !image)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-navy-950 py-4 text-base font-bold text-white shadow-lg shadow-navy-950/20 transition-all hover:bg-navy-900 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-saffron" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 text-saffron" />
                  Analyze & Generate Complaint
                </>
              )}
            </button>
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            {!result && !loading && (
              <div className="glass rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                   <Shield className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-navy-950">AI Analysis Pending</h3>
                <p className="mt-3 text-gray-500 font-medium max-w-xs mx-auto">
                  Submit an issue to automatically generate an official municipal complaint, complete with department routing.
                </p>
              </div>
            )}

            {loading && (
              <div className="glass rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="relative mb-8">
                  <div className="h-24 w-24 rounded-full bg-saffron/10 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-saffron" />
                  </div>
                  <div className="absolute inset-0 h-24 w-24 rounded-full border-2 border-saffron animate-ping opacity-20" />
                </div>
                <h3 className="text-xl font-bold text-navy-950">Processing Image...</h3>
                <p className="mt-2 text-gray-500 font-medium max-w-xs mx-auto">Categorizing issue and determining the responsible municipal department via Gemini AI.</p>
              </div>
            )}

            {result && (
              <div className="space-y-4 fade-in">
                {/* Tracking ID Banner */}
                <div className="rounded-2xl border border-saffron/20 bg-white shadow-lg overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron to-saffron-light" />
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Tracking ID</p>
                      <p className="text-3xl font-black text-navy-950">{result.trackingId}</p>
                      <p className="text-xs font-semibold text-gray-400 mt-1">
                        Recorded {new Date(result.submittedAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 border border-green-200">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <span className="text-xs text-green-600 font-bold uppercase tracking-wider">Routed</span>
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div className="glass rounded-2xl p-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Issue Type</p>
                    <p className="text-sm font-bold text-navy-950">{result.issueType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Priority</p>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${priorityConfig[result.priority]?.className || "priority-medium"}`}>
                      {priorityConfig[result.priority]?.label || result.priority}
                    </span>
                  </div>
                  <div className="col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Assigned Department</p>
                    <p className="text-base font-bold text-navy-950">{result.department}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Escalation (if unresolved &gt; 7 days)</p>
                    <p className="text-sm font-semibold text-gray-600">{result.escalationDept}</p>
                  </div>
                </div>

                {/* Generated Complaint */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex flex-wrap items-center justify-between mb-4 border-b border-gray-100 pb-4 gap-2">
                    <h3 className="flex items-center gap-2 font-bold text-navy-950 text-sm uppercase tracking-wide">
                      <FileText className="h-4 w-4 text-saffron" />
                      Official Draft
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyComplaint}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                          copied
                            ? "bg-green-100 text-green-700"
                            : "border border-gray-200 bg-white text-gray-600 hover:text-navy-950 shadow-sm"
                        }`}
                      >
                        {copied ? (
                          <><CheckCircle className="h-3.5 w-3.5" /> Copied!</>
                        ) : (
                          <><Copy className="h-3.5 w-3.5" /> Copy</>
                        )}
                      </button>
                      <button
                        onClick={shareOnWhatsApp}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all bg-green-500 text-white hover:bg-green-600 shadow-sm"
                      >
                        <Share2 className="h-3.5 w-3.5" /> WhatsApp
                      </button>
                    </div>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-gray-600 font-medium bg-gray-50 rounded-xl p-5 border border-gray-100 max-h-64 overflow-y-auto leading-relaxed">
                    {result.complaintText}
                  </pre>
                </div>

                {/* Report another */}
                <button
                  onClick={resetForm}
                  className="w-full rounded-xl border border-gray-200 bg-white py-4 text-sm font-bold text-gray-600 shadow-sm hover:text-navy-950 hover:bg-gray-50 transition-all"
                >
                  Report Another Issue
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Complaint Tracker */}
        {complaints.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-navy-950 rounded-xl flex items-center justify-center shadow-md">
                 <Shield className="h-5 w-5 text-saffron" />
              </div>
              <h2 className="text-2xl font-black text-navy-950">Active Tracker</h2>
              <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs text-saffron font-bold border border-saffron/20">
                {complaints.length} Open
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {complaints.map((c, i) => (
                <div key={i} className="glass rounded-2xl p-5 flex items-start gap-4 fade-in hover:border-saffron/30 hover:shadow-md transition-all cursor-default">
                  {c.imagePreview ? (
                    <img
                      src={c.imagePreview}
                      alt="Issue"
                      className="h-16 w-16 rounded-xl object-cover shrink-0 border border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                       <Camera className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-navy-950 text-sm truncate">{c.issueType}</p>
                        <p className="text-xs font-semibold text-gray-500 mt-1 truncate">{c.department}</p>
                        {c.location !== "Location not specified" && (
                          <p className="text-xs font-medium text-gray-400 mt-1.5 flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 shrink-0" /> {c.location}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-saffron tracking-wider bg-saffron/10 px-2 py-1 rounded-md">{c.trackingId}</p>
                      </div>
                    </div>
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
