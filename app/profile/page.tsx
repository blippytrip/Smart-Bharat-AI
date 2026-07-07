"use client";

import { useState } from "react";
import {
  UserCircle2,
  ShieldCheck,
  Award,
  Wallet,
  Home,
  FileText,
  BadgeCheck,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Amit Kumar",
    location: "Bengaluru, Karnataka",
    ageGender: "32 Years • Male",
    occupation: "Small Business Owner",
    income: "₹2.5 Lakhs",
    residence: "Urban • Rented"
  });

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-offwhite">
      <div className="mx-auto max-w-5xl">
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-navy-950 flex items-center justify-center text-3xl text-white font-black shadow-lg shadow-navy-950/20">
                {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="KYC Verified">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                {isEditing ? (
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="text-3xl font-black text-navy-950 tracking-tight bg-white border-b-2 border-saffron focus:outline-none w-auto max-w-[200px]" />
                ) : (
                  <h1 className="text-3xl font-black text-navy-950 tracking-tight">{profile.name}</h1>
                )}
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified Citizen
                </span>
              </div>
              <p className="text-gray-500 font-medium flex items-center gap-2">
                UID: XXXX-XXXX-4912 <span className="text-gray-300">•</span> {isEditing ? <input type="text" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} className="bg-white border-b border-gray-300 focus:border-saffron focus:outline-none" /> : profile.location}
              </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => {
                  if (isEditing) {
                    // Simulated save
                  }
                  setIsEditing(!isEditing);
                }}
                className={`flex-1 md:flex-none px-6 py-3 font-bold text-sm rounded-xl border transition-colors ${isEditing ? 'bg-saffron text-white border-saffron hover:bg-saffron-dark' : 'bg-gray-50 text-navy-950 border-gray-200 hover:bg-gray-100'}`}
              >
                {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
              <button className="flex-1 md:flex-none px-6 py-3 bg-navy-950 text-white font-bold text-sm rounded-xl shadow-lg shadow-navy-950/20 hover:bg-navy-900 transition-all hover:-translate-y-0.5">
                Refresh DigiLocker
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "overview", label: "Auto-Eligibility Overview", icon: TrendingUp },
            { id: "documents", label: "Verified Documents", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-navy-950 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-navy-950"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Col: Demographic Data */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide mb-4">Demographic Data</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Age & Gender</p>
                    {isEditing ? (
                      <input type="text" value={profile.ageGender} onChange={e => setProfile({...profile, ageGender: e.target.value})} className="w-full text-sm font-bold text-navy-950 bg-white p-2.5 rounded-lg border border-gray-300 focus:border-saffron focus:outline-none transition-all" />
                    ) : (
                      <p className="text-sm font-bold text-navy-950 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{profile.ageGender}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Occupation</p>
                    {isEditing ? (
                      <input type="text" value={profile.occupation} onChange={e => setProfile({...profile, occupation: e.target.value})} className="w-full text-sm font-bold text-navy-950 bg-white p-2.5 rounded-lg border border-gray-300 focus:border-saffron focus:outline-none transition-all" />
                    ) : (
                      <p className="text-sm font-bold text-navy-950 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center gap-2">
                        <Award className="h-4 w-4 text-saffron" /> {profile.occupation}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Annual Income</p>
                    {isEditing ? (
                      <input type="text" value={profile.income} onChange={e => setProfile({...profile, income: e.target.value})} className="w-full text-sm font-bold text-navy-950 bg-white p-2.5 rounded-lg border border-gray-300 focus:border-saffron focus:outline-none transition-all" />
                    ) : (
                      <p className="text-sm font-bold text-navy-950 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-emerald-500" /> {profile.income} (Verified)
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Residence</p>
                    {isEditing ? (
                      <input type="text" value={profile.residence} onChange={e => setProfile({...profile, residence: e.target.value})} className="w-full text-sm font-bold text-navy-950 bg-white p-2.5 rounded-lg border border-gray-300 focus:border-saffron focus:outline-none transition-all" />
                    ) : (
                      <p className="text-sm font-bold text-navy-950 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center gap-2">
                        <Home className="h-4 w-4 text-blue-500" /> {profile.residence}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Eligibility & Actions */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black text-navy-950">Pre-Approved Schemes</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Based on your verified DigiLocker data.</p>
                  </div>
                  <Link href="/scheme-finder" className="text-sm font-bold text-saffron hover:text-saffron-dark flex items-center gap-1">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "Mudra Loan Scheme", desc: "Up to ₹50,000 for small business.", match: "98%", status: "Eligible" },
                    { name: "Ayushman Bharat", desc: "Health cover of ₹5 Lakhs per family.", match: "100%", status: "Enrolled" },
                  ].map((scheme, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-sm transition-all">
                      <div>
                        <h4 className="font-bold text-navy-950 text-base">{scheme.name}</h4>
                        <p className="text-sm text-gray-500 font-medium mt-1">{scheme.desc}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                          {scheme.match} Match
                        </span>
                        {scheme.status === "Eligible" ? (
                          <button className="px-4 py-2 bg-navy-950 text-white text-xs font-bold rounded-lg hover:bg-navy-900 transition-colors">
                            Apply 1-Click
                          </button>
                        ) : (
                          <span className="px-4 py-2 bg-gray-200 text-gray-500 text-xs font-bold rounded-lg flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" /> Enrolled
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-black text-navy-950 mb-4">Recent Civic Reports</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-saffron/30 bg-saffron/5">
                  <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center border border-saffron/20 shrink-0">
                    <AlertTriangle className="h-6 w-6 text-saffron" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-bold text-navy-950">Broken Streetlight</h4>
                    <p className="text-sm text-gray-600 mt-0.5">Reported on 1st Cross, Indiranagar</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="inline-block bg-white text-saffron font-bold text-xs px-3 py-1.5 rounded-lg border border-saffron/20">
                      In Progress
                    </span>
                    <p className="text-xs text-gray-400 font-medium mt-1">ID: SB-4911</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-black text-navy-950 mb-6">Connected DigiLocker Documents</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Aadhaar Card", id: "XXXX-XXXX-4912", date: "Verified 2 months ago", icon: UserCircle2, color: "text-blue-600", bg: "bg-blue-50" },
                { name: "PAN Card", id: "ABCDE1234F", date: "Verified 2 months ago", icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
                { name: "Income Certificate", id: "INC-2023-8991", date: "Verified 1 week ago", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map((doc, i) => (
                <div key={i} className="p-5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                  <div className={`h-12 w-12 rounded-xl ${doc.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <doc.icon className={`h-6 w-6 ${doc.color}`} />
                  </div>
                  <h4 className="font-bold text-navy-950 mb-1">{doc.name}</h4>
                  <p className="text-sm font-medium text-gray-600 mb-2">{doc.id}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> {doc.date}
                  </p>
                </div>
              ))}
              <div className="p-5 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer min-h-[200px]">
                <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3">
                  <span className="text-2xl font-black text-gray-400">+</span>
                </div>
                <h4 className="font-bold text-navy-950 mb-1">Add Document</h4>
                <p className="text-xs text-gray-500 font-medium max-w-[150px]">Link more documents via DigiLocker</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
