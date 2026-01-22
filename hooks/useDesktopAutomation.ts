import { useState, useCallback } from "react";

export interface Action {
  id: string;
  description: string;
  coordinates?: { x: number; y: number };
  timestamp: Date;
  status: "completed" | "in-progress" | "pending";
}

export function useDesktopAutomation() {
  const [actions, setActions] = useState<Action[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Execute a sequence of actions based on AI analysis
   */
  const executeAutomation = useCallback(async (userIntent: string) => {
    setIsProcessing(true);

    try {
      // Step 1: Capture screenshot (simulated)
      addAction({
        description: "Capture d'écran effectuée",
        status: "in-progress",
      });

      await delay(500);

      const screenshotResult = await fetch("/api/desktop/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "screenshot" }),
      }).then((res) => res.json());

      updateLastAction({ status: "completed" });

      // Step 2: Analyze with AI
      addAction({
        description: "Analyse visuelle de l'interface",
        status: "in-progress",
      });

      await delay(800);

      const analysisResult = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screenshot: screenshotResult.result?.screenshot,
          userIntent,
        }),
      }).then((res) => res.json());

      updateLastAction({ status: "completed" });

      // Step 3: Execute actions based on analysis
      const analysis = analysisResult.analysis;

      if (analysis.coordinates) {
        // Move mouse
        addAction({
          description: `Déplacement du curseur vers (${analysis.coordinates.x}, ${analysis.coordinates.y})`,
          coordinates: analysis.coordinates,
          status: "in-progress",
        });

        await delay(300);

        await fetch("/api/desktop/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "move",
            payload: analysis.coordinates,
          }),
        });

        updateLastAction({ status: "completed" });

        // Click
        addAction({
          description: "Clic gauche exécuté",
          coordinates: analysis.coordinates,
          status: "in-progress",
        });

        await delay(200);

        await fetch("/api/desktop/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "click",
            payload: { ...analysis.coordinates, button: "left" },
          }),
        });

        updateLastAction({ status: "completed" });
      }

      if (analysis.command) {
        addAction({
          description: `Exécution de la commande: ${analysis.command}`,
          status: "in-progress",
        });

        await delay(500);

        await fetch("/api/desktop/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "command",
            payload: { command: analysis.command },
          }),
        });

        updateLastAction({ status: "completed" });
      }

      // Final success message
      addAction({
        description: `Action complétée avec succès (confiance: ${analysis.confidence}%)`,
        status: "completed",
      });
    } catch (error) {
      console.error("Automation error:", error);
      addAction({
        description: "❌ Erreur lors de l'exécution",
        status: "completed",
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const addAction = useCallback(
    (partial: Omit<Action, "id" | "timestamp">) => {
      const action: Action = {
        ...partial,
        id: `action-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      };
      setActions((prev) => [...prev, action]);
    },
    []
  );

  const updateLastAction = useCallback(
    (updates: Partial<Action>) => {
      setActions((prev) => {
        const newActions = [...prev];
        if (newActions.length > 0) {
          newActions[newActions.length - 1] = {
            ...newActions[newActions.length - 1],
            ...updates,
          };
        }
        return newActions;
      });
    },
    []
  );

  const clearActions = useCallback(() => {
    setActions([]);
  }, []);

  return {
    actions,
    isProcessing,
    executeAutomation,
    clearActions,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
