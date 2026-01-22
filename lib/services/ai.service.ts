import Anthropic from "@anthropic-ai/sdk";

export interface ScreenAnalysisResult {
  action: string;
  coordinates?: { x: number; y: number };
  command?: string;
  confidence: number;
  reasoning: string;
}

export class AIService {
  private client: Anthropic | null = null;

  constructor() {
    // Only initialize if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.client = new Anthropic({
        apiKey: apiKey,
      });
    }
  }

  /**
   * Analyze a screenshot and user intent to determine what action to take
   * @param screenshot Base64 encoded screenshot
   * @param userIntent User's natural language command
   * @returns Analysis result with action to take
   */
  async analyzeScreen(
    screenshot: string,
    userIntent: string
  ): Promise<ScreenAnalysisResult> {
    if (!this.client) {
      // Fallback to mock data if no API key
      return this.mockAnalyze(userIntent);
    }

    try {
      const message = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: screenshot,
                },
              },
              {
                type: "text",
                text: `Analyze this screenshot and determine what action to take for this user intent: "${userIntent}"

Return a JSON object with:
- action: Type of action (click, type, open, organize, etc.)
- coordinates: {x, y} if click is needed (null otherwise)
- command: Shell command if needed (null otherwise)
- confidence: 0-100 confidence score
- reasoning: Brief explanation of your analysis

Be precise and actionable. Only respond with valid JSON.`,
              },
            ],
          },
        ],
      });

      const responseText = message.content[0].type === "text"
        ? message.content[0].text
        : "";

      // Parse JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.mockAnalyze(userIntent);
    } catch (error) {
      console.error("AI analysis error:", error);
      return this.mockAnalyze(userIntent);
    }
  }

  /**
   * Mock analysis for development/demo without API key
   */
  private mockAnalyze(userIntent: string): ScreenAnalysisResult {
    // Simple keyword-based mock
    const lower = userIntent.toLowerCase();

    if (lower.includes("range") || lower.includes("organise")) {
      return {
        action: "organize_files",
        command: "organize",
        confidence: 85,
        reasoning: "User wants to organize files based on intent keywords",
      };
    }

    if (lower.includes("ouvre") || lower.includes("open")) {
      return {
        action: "open_application",
        command: "open",
        confidence: 90,
        reasoning: "User wants to open an application",
      };
    }

    if (lower.includes("crée") || lower.includes("create")) {
      return {
        action: "create",
        command: "mkdir",
        confidence: 88,
        reasoning: "User wants to create something (folder/file)",
      };
    }

    if (lower.includes("clique") || lower.includes("click")) {
      return {
        action: "click",
        coordinates: { x: 500, y: 300 },
        confidence: 75,
        reasoning: "User wants to click on an element",
      };
    }

    return {
      action: "analyze",
      confidence: 60,
      reasoning: "General analysis needed - command not clearly identified",
    };
  }

  /**
   * Check if AI service is ready
   */
  isReady(): boolean {
    return this.client !== null;
  }
}

// Singleton instance
export const aiService = new AIService();
