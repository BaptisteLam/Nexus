import React, { useState, useRef, useEffect } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { 
  Send, 
  Bot, 
  User, 
  Folder, 
  Globe, 
  FolderPlus,
  Sparkles
} from 'lucide-react'

export default function ChatPanel({ messages, onSendMessage, isProcessing }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const quickActions = [
    { icon: Folder, label: 'Ranger fichiers', message: 'Range mes fichiers du bureau par type' },
    { icon: Globe, label: 'Ouvrir app', message: 'Ouvre Chrome et va sur gmail.com' },
    { icon: FolderPlus, label: 'Créer dossier', message: "Crée un dossier 'Projets 2026' sur le bureau" },
  ]

  return (
    <div data-testid="chat-panel" className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="px-5 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Interface de commande</h2>
            <p className="text-xs text-muted-foreground">
              Décrivez votre tâche en langage naturel
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-5 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              data-testid={`message-${message.type}`}
              className={`flex gap-3 ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`flex flex-col ${
                message.type === 'user' ? 'items-end' : 'items-start'
              } max-w-[80%]`}>
                <div className={`px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground mt-1 px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted px-4 py-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Separator />

      {/* Input */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            data-testid="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Range mes fichiers par type dans Downloads..."
            className="flex-1"
            disabled={isProcessing}
          />
          <Button
            data-testid="send-btn"
            type="submit"
            disabled={!input.trim() || isProcessing}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {/* Quick Actions */}
        <div className="mt-3 flex gap-2 flex-wrap">
          {quickActions.map((action, idx) => (
            <Button
              key={idx}
              data-testid={`quick-action-${idx}`}
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(action.message)}
              disabled={isProcessing}
              className="text-xs gap-1.5"
            >
              <action.icon className="w-3 h-3" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
