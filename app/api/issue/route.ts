import { NextRequest, NextResponse } from "next/server";
import { getVisionModel, isDemoMode, generateTrackingId } from "@/lib/gemini";
import departmentsData from "@/data/departments.json";

type DepartmentKey = keyof typeof departmentsData;

// Keyword-based fallback categorization
function categorizeByKeywords(description: string): DepartmentKey {
  const lower = description.toLowerCase();
  const entries = Object.entries(departmentsData) as [DepartmentKey, typeof departmentsData[DepartmentKey]][];
  for (const [key, dept] of entries) {
    if (dept.keywords.some((kw: string) => lower.includes(kw.toLowerCase()))) {
      return key;
    }
  }
  return "pothole"; // default
}

// Mock responses for demo mode
function getMockAnalysis(description: string) {
  const key = categorizeByKeywords(description);
  const dept = departmentsData[key];

  const trackingId = generateTrackingId();
  const now = new Date();

  return {
    issueType: dept.issueType,
    department: dept.department,
    priority: dept.priority,
    escalationDept: dept.escalationDept,
    trackingId,
    complaintText: `To,
The ${dept.department},
[Your City/District]

Subject: Complaint Regarding ${dept.issueType} — Tracking ID: ${trackingId}

Respected Sir/Madam,

I am writing to bring to your attention a ${dept.issueType.toLowerCase()} reported at [Location]. This issue has been causing inconvenience to citizens and requires immediate attention.

Description: ${description || `A ${dept.issueType.toLowerCase()} has been identified that needs prompt resolution.`}

I request your office to take immediate action to resolve this issue. Citizens are affected daily by this problem, and prompt resolution would be greatly appreciated.

Yours faithfully,
[Your Name]
Date: ${now.toLocaleDateString("en-IN")}
Tracking ID: ${trackingId}`,
    submittedAt: now.toISOString(),
    demoMode: true,
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const description = (formData.get("description") as string) || "";
    const location = (formData.get("location") as string) || "";

    if (isDemoMode()) {
      // Simulate a delay for realism
      await new Promise((r) => setTimeout(r, 1200));
      return NextResponse.json(getMockAnalysis(description));
    }

    const model = getVisionModel();
    if (!model) throw new Error("Vision model unavailable");

    // Build the prompt
    const departmentList = Object.entries(departmentsData)
      .map(([key, d]) => `${key}: ${d.issueType}`)
      .join(", ");

    const prompt = `You are an AI system for a civic issue reporting platform in India. Analyze this civic issue and respond ONLY with a valid JSON object.

Context:
- Description: ${description || "Not provided"}
- Location: ${location || "Not provided"}

Available issue categories: ${departmentList}

Respond ONLY with this exact JSON structure (no markdown, no extra text):
{
  "issueCategory": "one of the category keys above",
  "issueType": "specific issue type description",
  "department": "responsible government department name",
  "priority": "Critical|High|Medium|Low",
  "escalationDept": "escalation department if needed",
  "reasoning": "brief explanation of categorization"
}`;

    let geminiAnalysis: {
      issueCategory: DepartmentKey;
      issueType: string;
      department: string;
      priority: string;
      escalationDept: string;
      reasoning: string;
    };

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = imageFile.type || "image/jpeg";

      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { mimeType, data: base64 } },
      ]);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid JSON from Gemini");
      geminiAnalysis = JSON.parse(jsonMatch[0]);
    } else {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid JSON from Gemini");
      geminiAnalysis = JSON.parse(jsonMatch[0]);
    }

    const key: DepartmentKey = (geminiAnalysis.issueCategory as DepartmentKey) in departmentsData
      ? (geminiAnalysis.issueCategory as DepartmentKey)
      : categorizeByKeywords(description);

    const deptData = departmentsData[key];
    const trackingId = generateTrackingId();
    const now = new Date();

    const complaintText = `To,
The ${geminiAnalysis.department || deptData.department},
[Your City/District]

Subject: Complaint Regarding ${geminiAnalysis.issueType || deptData.issueType} — Tracking ID: ${trackingId}

Respected Sir/Madam,

I am writing to bring to your attention a civic issue that requires immediate attention.

Issue Type: ${geminiAnalysis.issueType || deptData.issueType}
Location: ${location || "[Please specify location]"}
Priority: ${geminiAnalysis.priority || deptData.priority}
${description ? `Description: ${description}` : ""}

This issue has been causing inconvenience to citizens and I request prompt action to resolve it.

Yours faithfully,
[Your Name]
Date: ${now.toLocaleDateString("en-IN")}
Tracking ID: ${trackingId}`;

    return NextResponse.json({
      issueType: geminiAnalysis.issueType || deptData.issueType,
      department: geminiAnalysis.department || deptData.department,
      priority: geminiAnalysis.priority || deptData.priority,
      escalationDept: geminiAnalysis.escalationDept || deptData.escalationDept,
      trackingId,
      complaintText,
      submittedAt: now.toISOString(),
      demoMode: false,
    });
  } catch (error) {
    console.error("Issue API error:", error);
    const formData = await req.formData().catch(() => new FormData());
    const description = (formData.get("description") as string) || "";
    return NextResponse.json({
      ...getMockAnalysis(description),
      demoMode: true,
    });
  }
}
