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
