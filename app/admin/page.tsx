"use client";

import { useState } from "react";
import {
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const mockIssues = [
  {
    id: "SB-4912",
    type: "Pothole",
    location: "MG Road, Near City Mall",
    priority: "High",
    status: "Pending",
    time: "2 hours ago",
    department: "Public Works",
  },
  {
    id: "SB-4911",
    type: "Broken Streetlight",
    location: "1st Cross, Indiranagar",
    priority: "Medium",
    status: "In Progress",
    time: "5 hours ago",
    department: "Electricity Board",
  },
  {
    id: "SB-4910",
    type: "Garbage Dump",
    location: "Koramangala 4th Block",
    priority: "Low",
    status: "Resolved",
    time: "1 day ago",
    department: "Sanitation",
  },
  {
    id: "SB-4909",
    type: "Water Leakage",
    location: "HSR Layout Sector 2",
    priority: "Critical",
    status: "Pending",
    time: "1 day ago",
    department: "Water Supply",
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("issues");

  return (
    <div className="min-h-screen bg-offwhite flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-black text-navy-950">Municipal Admin</h1>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wide">Command Center</p>
        </div>
        <div className="p-4 space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("issues")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "issues" ? "bg-navy-950 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-navy-950"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
            Civic Issues
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "analytics" ? "bg-navy-950 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-navy-950"
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "users" ? "bg-navy-950 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-navy-950"
            }`}
          >
            <Users className="h-5 w-5" />
            Citizens
          </button>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Link href="/" className="text-sm font-bold text-saffron hover:text-saffron-light flex items-center gap-2">
            &larr; Back to App
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tracking IDs, locations, or departments..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-navy-950 placeholder-gray-400 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/20 transition-all shadow-inner"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron font-bold">
              AD
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-navy-950 tracking-tight">Active Issues</h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm">
                  <Filter className="h-4 w-4" /> Filter
                </button>
                <button className="px-4 py-2 bg-navy-950 text-white rounded-lg text-sm font-bold hover:bg-navy-900 shadow-sm">
                  Export Report
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Issues Today", value: "142", trend: "+12%", icon: AlertTriangle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                { label: "Resolved", value: "89", trend: "+5%", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                { label: "Pending Review", value: "45", trend: "-2%", icon: Clock, color: "text-saffron", bg: "bg-saffron/10", border: "border-saffron/20" },
                { label: "Critical Escalations", value: "8", trend: "+1", icon: TrendingUp, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${stat.bg} ${stat.border}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{stat.trend}</span>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-navy-950 mb-1">{stat.value}</p>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Tracking ID</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Issue Type</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockIssues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-sm font-black text-navy-950">{issue.id}</td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-navy-950">{issue.type}</p>
                          <p className="text-xs font-medium text-gray-500">{issue.department}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {issue.location}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            issue.priority === "Critical" ? "bg-red-50 text-red-700 border border-red-200" :
                            issue.priority === "High" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                            issue.priority === "Medium" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                            "bg-green-50 text-green-700 border border-green-200"
                          }`}>
                            {issue.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            issue.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            issue.status === "In Progress" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                            "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}>
                            {issue.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-500">{issue.time}</td>
                        <td className="py-4 px-6 text-right">
                          <button className="text-gray-400 hover:text-navy-950 transition-colors p-1 rounded-md hover:bg-gray-100">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
