"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
        return "text-muted-foreground";
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
      <div className="px-6 py-2 border-b flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold">Journal d'actions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {actions.length} action{actions.length !== 1 ? "s" : ""} enregistrée{actions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="text-xs"
        >
          Effacer
        </Button>
      </div>

      {/* Logs Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-3 font-mono text-xs">
          {actions.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              <p>Aucune action exécutée. Démarrez l'agent pour commencer.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className={`flex items-start gap-3 py-1 px-2 hover:bg-muted/50 transition-colors ${
                    action.status === "in-progress" ? "bg-blue-50" : ""
                  }`}
                >
                  <span className="text-muted-foreground select-none w-24 flex-shrink-0">
                    {formatTime(action.timestamp)}
                  </span>
                  <span className={`font-bold w-4 flex-shrink-0 ${getStatusColor(action.status)}`}>
                    {getStatusIcon(action.status)}
                  </span>
                  <span className="flex-1">
                    {action.description}
                    {action.coordinates && (
                      <span className="text-muted-foreground ml-2">
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
      </ScrollArea>

      <Separator />

      {/* Logs Footer */}
      <div className="px-6 py-2 text-xs text-muted-foreground">
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
            <span className="text-muted-foreground font-bold">○</span>
            <span>En attente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
