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
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-offwhite">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
            <FileText className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-navy-950 sm:text-5xl tracking-tight">Document Assistant</h1>
          <p className="mt-4 text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Select a government service to get a personalized document checklist and step-by-step application guide.
          </p>
        </div>

        {/* Service Selector */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
          <label className="block text-sm font-bold text-navy-950 mb-3 uppercase tracking-wide">
            Select Government Service
          </label>
          <div className="relative">
            <select
              id="service-selector"
              value={selectedKey}
              onChange={(e) => handleSelect(e.target.value as ServiceKey | "")}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-base font-semibold text-navy-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all cursor-pointer shadow-inner"
            >
              <option value="">— Choose a service —</option>
              {serviceOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-navy-950">Generating Checklist...</h3>
            <p className="mt-2 text-gray-500 font-medium">Fetching official requirements from government portals</p>
          </div>
        )}

        {/* Service Details */}
        {!loading && service && (
          <div className="space-y-6 fade-in">
            {/* Service Header */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-5">
                <span className="text-5xl drop-shadow-sm">{service.icon}</span>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-navy-950 tracking-tight">{service.name}</h2>
                  <p className="text-gray-600 font-medium mt-1 leading-relaxed">{service.description}</p>
                  <span className="mt-3 inline-block rounded-md bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    {service.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-navy-950 uppercase tracking-wide">Document Progress</span>
                <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{checkedDocs.size} of {(service as Service & {documents: string[]}).documents.length}</span>
              </div>
              <div className="h-3 rounded-full bg-gray-100 overflow-hidden shadow-inner border border-gray-200/50">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progress === 100 && (
                <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 p-3 rounded-xl font-bold text-sm">
                  <CheckCircle className="h-5 w-5" /> 
                  All documents collected! You are ready to apply.
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-5">
              {/* Documents Checklist (Left Col) */}
              <div className="md:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full">
                  <h3 className="mb-5 flex items-center gap-2 font-black text-navy-950 text-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Required Documents
                  </h3>
                  <div className="space-y-3">
                    {(service as Service & {documents: string[]}).documents.map((doc, i) => (
                      <div
                        key={i}
                        onClick={() => toggleDoc(i)}
                        className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-md ${
                          checkedDocs.has(i)
                            ? "border-emerald-200 bg-emerald-50/50"
                            : "border-gray-200 bg-white hover:border-emerald-300"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                            checkedDocs.has(i)
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {checkedDocs.has(i) && (
                            <svg className="h-4 w-4 text-white" viewBox="0 0 12 12" fill="currentColor">
                              <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${checkedDocs.has(i) ? "text-emerald-900" : "text-navy-950"}`}>{doc}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <Info className="h-4 w-4" />
                    Click to mark documents as collected
                  </p>
                </div>
              </div>

              {/* Application Steps & Info (Right Col) */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="mb-5 font-black text-navy-950 flex items-center gap-2 text-lg">
                    <span className="text-xl">📋</span> Step-by-Step
                  </h3>
                  <div className="space-y-4">
                    {(service as Service & {steps: string[]}).steps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saffron/10 border border-saffron/20 text-sm font-black text-saffron">
                          {i + 1}
                        </div>
                        <p className="text-sm font-medium text-gray-700 pt-1 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <h3 className="font-bold text-navy-950 uppercase tracking-wide text-xs">Timeline</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">{service.timeline}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-5 w-5 text-saffron" />
                      <h3 className="font-bold text-navy-950 uppercase tracking-wide text-xs">Government Fees</h3>
                    </div>
                    <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      {Object.entries(service.fees).map(([type, amount]) => (
                        <div key={type} className="flex justify-between items-center text-sm border-b border-gray-200/50 pb-2 last:border-0 last:pb-0">
                          <span className="text-gray-500 font-medium capitalize">{type}</span>
                          <span className="font-black text-navy-950">{amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Links */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Official Portal</p>
                <a
                  href={service.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-sm transition-colors group bg-blue-50 px-4 py-2 rounded-lg border border-blue-100"
                >
                  <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  {service.officialLink}
                </a>
              </div>
              {service.helpline && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Helpline</p>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
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
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm">
            <div className="mx-auto mb-6 text-6xl drop-shadow-md">🏛️</div>
            <h3 className="text-2xl font-black text-navy-950">Select a Service Above</h3>
            <p className="mt-3 text-base font-medium text-gray-500 max-w-sm mx-auto">
              Choose from Passport, Driving License, PAN Card, Birth Certificate, and more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
