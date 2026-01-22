"use client";

import { useEffect, useRef } from "react";
import type { Action } from "./Dashboard";

interface ActionLogsProps {
  actions: Action[];
}

export default function ActionLogs({ actions }: ActionLogsProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [actions]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    }).format(date);
  };

  const getStatusColor = (status: Action["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "pending":
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: Action["status"]) => {
    switch (status) {
      case "completed":
        return "✓";
      case "in-progress":
        return "⟳";
      case "pending":
        return "○";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Logs Header */}
      <div className="px-6 py-2 border-b border-gray-300 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-times">Journal d'actions</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            {actions.length} action{actions.length !== 1 ? "s" : ""} enregistrée{actions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 text-xs border border-gray-400 hover:bg-gray-100 transition-colors"
        >
          Effacer
        </button>
      </div>

      {/* Logs Content */}
      <div className="flex-1 overflow-y-auto px-6 py-3 font-mono text-xs">
        {actions.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Aucune action exécutée. Démarrez l'agent pour commencer.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {actions.map((action) => (
              <div
                key={action.id}
                className={`flex items-start gap-3 py-1 px-2 hover:bg-gray-50 rounded transition-colors ${
                  action.status === "in-progress" ? "bg-blue-50" : ""
                }`}
              >
                <span className="text-gray-400 select-none w-24 flex-shrink-0">
                  {formatTime(action.timestamp)}
                </span>
                <span className={`font-bold w-4 flex-shrink-0 ${getStatusColor(action.status)}`}>
                  {getStatusIcon(action.status)}
                </span>
                <span className="flex-1">
                  {action.description}
                  {action.coordinates && (
                    <span className="text-gray-500 ml-2">
                      @ ({action.coordinates.x}, {action.coordinates.y})
                    </span>
                  )}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* Logs Footer */}
      <div className="px-6 py-2 border-t border-gray-300 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-green-600 font-bold">✓</span>
            <span>Complété</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-600 font-bold">⟳</span>
            <span>En cours</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 font-bold">○</span>
            <span>En attente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
