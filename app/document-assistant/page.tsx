"use client";

import { useState } from "react";
import {
  FileText,
  ChevronDown,
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  Phone,
  Loader2,
  Info,
} from "lucide-react";
import servicesData from "@/data/services.json";
import DemoBanner from "@/components/DemoBanner";

type ServiceKey = keyof typeof servicesData;
type Service = (typeof servicesData)[ServiceKey];

const serviceOptions = Object.entries(servicesData).map(([key, val]) => ({
  key: key as ServiceKey,
  label: (val as Service).name,
  icon: (val as Service).icon,
}));

const priorityColors: Record<number, string> = {
  0: "text-red-400",
  1: "text-orange-400",
  2: "text-yellow-400",
  3: "text-green-400",
};

export default function DocumentAssistantPage() {
  const [selectedKey, setSelectedKey] = useState<ServiceKey | "">("");
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set());

  function handleSelect(key: ServiceKey | "") {
    setSelectedKey(key);
    setCheckedDocs(new Set());
    if (!key) {
      setService(null);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setService(servicesData[key as ServiceKey] as Service);
      setLoading(false);
    }, 400);
  }

  function toggleDoc(idx: number) {
    setCheckedDocs((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  const progress = service ? Math.round((checkedDocs.size / (service as Service & {documents: string[]}).documents.length) * 100) : 0;

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/20 border border-green-500/30">
            <FileText className="h-7 w-7 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Document Assistant</h1>
          <p className="mt-3 text-gray-400">
            Select a government service to get a personalized document checklist and step-by-step guide.
          </p>
        </div>

        {/* Service Selector */}
        <div className="glass rounded-2xl p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Government Service
          </label>
          <div className="relative">
            <select
              id="service-selector"
              value={selectedKey}
              onChange={(e) => handleSelect(e.target.value as ServiceKey | "")}
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all cursor-pointer"
            >
              <option value="" className="bg-navy-900">— Choose a service —</option>
              {serviceOptions.map((opt) => (
                <option key={opt.key} value={opt.key} className="bg-navy-900">
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="glass rounded-2xl p-10 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-green-400" />
            <p className="mt-3 text-gray-400">Loading checklist...</p>
          </div>
        )}

        {/* Service Details */}
        {!loading && service && (
          <div className="space-y-6 fade-in">
            {/* Service Header */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{service.name}</h2>
                  <p className="text-gray-400 mt-1">{service.description}</p>
                  <span className="mt-2 inline-block rounded-full bg-green-500/15 border border-green-500/25 px-3 py-0.5 text-xs text-green-400">
                    {service.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">Document Progress</span>
                <span className="text-sm font-bold text-green-400">{checkedDocs.size}/{(service as Service & {documents: string[]}).documents.length} collected</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progress === 100 && (
                <p className="mt-2 text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> All documents collected — ready to apply!
                </p>
              )}
            </div>

            {/* Documents Checklist */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-white">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Required Documents
              </h3>
              <div className="space-y-3">
                {(service as Service & {documents: string[]}).documents.map((doc, i) => (
                  <div
                    key={i}
                    onClick={() => toggleDoc(i)}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                      checkedDocs.has(i)
                        ? "border-green-500/30 bg-green-500/10 text-green-300"
                        : "border-white/8 bg-white/3 text-gray-300 hover:border-white/15"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                        checkedDocs.has(i)
                          ? "border-green-400 bg-green-400"
                          : "border-gray-600"
                      }`}
                    >
                      {checkedDocs.has(i) && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{doc}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                <Info className="h-3.5 w-3.5" />
                Click to mark documents as collected
              </p>
            </div>

            {/* Application Steps */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-4 font-bold text-white flex items-center gap-2">
                <span className="text-lg">📋</span> Application Steps
              </h3>
              <div className="space-y-3">
                {(service as Service & {steps: string[]}).steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-saffron/20 border border-saffron/30 text-xs font-bold text-saffron">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-300 pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline + Fees */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <h3 className="font-bold text-white">Timeline</h3>
                </div>
                <p className="text-sm text-gray-300">{service.timeline}</p>
              </div>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-yellow-400" />
                  <h3 className="font-bold text-white">Government Fees</h3>
                </div>
                <div className="space-y-1">
                  {Object.entries(service.fees).map(([type, amount]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{type}:</span>
                      <span className="font-medium text-yellow-300">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Official Links */}
            <div className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Official Portal</p>
                <a
                  href={service.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {service.officialLink}
                </a>
              </div>
              {service.helpline && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Helpline</p>
                  <div className="flex items-center gap-1.5 text-green-400 font-medium text-sm">
                    <Phone className="h-4 w-4" />
                    {service.helpline}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !service && (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="mx-auto mb-4 text-5xl">🏛️</div>
            <h3 className="text-lg font-semibold text-gray-300">Select a Service Above</h3>
            <p className="mt-2 text-sm text-gray-500">
              Choose from Passport, Driving License, PAN Card, Birth Certificate, and more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
