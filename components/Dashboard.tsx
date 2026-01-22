"use client";

import { useState } from "react";
import Header from "./Header";
import ChatPanel from "./ChatPanel";
import ScreenPreview from "./ScreenPreview";
import ActionLogs from "./ActionLogs";

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
      content: "Bonjour ! Je suis Nexus, votre assistant d'automatisation desktop. Décrivez-moi ce que vous souhaitez automatiser.",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [actions, setActions] = useState<Action[]>([]);
  const [currentHighlight, setCurrentHighlight] = useState<{ x: number; y: number } | null>(null);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: simulateAIResponse(content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Simulate actions
      if (isAgentRunning) {
        simulateActions(content);
      }
    }, 1000);
  };

  const simulateAIResponse = (userInput: string): string => {
    const responses = [
      "J'ai compris. Je vais analyser votre écran et exécuter cette tâche.",
      "Parfait. Je commence l'automatisation de cette action.",
      "Je vais procéder à cette opération. Veuillez patienter.",
      "Analyse de l'écran en cours. Je vais exécuter les actions nécessaires.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const simulateActions = (userInput: string) => {
    const actionTemplates = [
      "Capture d'écran effectuée",
      "Analyse visuelle de l'interface",
      "Détection de l'élément cible",
      "Déplacement du curseur vers ({x}, {y})",
      "Clic gauche exécuté",
      "Saisie de texte",
      "Ouverture de l'application",
      "Organisation des fichiers",
      "Action complétée avec succès",
    ];

    actionTemplates.forEach((template, index) => {
      setTimeout(() => {
        const coords = { x: Math.floor(Math.random() * 800) + 100, y: Math.floor(Math.random() * 600) + 100 };
        const action: Action = {
          id: `${Date.now()}-${index}`,
          description: template.replace("{x}", coords.x.toString()).replace("{y}", coords.y.toString()),
          coordinates: template.includes("{x}") ? coords : undefined,
          timestamp: new Date(),
          status: index === actionTemplates.length - 1 ? "completed" : "in-progress",
        };
        setActions((prev) => [...prev, action]);

        if (action.coordinates) {
          setCurrentHighlight(action.coordinates);
          setTimeout(() => setCurrentHighlight(null), 1500);
        }
      }, index * 800);
    });
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
    setActions([]);
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
