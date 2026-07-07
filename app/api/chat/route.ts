import { NextRequest, NextResponse } from "next/server";
import { getTextModel, isDemoMode, cleanErrorMessage } from "@/lib/gemini";
import servicesData from "@/data/services.json";
import schemesData from "@/data/schemes.json";

// Keyword-based context retrieval
function getRelevantContext(query: string): string {
  const q = query.toLowerCase();
  const contextParts: string[] = [];

  // Check services
  for (const [key, service] of Object.entries(servicesData as Record<string, {name: string; documents: string[]; steps: string[]; timeline: string; fees: Record<string, string>; officialLink: string}>)) {
    if (
      q.includes(key.replace("_", " ")) ||
      q.includes(service.name.toLowerCase()) ||
      (q.includes("passport") && key === "passport") ||
      (q.includes("driving") && key === "driving_license") ||
      (q.includes("pan") && key === "pan_card") ||
      (q.includes("birth") && key === "birth_certificate") ||
      (q.includes("income") && key === "income_certificate") ||
      (q.includes("voter") && key === "voter_id") ||
      (q.includes("ration") && key === "ration_card") ||
      (q.includes("caste") && key === "caste_certificate")
    ) {
      contextParts.push(
        `SERVICE: ${service.name}\nDocuments: ${service.documents.join(", ")}\nSteps: ${service.steps.join(" → ")}\nTimeline: ${service.timeline}\nFees: ${JSON.stringify(service.fees)}\nLink: ${service.officialLink}`
      );
    }
  }

  // Check schemes
  const schemeKeywords = ["scheme", "scholarship", "subsidy", "benefit", "welfare", "mudra", "kisan", "ayushman", "ujjwala"];
  if (schemeKeywords.some((kw) => q.includes(kw))) {
    const schemeList = (schemesData as Array<{name: string; description: string; amount: string; eligibility: {occupation: string[]; states: string[]}}>).slice(0, 5).map(
      (s) => `${s.name}: ${s.description} | Amount: ${s.amount}`
    );
    contextParts.push(`SCHEMES:\n${schemeList.join("\n")}`);
  }

  return contextParts.join("\n\n");
}

// Mock responses for demo mode
const mockResponses: Record<string, string> = {
  default: `## How I Can Help You 🇮🇳

I'm Smart Bharat AI, your civic action agent. Here's what I can help with:

**Government Services:**
- 🛂 Passport application process
- 🚗 Driving License (Learner's + Permanent)
- 💳 PAN Card application
- 📄 Income & Caste Certificate

**Civic Issues:**
- Report potholes, garbage, broken streetlights
- Generate official complaint letters

**Government Schemes:**
- PM-KISAN for farmers
- National Scholarship Portal (NSP)
- Ayushman Bharat health coverage

Ask me anything specific! For example: *"How do I apply for a passport?"*`,

  passport: `## How to Apply for a Passport 🛂

**Required Documents:**
1. Aadhaar Card (original + photocopy)
2. PAN Card
3. Birth Certificate / Class 10 Marksheet
4. Address Proof
5. 2 passport-size photographs

**Application Steps:**
1. Register at **passportindia.gov.in**
2. Fill Form 1 online & pay fee
3. Book appointment at PSK (Passport Seva Kendra)
4. Visit with originals on appointment date
5. Biometrics + police verification
6. Passport dispatched via Speed Post

**Timeline:** 7–10 days (Tatkaal) | 30–45 days (Normal)

**Fees:**
- Normal: ₹1,500 (36-page) / ₹2,000 (60-page)
- Tatkaal: ₹2,000 / ₹2,500

📎 **Official Link:** passportindia.gov.in
📞 **Helpline:** 1800-258-1800`,

  driving: `## How to Get a Driving License 🚗

**Step 1: Learner's License**
1. Visit **parivahan.gov.in**
2. Fill Form 2 & pay ₹150–₹200
3. Pass online traffic knowledge test at RTO
4. Learner's License issued same day

**Step 2: Permanent Driving License** (after 30 days)
1. Apply again at Parivahan portal
2. Book driving test slot at RTO
3. Pass practical driving test
4. DL issued within 7 days

**Documents Needed:**
- Age Proof (Aadhaar / Birth Certificate)
- Address Proof (Aadhaar / Electricity Bill)
- Medical Certificate (Form 1A)
- 2 passport-size photographs

**Fees:** LL: ₹150–200 | Permanent: ₹350–500

📎 **Official Link:** parivahan.gov.in`,

  pan: `## How to Apply for PAN Card 💳

**Option 1: Instant e-PAN (Recommended)**
- Visit incometaxindia.gov.in
- Use Aadhaar-based instant PAN (free, minutes)

**Option 2: Physical PAN Card**
1. Visit NSDL or UTIITSL portal
2. Select Form 49A (Indian citizens)
3. Upload photo, signature & documents
4. Pay ₹107 fee
5. PAN dispatched in 15 working days

**Documents Required:**
- Identity Proof (Aadhaar / Voter ID)
- Address Proof
- Date of Birth Proof
- 1 passport-size photograph

📎 **Official Link:** onlineservices.nsdl.com
📞 **Helpline:** 1800-180-1961`,
};

function formatServiceResponse(service: any): string {
  return `## ${service.icon} ${service.name} Guide

${service.description}

### 📋 Required Documents:
${service.documents.map((doc: string) => `- ${doc}`).join("\n")}

### 🚶 Application Process:
${service.steps.map((step: string, i: number) => `${i + 1}. ${step}`).join("\n")}

### ⏱️ Estimated Timeline:
${service.timeline}

### 💳 Government Fees:
${Object.entries(service.fees).map(([type, fee]) => `- **${type.replace(/_/g, " ").toUpperCase()}**: ${fee}`).join("\n")}

${service.officialLink ? `📎 **Official Portal**: [${service.officialLink}](${service.officialLink})` : ""}
${service.helpline ? `📞 **Helpline**: ${service.helpline}` : ""}`;
}

function formatSchemeResponse(scheme: any): string {
  return `## ${scheme.icon} ${scheme.name} Guide

${scheme.description}

- **Category**: ${scheme.category}
- **Ministry/Department**: ${scheme.ministry}
- **Benefit Amount**: ${scheme.amount}
- **Application Deadline**: ${scheme.deadline}

### 🔍 Eligibility Criteria:
- **Age**: ${scheme.eligibility.minAge} to ${scheme.eligibility.maxAge} years
- **Eligible Occupations**: ${scheme.eligibility.occupation.join(", ")}
- **Annual Income Category**: ${scheme.eligibility.incomeCategories.map((ic: string) => ic.replace(/_/g, " ")).join(", ")}
- **Eligible States**: ${scheme.eligibility.states.join(", ")}

📎 **How to Apply**: [Official Portal](${scheme.applyLink})`;
}

const mockResponsesHi: Record<string, string> = {
  default: `## मैं आपकी कैसे मदद कर सकता हूँ 🇮🇳

मैं स्मार्ट भारत एआई हूँ। मैं निम्नलिखित में मदद कर सकता हूँ:

**सरकारी सेवाएँ:**
- 🛂 पासपोर्ट आवेदन
- 🚗 ड्राइविंग लाइसेंस
- 💳 पैन कार्ड

**नागरिक समस्याएँ:**
- गड्ढे, कचरा, टूटी स्ट्रीटलाइट की रिपोर्ट करें

कृपया मुझे कुछ विशिष्ट पूछें! जैसे: *"मैं पासपोर्ट के लिए आवेदन कैसे करूँ?"*`,
  passport: `## पासपोर्ट के लिए आवेदन कैसे करें 🛂

**आवश्यक दस्तावेज़:**
1. आधार कार्ड
2. पैन कार्ड
3. जन्म प्रमाण पत्र
4. पता प्रमाण
5. 2 फोटो

**समय:** 7-10 दिन (तत्काल) | 30-45 दिन (सामान्य)

**शुल्क:** ₹1,500 (सामान्य) | ₹2,000 (तत्काल)
📎 **लिंक:** passportindia.gov.in`,
  driving: `## ड्राइविंग लाइसेंस कैसे प्राप्त करें 🚗

**चरण 1: लर्निंग लाइसेंस**
1. parivahan.gov.in पर जाएं
2. फॉर्म 2 भरें

**शुल्क:** ₹150–200
📎 **लिंक:** parivahan.gov.in`,
  pan: `## पैन कार्ड के लिए आवेदन कैसे करें 💳

**विकल्प 1: तत्काल ई-पैन (अनुशंसित)**
- incometaxindia.gov.in पर जाएं
- आधार आधारित तत्काल पैन का उपयोग करें (मुफ़्त)

📎 **लिंक:** onlineservices.nsdl.com`
};

const mockResponsesTe: Record<string, string> = {
  default: `## నేను మీకు ఎలా సహాయపడగలను 🇮🇳

నేను స్మార్ట్ భారత్ AI. నేను వీటిలో సహాయపడగలను:

**ప్రభుత్వ సేవలు:**
- 🛂 పాస్‌పోర్ట్ దరఖాస్తు
- 🚗 డ్రైవింగ్ లైసెన్స్
- 💳 పాన్ కార్డ్

దయచేసి ఏదైనా నిర్దిష్టంగా అడగండి! ఉదాహరణకు: *"నేను పాస్‌పోర్ట్ కోసం ఎలా దరఖాస్తు చేయాలి?"*`,
  passport: `## పాస్‌పోర్ట్ కోసం ఎలా దరఖాస్తు చేయాలి 🛂

**అవసరమైన పత్రాలు:**
1. ఆధార్ కార్డ్
2. పాన్ కార్డ్
3. జనన ధృవీకరణ పత్రం

**సమయం:** 7-10 రోజులు (తత్కాల్)
**రుసుము:** ₹1,500 (సాధారణ)
📎 **లింక్:** passportindia.gov.in`,
  driving: `## డ్రైవింగ్ లైసెన్స్ ఎలా పొందాలి 🚗

**దశ 1: లెర్నింగ్ లైసెన్స్**
1. parivahan.gov.in ని సందర్శించండి
2. ఫారమ్ 2 నింపండి

📎 **లింక్:** parivahan.gov.in`,
  pan: `## పాన్ కార్డ్ కోసం ఎలా దరఖాస్తు చేయాలి 💳

**ఎంపిక 1: తక్షణ ఇ-పాన్**
- incometaxindia.gov.in ని సందర్శించండి

📎 **లింక్:** onlineservices.nsdl.com`
};

function getLocalAnswer(query: string, lang: string): string | null {
  const q = query.toLowerCase().trim();

  // If Hindi or Telugu, we bypass the English JSON for the demo
  if (lang === "hi") {
    if (q.includes("passport") || q.includes("पासपोर्ट")) return mockResponsesHi.passport;
    if (q.includes("pan") || q.includes("पैन")) return mockResponsesHi.pan;
    if (q.includes("driving") || q.includes("dl") || q.includes("लाइसेंस")) return mockResponsesHi.driving;
    return mockResponsesHi.default;
  }
  
  if (lang === "te") {
    if (q.includes("passport") || q.includes("పాస్‌పోర్ట్")) return mockResponsesTe.passport;
    if (q.includes("pan") || q.includes("పాన్")) return mockResponsesTe.pan;
    if (q.includes("driving") || q.includes("dl") || q.includes("లైసెన్స్")) return mockResponsesTe.driving;
    return mockResponsesTe.default;
  }

  // 1. Check for passport
  if (q.includes("passport")) {
    const s = servicesData["passport"] as any;
    if (s) return formatServiceResponse(s);
  }

  // 2. Check for PAN card
  if (q.includes("pan")) {
    const s = servicesData["pan_card"] as any;
    if (s) return formatServiceResponse(s);
  }

  // 3. Check for driving license
  if (q.includes("driving") || q.includes("license") || q.includes("dl")) {
    const s = servicesData["driving_license"] as any;
    if (s) return formatServiceResponse(s);
  }

  // 4. Check for scholarships (return compiled list of matching schemes)
  if (q.includes("scholarship")) {
    const scholarships = (schemesData as any[]).filter(
      (s) => s.category.toLowerCase() === "scholarship" || s.id.includes("scholarship")
    );
    if (scholarships.length > 0) {
      let response = `## 🎓 Recommended Government Scholarships\n\nHere are the top scholarships available for students in our database:\n\n`;
      scholarships.forEach((s) => {
        response += `### ${s.icon} ${s.name}\n`;
        response += `${s.description}\n\n`;
        response += `- **Benefit**: ${s.amount}\n`;
        response += `- **Deadline**: ${s.deadline}\n`;
        response += `- **Apply Link**: [Official Portal](${s.applyLink})\n\n`;
      });
      return response;
    }
  }

  // 5. Check for Ayushman Bharat
  if (q.includes("ayushman") || q.includes("pmjay") || q.includes("health card") || q.includes("pm-jay")) {
    const scheme = (schemesData as any[]).find((s) => s.id === "ayushman_bharat");
    if (scheme) return formatSchemeResponse(scheme);
  }

  // 6. Check for PM-KISAN
  if (q.includes("kisan") || q.includes("farmer") || q.includes("pmkisan") || q.includes("pm-kisan")) {
    const scheme = (schemesData as any[]).find((s) => s.id === "pm_kisan");
    if (scheme) return formatSchemeResponse(scheme);
  }

  // 7. General search fallbacks:
  // Search in servicesData
  for (const [key, service] of Object.entries(servicesData)) {
    const s = service as any;
    const nameLower = s.name.toLowerCase();
    const keyString = key.replace(/_/g, " ");
    if (q.includes(nameLower) || q.includes(keyString)) {
      return formatServiceResponse(s);
    }
  }

  // Search in schemesData
  for (const scheme of schemesData as any[]) {
    const nameLower = scheme.name.toLowerCase();
    const idString = scheme.id.replace(/_/g, " ");
    if (q.includes(nameLower) || q.includes(idString)) {
      return formatSchemeResponse(scheme);
    }
  }

  return null;
}

function getMockResponse(query: string, lang: string = "en"): string {
  const local = getLocalAnswer(query, lang);
  if (local) return local;

  const q = query.toLowerCase();
  
  if (lang === "hi") {
    return mockResponsesHi.default;
  }
  if (lang === "te") {
    return mockResponsesTe.default;
  }

  if (q.includes("passport")) return mockResponses.passport;
  if (q.includes("driving") || q.includes("dl") || q.includes("license")) return mockResponses.driving;
  if (q.includes("pan")) return mockResponses.pan;
  return mockResponses.default;
}

export async function POST(req: NextRequest) {
  let message = "";
  let lang = "en";
  try {
    const body = await req.json();
    message = body.message;
    lang = body.lang || "en";
    const { history } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (isDemoMode()) {
      return NextResponse.json({
        response: getMockResponse(message, lang),
        demoMode: true,
      });
    }

    const model = getTextModel();
    if (!model) throw new Error("Model unavailable");

    const context = getRelevantContext(message);
    const langInstruction =
      lang === "hi"
        ? "Respond in Hindi (Devanagari script)."
        : lang === "te"
        ? "Respond in Telugu script."
        : "Respond in English.";

    const systemPrompt = `You are Smart Bharat AI, an expert AI Civic Action Agent for Indian citizens. 
Your role is to help citizens navigate government services, understand schemes, and take action.

IMPORTANT RULES:
- Always produce ACTIONABLE responses — steps, checklists, timelines
- Use markdown formatting with headers, bullet points
- Cite official government portals and helpline numbers
- Be concise but complete
- ${langInstruction}

${context ? `KNOWLEDGE BASE CONTEXT:\n${context}` : ""}`;

    // Build chat history
    const chatHistory = (history || []).map((msg: {role: string; content: string}) => ({
      role: msg.role as "user" | "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am Smart Bharat AI, ready to help Indian citizens with actionable civic guidance." }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response, demoMode: false });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      response: getMockResponse(message, lang),
      demoMode: true,
      error: cleanErrorMessage(error),
    });
  }
}
