"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Message } from "./Dashboard";

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Interface de commande</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Décrivez votre tâche en langage naturel
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.type === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 ${
                  message.type === "user"
                    ? "bg-black text-white"
                    : "bg-muted text-foreground border"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              <span className="text-xs text-muted-foreground mt-1 px-1">
                {formatTime(message.timestamp)}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Separator />

      {/* Input Form */}
      <div className="px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Range mes fichiers par type dans le dossier Downloads"
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!input.trim()}
          >
            ENVOYER
          </Button>
        </form>
        <div className="mt-3 flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendMessage("Range mes fichiers du bureau par type")}
            className="text-xs"
          >
            Ranger fichiers
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendMessage("Ouvre Chrome et va sur gmail.com")}
            className="text-xs"
          >
            Ouvrir application
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendMessage("Crée un dossier 'Projets 2026' sur le bureau")}
            className="text-xs"
          >
            Créer dossier
          </Button>
        </div>
      </div>
    </div>
  );
}
