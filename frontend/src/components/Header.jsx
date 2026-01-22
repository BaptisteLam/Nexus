import React from 'react'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/tooltip'
import { useTheme } from '../hooks/useTheme'
import { 
  Monitor, 
  Sun, 
  Moon, 
  Settings, 
  Play, 
  Square, 
  RotateCcw,
  Cpu
} from 'lucide-react'

export default function Header({ isAgentRunning, onToggleAgent, onClearSession }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <TooltipProvider>
      <header data-testid="header" className="h-16 bg-card border-b flex items-center justify-between px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">NEXUS</h1>
              <p className="text-xs text-muted-foreground">AI Desktop Automation</p>
            </div>
          </div>
        </div>

        {/* Center - Status */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isAgentRunning 
              ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
              : 'bg-muted text-muted-foreground'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isAgentRunning ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
            }`} />
            <span className="text-sm font-medium">
              {isAgentRunning ? 'Agent actif' : 'Agent inactif'}
            </span>
            <Monitor className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Right - Controls */}
        <div className="flex items-center gap-2">
          <Button
            data-testid="toggle-agent-btn"
            onClick={onToggleAgent}
            variant={isAgentRunning ? "destructive" : "default"}
            className="gap-2"
          >
            {isAgentRunning ? (
              <>
                <Square className="w-4 h-4" />
                Arrêter
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Démarrer
              </>
            )}
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="clear-session-btn"
                onClick={onClearSession}
                variant="outline"
                size="icon"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Réinitialiser la session</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="theme-toggle-btn"
                onClick={toggleTheme}
                variant="outline"
                size="icon"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="settings-btn"
                variant="ghost"
                size="icon"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Paramètres</TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  )
}
