import React, { useRef, useEffect } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  Trash2,
  Terminal
} from 'lucide-react'

export default function ActionLogs({ actions, onClear }) {
  const logsEndRef = useRef(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [actions])

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(date))
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Circle className="w-4 h-4 text-muted-foreground" />
      case 'error':
        return <Circle className="w-4 h-4 text-red-500" />
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div data-testid="action-logs" className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="px-5 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold">Journal d'actions</h3>
            <p className="text-xs text-muted-foreground">
              {actions.length} action{actions.length !== 1 ? 's' : ''} enregistrée{actions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {actions.length > 0 && (
          <Button
            data-testid="clear-logs-btn"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs h-7"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      {/* Logs */}
      <ScrollArea className="flex-1">
        <div className="px-5 py-3 font-mono text-xs">
          {actions.length === 0 ? (
            <div className="h-24 flex flex-col items-center justify-center text-muted-foreground">
              <Terminal className="w-8 h-8 mb-2 opacity-50" />
              <p>Aucune action exécutée</p>
              <p className="text-xs">Démarrez l'agent pour commencer</p>
            </div>
          ) : (
            <div className="space-y-1">
              {actions.map((action) => (
                <div
                  key={action.id}
                  data-testid={`action-${action.id}`}
                  className={`flex items-start gap-3 py-2 px-2 rounded-md transition-colors ${
                    action.status === 'in-progress' 
                      ? 'bg-blue-500/10' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <span className="text-muted-foreground w-20 flex-shrink-0">
                    {formatTime(action.timestamp)}
                  </span>
                  <span className="flex-shrink-0">
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

      {/* Legend */}
      <div className="px-5 py-2 text-xs text-muted-foreground flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          <span>Complété</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 text-blue-500" />
          <span>En cours</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Circle className="w-3 h-3 text-muted-foreground" />
          <span>En attente</span>
        </div>
      </div>
    </div>
  )
}
