import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/services/ai.service";

export const runtime = "nodejs";

/**
 * POST /api/ai/analyze
 * Analyze screen and user intent to determine action
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { screenshot, userIntent } = body;

    if (!userIntent) {
      return NextResponse.json(
        { error: "User intent is required" },
        { status: 400 }
      );
    }

    // Analyze with AI
    const analysis = await aiService.analyzeScreen(
      screenshot || "",
      userIntent
    );

    return NextResponse.json({
      success: true,
      analysis,
      isUsingAI: aiService.isReady(),
    });
  } catch (error: any) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/analyze
 * Check AI service status
 */
export async function GET() {
  return NextResponse.json({
    ready: aiService.isReady(),
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    message: aiService.isReady()
      ? "AI service ready with Claude API"
      : "Running in demo mode (no API key)",
  });
}
