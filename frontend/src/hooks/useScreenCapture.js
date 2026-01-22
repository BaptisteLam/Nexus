import { useState, useRef, useCallback, useEffect } from 'react'

export function useScreenCapture() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [lastFrame, setLastFrame] = useState(null)
  const videoRef = useRef(null)
  const intervalRef = useRef(null)

  // Start screen capture
  const startCapture = useCallback(async () => {
    try {
      setError(null)
      
      // Request screen capture permission
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          displaySurface: "monitor",
          frameRate: { ideal: 5, max: 10 }, // Lower framerate for streaming
        },
        audio: false,
      })

      setStream(mediaStream)
      setIsCapturing(true)

      // Handle stream end (user stops sharing)
      mediaStream.getVideoTracks()[0].onended = () => {
        stopCapture()
      }

      return mediaStream
    } catch (err) {
      console.error('Screen capture error:', err)
      if (err.name === 'NotAllowedError') {
        setError('Permission refusée. Veuillez autoriser le partage d\'écran.')
      } else {
        setError(err.message || 'Échec de la capture d\'écran')
      }
      setIsCapturing(false)
      return null
    }
  }, [])

  // Stop screen capture
  const stopCapture = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCapturing(false)
    setLastFrame(null)
  }, [stream])

  // Capture a single frame as base64
  const captureFrame = useCallback(async (videoElement) => {
    if (!videoElement || videoElement.readyState < 2) return null

    try {
      const canvas = document.createElement('canvas')
      // Scale down for faster processing
      const scale = Math.min(1, 1280 / videoElement.videoWidth)
      canvas.width = videoElement.videoWidth * scale
      canvas.height = videoElement.videoHeight * scale
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
      
      // Convert to base64 JPEG for smaller size
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
      const base64 = dataUrl.split(',')[1]
      
      const frame = {
        base64,
        width: canvas.width,
        height: canvas.height,
        originalWidth: videoElement.videoWidth,
        originalHeight: videoElement.videoHeight,
        timestamp: new Date().toISOString()
      }
      
      setLastFrame(frame)
      return frame
    } catch (err) {
      console.error('Frame capture error:', err)
      return null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return {
    isCapturing,
    stream,
    error,
    lastFrame,
    startCapture,
    stopCapture,
    captureFrame,
    videoRef,
  }
}
