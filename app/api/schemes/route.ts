import { NextRequest, NextResponse } from "next/server";
import { getTextModel, isDemoMode } from "@/lib/gemini";
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

    // Occupation check — pass if scheme accepts "other" or the specific occupation
    const occupationMatch =
      eligibility.occupation.includes(occupation) ||
      eligibility.occupation.includes("other");
    if (!occupationMatch) return false;

    // Income check
    const incomeMatch =
      eligibility.incomeCategories.includes(incomeCategory) ||
      eligibility.incomeCategories.includes("all");
    if (!incomeMatch) return false;

    // State check
    const stateMatch =
      eligibility.states.includes("all") ||
      eligibility.states.includes(state);
    if (!stateMatch) return false;

    return true;
  });
}

export async function POST(req: NextRequest) {
  let matchedSchemes: Scheme[] = [];

  try {
    const body = await req.json();
    const { age, occupation, state, incomeCategory, lang } = body;

    if (!age || !occupation || !state || !incomeCategory) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Step 1: Always filter locally — fast, no AI needed
    matchedSchemes = filterSchemes(parseInt(age), occupation, state, incomeCategory);

    const demoMode = isDemoMode();

    if (demoMode) {
      return NextResponse.json({
        schemes: matchedSchemes,
        aiSummary:
          matchedSchemes.length > 0
            ? `Based on your profile (${occupation}, age ${age}, from ${state}), you are eligible for ${matchedSchemes.length} government scheme(s). Click "Apply Now" on each to get started.`
            : `No schemes found in our database matching your exact profile. Try broadening your income category or check the National Scholarship Portal directly.`,
        demoMode: true,
      });
    }

    // Step 2: Try Gemini for a personalized summary (wrapped in its own try/catch
    //         so a Gemini failure never blocks the local scheme results)
    let aiSummary = `Found ${matchedSchemes.length} scheme(s) matching your profile.`;

    try {
      const model = getTextModel();
      if (model) {
        const langInstruction =
          lang === "hi"
            ? "Respond in Hindi."
            : lang === "te"
            ? "Respond in Telugu."
            : "Respond in English.";

        const schemeNames =
          matchedSchemes.length > 0
            ? matchedSchemes.map((s) => s.name).join(", ")
            : "None found in local database";

        const prompt = `You are Smart Bharat AI. A citizen has this profile:
- Age: ${age}
- Occupation: ${occupation}
- State: ${state}
- Annual Income Category: ${incomeCategory.replace(/_/g, " ")}

Matching government schemes from our database: ${schemeNames}

Write a brief, friendly 2-3 sentence summary encouraging them to apply for the most relevant ones. If no schemes match, suggest they check the National Scholarship Portal at scholarships.gov.in. ${langInstruction}`;

        const result = await model.generateContent(prompt);
        aiSummary = result.response.text();
      }
    } catch (geminiError) {
      console.error("Gemini summary error (non-fatal):", geminiError);
      // aiSummary already has a safe fallback value — continue with local results
    }

    return NextResponse.json({
      schemes: matchedSchemes,
      aiSummary,
      demoMode: false,
    });
  } catch (error) {
    // Only top-level errors (e.g. bad JSON body) reach here
    console.error("Schemes API top-level error:", error);
    return NextResponse.json({
      schemes: matchedSchemes, // return whatever we filtered before the crash
      aiSummary:
        matchedSchemes.length > 0
          ? `Found ${matchedSchemes.length} scheme(s) for your profile. AI summary unavailable.`
          : "Service error. Please try again.",
      demoMode: true,
    });
  }
}
