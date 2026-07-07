# 🇮🇳 Smart Bharat AI

**AI-Powered Civic Action Agent for Indian Citizens**

> Built with Google Gemini 2.0 Flash · Next.js 15 · TypeScript · Tailwind CSS

---

## 🚀 Features

| Module | Description |
|--------|-------------|
| 🤖 **AI Civic Companion** | Chat with Gemini AI for any government service question — multilingual (EN/HI/TE) |
| 📋 **Document Assistant** | Interactive checklists for Passport, DL, PAN, Birth Certificate and more |
| 📸 **Civic Issue Reporter** | Upload a photo → AI categorizes → generates official complaint + tracking ID |
| ⭐ **Scheme Finder** | Enter your profile → AI recommends government schemes, scholarships, subsidies |

---

## 🎯 Demo Script

### Demo 1 — AI Companion
Ask: *"How do I apply for a passport?"* → Get complete checklist, timeline, fees

### Demo 2 — Issue Reporter (Hero Feature)
Upload a pothole image → AI assigns department → Copy complaint letter

### Demo 3 — Scheme Finder
Student, Age 20, Karnataka, Income < ₹3L → Scholarship recommendations

### Demo 4 — Multilingual
Switch to **HI** in navbar → Chat responds in Hindi

---

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- Google Gemini API Key

### Installation

```bash
git clone https://github.com/your-repo/smart-bharat-ai
cd smart-bharat-ai
npm install
```

### Configure API Key

Create `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Without an API key**, the app runs in **Demo Mode** — all features still work with realistic mock responses. A banner is shown to indicate demo mode.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` in **Settings → Environment Variables**
4. Deploy!

---

## 📁 Architecture

```
smart-bharat-ai/
├── app/
│   ├── page.tsx                    # Home
│   ├── companion/page.tsx          # AI Chat
│   ├── document-assistant/page.tsx # Document Checklist
│   ├── issue-reporter/page.tsx     # Civic Issue Reporter ⭐
│   ├── scheme-finder/page.tsx      # Scheme Recommendations
│   └── api/
│       ├── chat/route.ts           # Gemini chat API
│       ├── issue/route.ts          # Gemini Vision API
│       └── schemes/route.ts        # Scheme filter + AI summary
├── data/
│   ├── services.json               # 8 government services
│   ├── schemes.json                # 15 government schemes
│   └── departments.json           # 10 civic department mappings
├── lib/
│   ├── gemini.ts                   # Gemini client (demo mode detection)
│   └── utils.ts
└── components/
    ├── Navbar.tsx
    └── DemoBanner.tsx
```

### AI Strategy

- **No RAG / Vector DB** — uses fast keyword retrieval from local JSON
- **Context injection** — relevant service/scheme data injected into Gemini prompt
- **Mock fallback** — every API route returns realistic responses when key is absent
- **Gemini Vision** — used for civic issue image analysis

---

## 🌏 Multilingual Support

- Select language from Navbar: **EN** | **HI** | **TE**
- Language stored in `localStorage`
- Passed to all AI API calls
- Gemini responds in selected language

---

## 📊 Data Sources

All data is local JSON — no external database required:

- `services.json` — 8 services (Passport, DL, PAN, Birth Cert, Income Cert, Voter ID, Ration Card, Caste Cert)
- `schemes.json` — 15 schemes (PM-KISAN, NSP, Ayushman, Mudra, PMAY, etc.)
- `departments.json` — 10 civic issue types with responsible departments

## 🏆 Problem Statement Alignment

This project directly solves the hackathon problem statement: **"Build a GenAI-powered web platform that helps citizens access government services, report public issues, and receive personalized assistance through an intelligent AI companion."**

**How we map to every requirement:**

- ✅ **GenAI-powered web platform**: Built natively on top of Google Gemini 2.0 Flash to power 100% of interactions.
- ✅ **Access government services**: The Scheme Finder & Document Assistant provide direct pathways to public services.
- ✅ **Report public issues**: The Civic Issue Reporter uses Gemini Vision to extract details from user photos of civic problems and auto-routes them.
- ✅ **Intelligent AI companion**: A fully persistent conversational interface that acts as a 24/7 civic assistant.
- ✅ **Simplify complex government information**: Gemini translates bureaucratic jargon into simple, actionable bullet points.
- ✅ **Answer citizen queries**: Instant responses to FAQs regarding passports, PAN cards, DLs, etc.
- ✅ **Recommend relevant public services**: The profile dashboard auto-recommends schemes (e.g., scholarships, loans) based on the citizen's demographic data.
- ✅ **Assist with document requirements**: The Document Assistant generates precise, personalized checklists so citizens never get rejected.
- ✅ **Track complaints**: The Profile Dashboard features a "Recent Civic Reports" section with status tracking and complaint IDs.
- ✅ **Provide multilingual support**: Full support for English, Hindi (HI), and Telugu (TE) across all AI interactions.
- ✅ **Promote transparency, accessibility, and digital inclusion**: Voice-friendly UI, screen-reader semantic HTML, and localized language support ensures the platform is usable by all citizens, bridging the digital divide.

---

## 🔒 Security & Code Quality

- Strict TypeScript implementation across all components.
- Secure environment variable handling (never exposed to client).
- Security headers implemented in `next.config.js` (CSP, strict-origin, no-sniff).
- Error boundaries and fallback UI deployed for API quota limits.

---

## ♿ Accessibility & Efficiency

- Fully semantic HTML structure (`<main>`, `<section>`, `<nav>`, `<header>`).
- ARIA-labels implemented across dynamic elements.
- Optimized bundle sizes using Next.js Turbopack and React Server Components.
- 100% mobile responsive with dynamic contrast adjustments.
- Automated tests using Jest and React Testing Library.

---

## 🎨 Design

- **Theme**: Modern Government Tech
- **Colors**: Saffron (#FF6B00) × Dark Navy (#060B18)
- **Components**: Glassmorphism cards, gradient animations
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first design

---

## 📦 Repo Size

All assets are JSON + SVG only. Repository stays well under **10 MB**.

---

## 🏆 Built For

- Hackathon MVP showcasing real-world AI civic use cases
- Demonstrates Gemini API integration (text + vision)
- Covers 5 major civic workflows in a single application
