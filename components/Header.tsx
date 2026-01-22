"use client";

interface HeaderProps {
  isAgentRunning: boolean;
  onToggleAgent: () => void;
  onClearSession: () => void;
}

export default function Header({ isAgentRunning, onToggleAgent, onClearSession }: HeaderProps) {
  return (
    <header className="h-16 bg-black text-white flex items-center justify-between px-6 border-b-2 border-black">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold font-times">NEXUS</h1>
        <div className="text-sm font-normal opacity-80">AI Desktop Automation</div>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isAgentRunning ? "bg-green-500 animate-pulse" : "bg-gray-500"
            }`}
          />
          <span className="text-sm font-medium">
            {isAgentRunning ? "Agent actif" : "Agent inactif"}
          </span>
        </div>

        {/* Controls */}
        <button
          onClick={onToggleAgent}
          className={`px-6 py-2 font-bold font-times text-sm border-2 transition-all ${
            isAgentRunning
              ? "bg-white text-black border-white hover:bg-gray-200"
              : "bg-black text-white border-white hover:bg-gray-900"
          }`}
        >
          {isAgentRunning ? "ARRÊTER" : "DÉMARRER"}
        </button>

        <button
          onClick={onClearSession}
          className="px-4 py-2 font-bold font-times text-sm border-2 border-white hover:bg-white hover:text-black transition-all"
        >
          RÉINITIALISER
        </button>

        {/* Settings Icon */}
        <button
          className="p-2 hover:bg-gray-800 rounded transition-colors"
          title="Paramètres"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
