import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Camera,
  Star,
  ArrowRight,
  Shield,
  Zap,
  ChevronRight,
  CheckCircle,
  FileSearch,
  Activity,
  Globe
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Civic Companion",
    description: "Ask any question about government services or civic processes. Get instant, accurate answers in your local language without navigating endless portals.",
    href: "/companion",
    tag: "Intelligence",
  },
  {
    icon: FileText,
    title: "Document Assistant",
    description: "Get personalized checklists for Passport, Driving License, and PAN Card. Upload documents securely for instant AI verification.",
    href: "/document-assistant",
    tag: "Verification",
  },
  {
    icon: Camera,
    title: "Civic Issue Reporter",
    description: "Upload a photo of a pothole or broken streetlight. Our AI instantly categorizes it, extracts location data, and generates official municipal complaints.",
    href: "/issue-reporter",
    tag: "Action",
  },
  {
    icon: Star,
    title: "Scheme Finder",
    description: "Enter your demographic profile to instantly discover government schemes, scholarships, and subsidies tailored specifically for you.",
    href: "/scheme-finder",
    tag: "Discovery",
  },
];

export default function HomePage() {
  return (
    <div className="bg-offwhite text-nearblack overflow-hidden selection:bg-saffron selection:text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative px-4 pt-24 pb-32 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle mesh background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-saffron/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 fade-in-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-navy-950 shadow-sm mb-8">
            <Zap className="h-4 w-4 text-saffron fill-saffron" />
            <span>Powered by Google Gemini AI</span>
            <span className="text-gray-300 mx-1">|</span>
            <span className="text-gray-500">Built for 🇮🇳</span>
          </div>

          <h1 className="text-5xl font-black tracking-tight text-navy-950 sm:text-7xl mb-6 max-w-4xl mx-auto leading-[1.1]">
            Your AI Civic Companion <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-saffron-light">for Modern India</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 mb-10 font-medium">
            Access government services, resolve civic issues, and navigate public systems through intelligent, multilingual assistance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/issue-reporter"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-navy-950 px-8 py-4 text-base font-bold text-white shadow-xl shadow-navy-950/20 transition-all hover:bg-navy-900 hover:-translate-y-1"
            >
              <Camera className="h-5 w-5 text-saffron" />
              Report Civic Issue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/companion"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-8 py-4 text-base font-bold text-navy-950 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-1"
            >
              <MessageSquare className="h-5 w-5 text-gray-400 group-hover:text-navy-950 transition-colors" />
              Ask AI Companion
            </Link>
          </div>
        </div>

        {/* Hero Dashboard Preview (Mockup) */}
        <div className="relative mt-20 w-full max-w-5xl fade-in-3">
          <div className="absolute inset-0 bg-gradient-to-t from-offwhite via-transparent to-transparent z-10 rounded-2xl" />
          <div className="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-2 shadow-2xl shadow-navy-950/5">
            <div className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm flex flex-col md:flex-row">
              {/* Sidebar Mock */}
              <div className="w-full md:w-64 border-r border-gray-100 bg-gray-50/50 p-6 hidden md:flex flex-col gap-4">
                <div className="h-8 w-24 bg-gray-200 rounded-md mb-4" />
                <div className="h-4 w-full bg-gray-200 rounded-sm" />
                <div className="h-4 w-3/4 bg-gray-200 rounded-sm" />
                <div className="h-4 w-5/6 bg-gray-200 rounded-sm" />
                <div className="mt-8 h-32 w-full border border-gray-200 rounded-lg bg-white shadow-sm p-4 flex flex-col justify-between">
                  <div className="h-3 w-16 bg-saffron/30 rounded-sm" />
                  <div className="h-8 w-8 bg-saffron/10 rounded-full flex items-center justify-center"><Activity className="w-4 h-4 text-saffron" /></div>
                </div>
              </div>
              {/* Main Content Mock */}
              <div className="flex-1 p-6 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="h-6 w-48 bg-navy-950 rounded-md mb-2" />
                    <div className="h-4 w-64 bg-gray-200 rounded-sm" />
                  </div>
                  <div className="hidden sm:flex h-10 w-10 bg-gray-100 rounded-full" />
                </div>
                {/* Bento layout inside the mockup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-48 border border-gray-100 rounded-xl bg-gray-50 p-6">
                     <div className="h-10 w-10 rounded-lg bg-blue-100 mb-4 flex items-center justify-center"><FileSearch className="w-5 h-5 text-blue-600" /></div>
                     <div className="h-4 w-1/2 bg-gray-300 rounded-sm mb-2" />
                     <div className="h-3 w-full bg-gray-200 rounded-sm" />
                  </div>
                  <div className="h-48 border border-gray-100 rounded-xl bg-gray-50 p-6">
                     <div className="h-10 w-10 rounded-lg bg-green-100 mb-4 flex items-center justify-center"><Shield className="w-5 h-5 text-green-600" /></div>
                     <div className="h-4 w-1/2 bg-gray-300 rounded-sm mb-2" />
                     <div className="h-3 w-full bg-gray-200 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS / TRUST SECTION --- */}
      <section className="border-y border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            <div className="text-center px-4">
              <div className="text-3xl font-black text-navy-950">500+</div>
              <div className="mt-1 text-sm font-semibold text-gray-500 uppercase tracking-wide">Services Indexed</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-black text-navy-950">40+</div>
              <div className="mt-1 text-sm font-semibold text-gray-500 uppercase tracking-wide">Civic Schemes</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-black text-navy-950">99%</div>
              <div className="mt-1 text-sm font-semibold text-gray-500 uppercase tracking-wide">AI Accuracy</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-black text-navy-950 flex items-center justify-center gap-1">
                <Globe className="w-6 h-6 text-saffron" /> 3
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-500 uppercase tracking-wide">Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE SHOWCASE (ALTERNATING) --- */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          {/* Feature 1: Issue Reporter */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 text-saffron font-bold text-sm tracking-widest uppercase">
                <Camera className="w-4 h-4" /> Issue Reporter
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-navy-950 leading-tight">
                Report civic issues with a single tap.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Spot a pothole or a broken streetlight? Just upload a photo. Our vision AI instantly analyzes the image, categorizes the problem, and drafts an official municipal complaint ready for submission.
              </p>
              <ul className="space-y-3 pt-4">
                {['Automatic category detection via AI Vision', 'Location metadata extraction', 'Ready-to-email official complaint drafts'].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-saffron/10 blur-3xl rounded-full" />
              <div className="relative border border-gray-200 bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-center aspect-square md:aspect-video lg:aspect-square">
                 <div className="w-3/4 space-y-4">
                    <div className="w-full h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center flex-col gap-2">
                       <Camera className="w-8 h-8 text-gray-400" />
                       <span className="text-sm font-bold text-gray-400">Upload Photo</span>
                    </div>
                    <div className="h-16 w-full bg-saffron/10 rounded-xl border border-saffron/20 flex items-center px-4 gap-4">
                       <div className="h-8 w-8 bg-saffron text-white rounded-full flex items-center justify-center"><Zap className="w-4 h-4" /></div>
                       <div>
                         <div className="h-3 w-24 bg-saffron/40 rounded-sm mb-2" />
                         <div className="h-2 w-32 bg-saffron/20 rounded-sm" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Document Assistant */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm tracking-widest uppercase">
                <FileText className="w-4 h-4" /> Document Assistant
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-navy-950 leading-tight">
                Never get rejected for missing documents.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Applying for a passport or PAN card? Upload your documents securely. Our AI acts as a digital notary, verifying if you have the correct paperwork before you even step foot in a government office.
              </p>
              <Link href="/document-assistant" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 transition-colors pt-2">
                Try Document Assistant <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-1 relative w-full">
              <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
              <div className="relative border border-gray-200 bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-center p-8 aspect-square md:aspect-video lg:aspect-square">
                 <div className="w-full space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-14 w-full bg-white border border-gray-100 rounded-lg shadow-sm flex items-center px-4 justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">{i}</div>
                            <div className="h-3 w-32 bg-gray-200 rounded-sm" />
                         </div>
                         {i === 1 ? <CheckCircle className="w-5 h-5 text-green-500" /> : <div className="w-4 h-4 border-2 border-gray-200 rounded-full" />}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- BENTO GRID SHOWCASE --- */}
      <section className="py-24 bg-navy-950 text-white rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-6">A complete civic ecosystem.</h2>
            <p className="text-lg text-gray-400">Everything you need to navigate the bureaucracy, housed in a single, intelligent application.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link
                  href={feature.href}
                  key={idx}
                  className={`group relative border border-white/10 bg-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors ${idx === 0 ? 'md:col-span-2' : ''}`}
                >
                  <div className="flex justify-between items-start mb-16">
                     <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                     </div>
                     <span className="text-xs font-bold uppercase tracking-wider text-saffron px-3 py-1 bg-saffron/10 rounded-full border border-saffron/20">{feature.tag}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">{feature.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
