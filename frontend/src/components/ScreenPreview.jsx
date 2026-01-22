import React, { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { 
  Monitor, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Wifi,
  WifiOff,
  MousePointer2,
  Globe,
  Camera,
  CameraOff,
  AlertCircle
} from 'lucide-react'

export default function ScreenPreview({ 
  currentHighlight, 
  screenshot,
  stream,
  isCapturing,
  onStartCapture,
  onStopCapture,
  onCaptureFrame,
  captureError
}) {
  const [zoom, setZoom] = useState(100)
  const videoRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)

  // Connect stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play()
        setVideoReady(true)
      }
    } else {
      setVideoReady(false)
    }
  }, [stream])

  // Handle capture frame from video
  const handleCaptureFrame = async () => {
    if (videoRef.current && onCaptureFrame) {
      await onCaptureFrame(videoRef.current)
    }
  }

  return (
    <div data-testid="screen-preview" className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <div className="px-5 py-3 bg-card border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="w-4 h-4 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold">Aperçu de l'écran</h3>
            <p className="text-xs text-muted-foreground">
              {isCapturing ? 'Partage d\'écran actif' : 'Cliquez pour partager votre écran'}
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
              Arrêter le partage
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
      <div className="flex-1 overflow-auto relative flex items-center justify-center p-4">
        {captureError ? (
          <div className="text-center p-6">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-sm text-destructive font-medium mb-2">Erreur de capture</p>
            <p className="text-xs text-muted-foreground mb-4">{captureError}</p>
            <Button onClick={onStartCapture} size="sm">
              Réessayer
            </Button>
          </div>
        ) : isCapturing && stream ? (
          <div
            className="relative bg-black rounded-lg shadow-2xl overflow-hidden"
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
              className="max-w-full max-h-[60vh] rounded-lg"
              style={{ display: videoReady ? 'block' : 'none' }}
            />
            
            {!videoReady && (
              <div className="w-[800px] h-[450px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
              </div>
            )}

            {/* Highlight overlay */}
            {currentHighlight && (
              <div
                className="absolute w-20 h-20 border-4 border-red-500 rounded-md animate-pulse pointer-events-none z-10"
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
              className="max-w-full max-h-[60vh]"
            />
          </div>
        ) : (
          /* Placeholder when not capturing */
          <div className="text-center p-8">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Monitor className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Partagez votre écran</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Pour que l'IA puisse voir et analyser votre écran, cliquez sur le bouton ci-dessus 
              et sélectionnez l'écran ou la fenêtre à partager.
            </p>
            <Button onClick={onStartCapture} size="lg" className="gap-2">
              <Camera className="w-5 h-5" />
              Commencer le partage d'écran
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Votre navigateur vous demandera l'autorisation de partager votre écran.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2 bg-card border-t text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isCapturing && videoReady && videoRef.current && (
            <>
              <span>Résolution: {videoRef.current.videoWidth}×{videoRef.current.videoHeight}</span>
              <span>Live</span>
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
