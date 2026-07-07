import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Camera,
  Star,
  ArrowRight,
  Shield,
  Globe,
  Zap,
  ChevronRight,
  Users,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Civic Companion",
    description:
      "Ask any question about government services, schemes, or civic processes. Get instant, accurate answers in your language.",
    href: "/companion",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: FileText,
    title: "Document Assistant",
    description:
      "Get personalized checklists for Passport, Driving License, PAN Card, and more. Never miss a document again.",
    href: "/document-assistant",
    color: "from-green-500/20 to-green-600/10",
    border: "border-green-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: Camera,
    title: "Civic Issue Reporter",
    description:
      "Upload a photo of a pothole, broken streetlight, or garbage dump. AI categorizes it and generates an official complaint.",
    href: "/issue-reporter",
    color: "from-saffron/20 to-orange-600/10",
    border: "border-saffron/20",
    iconColor: "text-saffron",
    featured: true,
  },
  {
    icon: Star,
    title: "Scheme Finder",
    description:
      "Enter your profile and discover government schemes, scholarships, and subsidies you qualify for.",
    href: "/scheme-finder",
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
  },
];

const stats = [
  { value: "500+", label: "Government Services Covered" },
  { value: "30+", label: "Schemes in Database" },
  { value: "3", label: "Languages Supported" },
  { value: "10+", label: "Issue Types Handled" },
];

const howItWorks = [
  {
    step: "01",
    title: "Describe Your Need",
    description: "Tell the AI what you need — passport, driving license, report a pothole, find scholarships.",
  },
  {
    step: "02",
    title: "AI Understands & Acts",
    description: "Gemini AI analyzes your request, retrieves relevant government data, and generates an action plan.",
  },
  {
    step: "03",
    title: "Get Actionable Output",
    description: "Receive checklists, complaint letters, tracking IDs, or scheme lists — ready to use immediately.",
  },
];

export default function HomePage() {
  return (
    <div className="hero-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-saffron/8 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-blue-500/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-4 py-1.5 text-sm text-saffron fade-in-1">
            <Zap className="h-3.5 w-3.5" />
            <span>Powered by Google Gemini AI &nbsp;🇮🇳</span>
          </div>

          {/* Headline */}
          <h1 className="fade-in-2 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
            Your AI Civic
            <br />
            <span className="gradient-text">Action Agent</span>
          </h1>

          <p className="fade-in-3 mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Smart Bharat AI transforms complex government processes into simple, actionable workflows.
            Apply for services, report issues, find schemes — all in one place, in your language.
          </p>

          {/* CTAs */}
          <div className="fade-in-4 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/issue-reporter"
              id="cta-issue-reporter"
              className="group flex items-center gap-2 rounded-xl bg-saffron px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-saffron/25 transition-all hover:bg-saffron-light hover:shadow-saffron/40 hover:-translate-y-0.5"
            >
              <Camera className="h-5 w-5" />
              Report a Civic Issue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/companion"
              id="cta-companion"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/25 hover:-translate-y-0.5"
            >
              <MessageSquare className="h-5 w-5" />
              Ask AI Companion
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/8 bg-navy-900/50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Everything a Citizen Needs
            </h2>
            <p className="mt-4 text-gray-400">
              Four powerful modules designed for real government workflows
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${feature.color} ${feature.border} ${
                    feature.featured ? "ring-1 ring-saffron/30" : ""
                  }`}
                >
                  {feature.featured && (
                    <span className="absolute top-3 right-3 rounded-full bg-saffron px-2 py-0.5 text-xs font-semibold text-white">
                      ⭐ Hero Feature
                    </span>
                  )}
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/8 ${feature.iconColor}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                    Get Started <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/8 bg-navy-900/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-gray-400">Three steps to resolve any civic issue</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-saffron/25 bg-saffron/10">
                  <span className="text-2xl font-black text-saffron">{item.step}</span>
                </div>
                <h3 className="mb-2 font-bold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key benefits */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-saffron/20 bg-gradient-to-br from-saffron/10 to-transparent p-8 sm:p-12">
            <div className="grid gap-8 sm:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Not just a chatbot —<br />
                  <span className="gradient-text">An Action Agent</span>
                </h2>
                <p className="mt-4 text-gray-400">
                  Most government chatbots just answer questions. Smart Bharat AI generates complete
                  action plans, official complaints, and document checklists you can use immediately.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Gemini AI-powered responses",
                  "Multilingual (English, Hindi, Telugu)",
                  "Official complaint generation",
                  "Real-time tracking IDs",
                  "Document checklists",
                  "Scheme recommendations",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-saffron" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target users */}
      <section className="border-t border-white/8 bg-navy-900/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="h-5 w-5 text-saffron" />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Built For</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["Students", "Working Professionals", "Senior Citizens", "Farmers", "Rural Citizens", "First-time Applicants"].map(
              (user) => (
                <span
                  key={user}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
                >
                  {user}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-gray-400">
            Try the Civic Issue Reporter — our most powerful feature. Upload a photo and watch AI work.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/issue-reporter"
              id="final-cta-issue"
              className="group flex items-center justify-center gap-2 rounded-xl bg-saffron px-8 py-4 text-base font-bold text-white shadow-lg shadow-saffron/25 transition-all hover:bg-saffron-light hover:-translate-y-0.5"
            >
              <Camera className="h-5 w-5" />
              Report an Issue Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/scheme-finder"
              id="final-cta-schemes"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5"
            >
              <Star className="h-5 w-5" />
              Find My Schemes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
