import { NextRequest, NextResponse } from "next/server";
import { desktopService } from "@/lib/services/desktop.service";

export const runtime = "nodejs";

/**
 * POST /api/desktop/action
 * Execute a desktop action
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, payload } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Action type is required" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "screenshot":
        result = await desktopService.captureScreenshot();
        break;

      case "click":
        const { x, y, button } = payload;
        result = await desktopService.click(x, y, button);
        break;

      case "type":
        result = await desktopService.type(payload.text);
        break;

      case "move":
        result = await desktopService.moveMouse(payload.x, payload.y);
        break;

      case "command":
        result = await desktopService.executeCommand(payload.command);
        break;

      case "file_operation":
        result = await desktopService.fileOperation(
          payload.operation,
          payload.paths
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Desktop action error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute action" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/desktop/action
 * Get action history
 */
export async function GET() {
  const history = desktopService.getHistory();
  return NextResponse.json({
    success: true,
    count: history.length,
    actions: history,
  });
}

/**
 * DELETE /api/desktop/action
 * Clear action history
 */
export async function DELETE() {
  desktopService.clearHistory();
  return NextResponse.json({
    success: true,
    message: "Action history cleared",
  });
}
