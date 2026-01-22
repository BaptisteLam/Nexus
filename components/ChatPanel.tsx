"use client";

import { useState, useRef, useEffect } from "react";
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
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-300">
        <h2 className="text-xl font-bold font-times">Interface de commande</h2>
        <p className="text-sm text-gray-600 mt-1">
          Décrivez votre tâche en langage naturel
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.type === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-lg ${
                message.type === "user"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black border border-gray-300"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
            <span className="text-xs text-gray-500 mt-1 px-1">
              {formatTime(message.timestamp)}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="px-6 py-4 border-t border-gray-300">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Range mes fichiers par type dans le dossier Downloads"
            className="flex-1 px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3 bg-black text-white font-bold font-times text-sm hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            ENVOYER
          </button>
        </form>
        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            onClick={() => onSendMessage("Range mes fichiers du bureau par type")}
            className="px-3 py-1 text-xs border border-gray-400 hover:bg-gray-100 transition-colors"
          >
            Ranger fichiers
          </button>
          <button
            onClick={() => onSendMessage("Ouvre Chrome et va sur gmail.com")}
            className="px-3 py-1 text-xs border border-gray-400 hover:bg-gray-100 transition-colors"
          >
            Ouvrir application
          </button>
          <button
            onClick={() => onSendMessage("Crée un dossier 'Projets 2026' sur le bureau")}
            className="px-3 py-1 text-xs border border-gray-400 hover:bg-gray-100 transition-colors"
          >
            Créer dossier
          </button>
        </div>
      </div>
    </div>
  );
}
