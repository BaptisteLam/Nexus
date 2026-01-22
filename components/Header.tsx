"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface HeaderProps {
  isAgentRunning: boolean;
  onToggleAgent: () => void;
  onClearSession: () => void;
}

export default function Header({ isAgentRunning, onToggleAgent, onClearSession }: HeaderProps) {
  return (
    <header className="h-16 bg-black text-white flex items-center justify-between px-6 border-b border-black">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">NEXUS</h1>
        <div className="text-sm font-normal opacity-70">AI Desktop Automation</div>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isAgentRunning ? "bg-green-500 animate-pulse" : "bg-neutral-500"
            }`}
          />
          <span className="text-sm font-medium">
            {isAgentRunning ? "Agent actif" : "Agent inactif"}
          </span>
        </div>

        {/* Controls */}
        <Button
          onClick={onToggleAgent}
          variant={isAgentRunning ? "secondary" : "outline"}
          className={isAgentRunning ? "bg-white text-black hover:bg-neutral-100" : "border-white text-white hover:bg-white hover:text-black"}
        >
          {isAgentRunning ? "ARRÊTER" : "DÉMARRER"}
        </Button>

        <Button
          onClick={onClearSession}
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-black"
        >
          RÉINITIALISER
        </Button>

        {/* Settings Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-neutral-800 text-white"
          title="Paramètres"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
