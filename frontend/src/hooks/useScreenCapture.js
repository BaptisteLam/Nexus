import { useState, useRef, useCallback } from 'react'

export function useScreenCapture() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Start screen capture
  const startCapture = useCallback(async () => {
    try {
      setError(null)
      
      // Request screen capture permission
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          displaySurface: "monitor",
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
      setError(err.message || 'Failed to capture screen')
      setIsCapturing(false)
      return null
    }
  }, [])

  // Stop screen capture
  const stopCapture = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCapturing(false)
  }, [stream])

  // Capture a single frame as base64
  const captureFrame = useCallback(async (videoElement) => {
    if (!videoElement || !isCapturing) return null

    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoElement, 0, 0)
      
      // Convert to base64 (remove data:image/png;base64, prefix)
      const dataUrl = canvas.toDataURL('image/png', 0.8)
      const base64 = dataUrl.split(',')[1]
      
      return {
        base64,
        width: canvas.width,
        height: canvas.height,
        timestamp: new Date().toISOString()
      }
    } catch (err) {
      console.error('Frame capture error:', err)
      return null
    }
  }, [isCapturing])

  return {
    isCapturing,
    stream,
    error,
    startCapture,
    stopCapture,
    captureFrame,
    videoRef,
    canvasRef,
  }
}
