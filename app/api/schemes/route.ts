import { NextRequest, NextResponse } from "next/server";
import { getTextModel, DEMO_MODE } from "@/lib/gemini";
import schemesData from "@/data/schemes.json";

interface Scheme {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  eligibility: {
    occupation: string[];
    minAge: number;
    maxAge: number;
    incomeCategories: string[];
    states: string[];
  };
  amount: string;
  deadline: string;
  applyLink: string;
  ministry: string;
}

function filterSchemes(
  age: number,
  occupation: string,
  state: string,
  incomeCategory: string
): Scheme[] {
  return (schemesData as Scheme[]).filter((scheme) => {
    const { eligibility } = scheme;

    // Age check
    if (age < eligibility.minAge || age > eligibility.maxAge) return false;

    // Occupation check
    if (!eligibility.occupation.includes(occupation) && !eligibility.occupation.includes("other")) {
      if (eligibility.occupation.length > 0 && !eligibility.occupation.includes("other")) {
        // Allow if "other" is in occupation
        const hasMatch = eligibility.occupation.includes(occupation);
        if (!hasMatch) return false;
      }
    }

    // Income check
    if (
      !eligibility.incomeCategories.includes(incomeCategory) &&
      !eligibility.incomeCategories.includes("all")
    ) {
      return false;
    }

    // State check
    if (
      !eligibility.states.includes("all") &&
      !eligibility.states.includes(state)
    ) {
      return false;
    }

    return true;
  });
}

export async function POST(req: NextRequest) {
  try {
    const { age, occupation, state, incomeCategory, lang } = await req.json();

    if (!age || !occupation || !state || !incomeCategory) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Always filter schemes locally (fast, no AI needed for base filtering)
    const matchedSchemes = filterSchemes(
      parseInt(age),
      occupation,
      state,
      incomeCategory
    );

    if (DEMO_MODE) {
      return NextResponse.json({
        schemes: matchedSchemes,
        aiSummary: `Based on your profile (${occupation}, age ${age}, from ${state}, income ${incomeCategory.replace(/_/g, " ")}), we found ${matchedSchemes.length} scheme(s) you may be eligible for. Click "Apply Now" on each to get started.`,
        demoMode: true,
      });
    }

    const model = getTextModel();
    if (!model) {
      return NextResponse.json({
        schemes: matchedSchemes,
        aiSummary: `Found ${matchedSchemes.length} relevant schemes for your profile.`,
        demoMode: true,
      });
    }

    const langInstruction =
      lang === "hi"
        ? "Respond in Hindi."
        : lang === "te"
        ? "Respond in Telugu."
        : "Respond in English.";

    const schemeNames = matchedSchemes.map((s) => s.name).join(", ");
    const prompt = `You are Smart Bharat AI. A citizen has this profile:
- Age: ${age}
- Occupation: ${occupation}
- State: ${state}
- Annual Income Category: ${incomeCategory}

The following government schemes match their profile: ${schemeNames || "None found in database"}

Write a brief, friendly 2-3 sentence summary of the best schemes for them and encourage them to apply. ${langInstruction}`;

    const result = await model.generateContent(prompt);
    const aiSummary = result.response.text();

    return NextResponse.json({
      schemes: matchedSchemes,
      aiSummary,
      demoMode: false,
    });
  } catch (error) {
    console.error("Schemes API error:", error);
    return NextResponse.json({
      schemes: [],
      aiSummary: "Service temporarily unavailable. Please try again.",
      demoMode: true,
    });
  }
}
