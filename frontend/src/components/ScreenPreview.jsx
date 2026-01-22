import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { 
  Monitor, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Wifi,
  WifiOff,
  MousePointer2,
  Globe
} from 'lucide-react'

export default function ScreenPreview({ currentHighlight, screenshot }) {
  const [isConnected, setIsConnected] = useState(false)
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div data-testid="screen-preview" className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <div className="px-5 py-3 bg-card border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="w-4 h-4 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold">Aperçu de l'écran</h3>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Connecté • Streaming en direct' : 'Connexion en cours...'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-md p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs font-medium w-10 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(Math.min(200, zoom + 10))}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(100)}
            className="text-xs h-7"
          >
            <Maximize2 className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center p-6">
        {!isConnected ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Connexion au bureau...</p>
          </div>
        ) : screenshot ? (
          <div
            className="relative bg-card border rounded-lg shadow-lg overflow-hidden"
            style={{
              transform: `scale(${zoom / 100})`,
              transition: 'transform 0.2s ease',
            }}
          >
            <img 
              src={`data:image/png;base64,${screenshot}`} 
              alt="Desktop screenshot" 
              className="max-w-full"
            />
            {currentHighlight && (
              <div
                className="absolute w-20 h-20 border-4 border-red-500 rounded-md animate-pulse pointer-events-none"
                style={{
                  left: `${currentHighlight.x}px`,
                  top: `${currentHighlight.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                  ACTION IA
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="relative bg-card border rounded-lg shadow-lg overflow-hidden"
            style={{
              transform: `scale(${zoom / 100})`,
              transition: 'transform 0.2s ease',
            }}
          >
            {/* Mock Desktop */}
            <div className="w-[800px] h-[500px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative p-4">
              {/* Mock Window 1 */}
              <div className="absolute top-6 left-6 w-72 h-44 bg-card border rounded-lg shadow-md overflow-hidden">
                <div className="h-8 bg-muted border-b flex items-center px-3 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-medium ml-2">Fichiers - Bureau</span>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-blue-400 rounded" />
                    <span>Documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-yellow-400 rounded" />
                    <span>Images</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-green-400 rounded" />
                    <span>Downloads</span>
                  </div>
                </div>
              </div>

              {/* Mock Window 2 - Terminal */}
              <div className="absolute top-16 left-80 w-80 h-52 bg-slate-900 border border-slate-700 rounded-lg shadow-md overflow-hidden">
                <div className="h-8 bg-slate-800 flex items-center px-3">
                  <span className="text-xs text-slate-300 font-medium">Terminal</span>
                </div>
                <div className="p-3 text-green-400 font-mono text-xs">
                  <div>$ npm run dev</div>
                  <div className="mt-1 text-slate-500">Starting development server...</div>
                  <div className="text-slate-500">Ready on http://localhost:3000</div>
                  <div className="mt-2 animate-pulse">█</div>
                </div>
              </div>

              {/* Desktop Icons */}
              <div className="absolute bottom-6 left-6 flex gap-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl shadow flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-300">Chrome</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-violet-500 rounded-xl shadow flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-300">VS Code</span>
                </div>
              </div>

              {/* Cursor */}
              {currentHighlight && (
                <>
                  <div
                    className="absolute w-16 h-16 border-4 border-primary rounded-lg animate-pulse pointer-events-none"
                    style={{
                      left: `${currentHighlight.x}px`,
                      top: `${currentHighlight.y}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                  <MousePointer2
                    className="absolute w-5 h-5 text-foreground pointer-events-none transition-all duration-300"
                    style={{
                      left: `${currentHighlight.x}px`,
                      top: `${currentHighlight.y}px`,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2 bg-card border-t text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>Résolution: 1920×1080</span>
          <span>FPS: 30</span>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">Stream actif</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>Déconnecté</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
