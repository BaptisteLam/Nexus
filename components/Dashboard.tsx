"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import ChatPanel from "./ChatPanel";
import ScreenPreview from "./ScreenPreview";
import ActionLogs from "./ActionLogs";
import { useDesktopAutomation } from "@/hooks/useDesktopAutomation";

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export interface Action {
  id: string;
  description: string;
  coordinates?: { x: number; y: number };
  timestamp: Date;
  status: "completed" | "in-progress" | "pending";
}

export default function Dashboard() {
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Bonjour ! Je suis Nexus, votre assistant d'automatisation desktop basée sur l'API Claude. Décrivez-moi ce que vous souhaitez automatiser.",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [currentHighlight, setCurrentHighlight] = useState<{ x: number; y: number } | null>(null);
  const { actions, isProcessing, executeAutomation, clearActions } = useDesktopAutomation();

  // Update highlights when actions change
  useEffect(() => {
    const lastAction = actions[actions.length - 1];
    if (lastAction?.coordinates && lastAction.status === "in-progress") {
      setCurrentHighlight(lastAction.coordinates);
      setTimeout(() => setCurrentHighlight(null), 1500);
    }
  }, [actions]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: isAgentRunning
          ? "J'ai compris. Je vais analyser votre écran et exécuter cette tâche via l'API backend."
          : "Agent inactif. Démarrez l'agent pour exécuter des automatisations.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Execute automation via backend API
      if (isAgentRunning) {
        executeAutomation(content);
      }
    }, 500);
  };

  const handleToggleAgent = () => {
    setIsAgentRunning(!isAgentRunning);
    if (!isAgentRunning) {
      const startMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: "Agent démarré. Je surveille votre écran et suis prêt à exécuter vos commandes.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, startMessage]);
    } else {
      const stopMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: "Agent arrêté. Session terminée.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, stopMessage]);
    }
  };

  const handleClearSession = () => {
    setMessages([
      {
        id: "1",
        type: "ai",
        content: "Session réinitialisée. Comment puis-je vous aider ?",
        timestamp: new Date(),
      },
    ]);
    clearActions();
    setCurrentHighlight(null);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      <Header
        isAgentRunning={isAgentRunning}
        onToggleAgent={handleToggleAgent}
        onClearSession={handleClearSession}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-1/3 border-r border-black flex flex-col">
          <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
        </div>

        {/* Right Panel - Preview & Logs */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ScreenPreview currentHighlight={currentHighlight} />
          </div>
          <div className="h-48 border-t border-black">
            <ActionLogs actions={actions} />
          </div>
        </div>
      </div>
    </div>
  );
}
