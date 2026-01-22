import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { 
  Monitor, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Wifi,
  WifiOff,
  Camera,
  CameraOff,
  AlertCircle,
  Crosshair
} from 'lucide-react'

export default function ScreenPreview({ 
  currentHighlight, 
  screenshot,
  stream,
  isCapturing,
  onStartCapture,
  onStopCapture,
  captureError,
  videoRef
}) {
  const [zoom, setZoom] = React.useState(100)
  const [videoReady, setVideoReady] = React.useState(false)
  const [videoDimensions, setVideoDimensions] = React.useState({ width: 0, height: 0 })

  // Connect stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play()
        setVideoReady(true)
        setVideoDimensions({
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        })
      }
    } else {
      setVideoReady(false)
      setVideoDimensions({ width: 0, height: 0 })
    }
  }, [stream, videoRef])

  return (
    <div data-testid="screen-preview" className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <div className="px-5 py-3 bg-card border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="w-4 h-4 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold">Aperçu de l'écran</h3>
            <p className="text-xs text-muted-foreground">
              {isCapturing && videoReady 
                ? `Partage actif (${videoDimensions.width}×${videoDimensions.height})` 
                : 'Cliquez pour partager votre écran'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Screen share toggle */}
          {isCapturing ? (
            <Button
              data-testid="stop-capture-btn"
              variant="destructive"
              size="sm"
              onClick={onStopCapture}
              className="gap-1.5"
            >
              <CameraOff className="w-4 h-4" />
              Arrêter
            </Button>
          ) : (
            <Button
              data-testid="start-capture-btn"
              variant="default"
              size="sm"
              onClick={onStartCapture}
              className="gap-1.5"
            >
              <Camera className="w-4 h-4" />
              Partager l'écran
            </Button>
          )}

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-muted rounded-md p-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(Math.max(25, zoom - 10))}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs font-medium w-10 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(Math.min(150, zoom + 10))}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(50)}
            className="text-xs h-7"
          >
            <Maximize2 className="w-3 h-3 mr-1" />
            Fit
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto relative flex items-center justify-center p-4 bg-black/5 dark:bg-black/20">
        {captureError ? (
          <div className="text-center p-6 bg-card rounded-lg border">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-sm text-destructive font-medium mb-2">Erreur de capture</p>
            <p className="text-xs text-muted-foreground mb-4">{captureError}</p>
            <Button onClick={onStartCapture} size="sm">
              Réessayer
            </Button>
          </div>
        ) : isCapturing && stream ? (
          <div
            className="relative rounded-lg shadow-2xl overflow-hidden border-2 border-primary/20"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease',
            }}
          >
            {/* Real screen capture video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="rounded-lg"
              style={{ 
                display: videoReady ? 'block' : 'none',
                maxHeight: '70vh',
              }}
            />
            
            {!videoReady && (
              <div className="w-[800px] h-[450px] flex items-center justify-center bg-card">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Chargement du flux vidéo...</p>
                </div>
              </div>
            )}

            {/* Highlight overlay - shows where AI suggests to click */}
            {currentHighlight && videoReady && (
              <>
                {/* Crosshair lines */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500/50 pointer-events-none z-10"
                  style={{ left: `${currentHighlight.x}px` }}
                />
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-red-500/50 pointer-events-none z-10"
                  style={{ top: `${currentHighlight.y}px` }}
                />
                
                {/* Target circle */}
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: `${currentHighlight.x}px`,
                    top: `${currentHighlight.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="relative">
                    {/* Outer pulse ring */}
                    <div className="absolute w-24 h-24 -left-12 -top-12 border-4 border-red-500 rounded-full animate-ping opacity-30" />
                    
                    {/* Inner target */}
                    <div className="w-16 h-16 -ml-8 -mt-8 border-4 border-red-500 rounded-full flex items-center justify-center bg-red-500/20">
                      <Crosshair className="w-6 h-6 text-red-500" />
                    </div>
                    
                    {/* Label */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap shadow-lg">
                      Cliquer ici
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-500" />
                    </div>
                    
                    {/* Coordinates */}
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
                      ({currentHighlight.x}, {currentHighlight.y})
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Placeholder when not capturing */
          <div className="text-center p-8 bg-card rounded-lg border max-w-lg">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Monitor className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Partagez votre écran</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Pour que l'IA puisse analyser votre écran et vous guider, 
              cliquez sur le bouton ci-dessous et sélectionnez l'écran ou fenêtre à partager.
            </p>
            <Button onClick={onStartCapture} size="lg" className="gap-2">
              <Camera className="w-5 h-5" />
              Partager mon écran
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Votre navigateur demandera l'autorisation. Choisissez "Écran entier" pour de meilleurs résultats.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2 bg-card border-t text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isCapturing && videoReady && (
            <>
              <span>🔴 Live</span>
              <span>{videoDimensions.width}×{videoDimensions.height}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isCapturing ? (
            <>
              <Wifi className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">Partage actif</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>Non connecté</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
