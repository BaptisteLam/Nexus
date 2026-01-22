import React, { useState, useEffect, useRef, useCallback } from 'react'
import Header from './Header'
import ChatPanel from './ChatPanel'
import ScreenPreview from './ScreenPreview'
import ActionLogs from './ActionLogs'
import { useScreenCapture } from '../hooks/useScreenCapture'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || ''

export default function Dashboard() {
  const [isAgentRunning, setIsAgentRunning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: "Bonjour ! Je suis Nexus, votre assistant d'automatisation desktop basé sur Claude AI.\n\n1. Cliquez sur 'Partager l'écran' pour me montrer votre écran\n2. Démarrez l'agent\n3. Décrivez ce que vous voulez faire !",
      timestamp: new Date(),
    },
  ])
  const [actions, setActions] = useState([])
  const [currentHighlight, setCurrentHighlight] = useState(null)
  const [lastScreenshot, setLastScreenshot] = useState(null)

  // Screen capture hook
  const {
    isCapturing,
    stream,
    error: captureError,
    startCapture,
    stopCapture,
    captureFrame,
  } = useScreenCapture()

  const videoRef = useRef(null)

  // Add action to logs
  const addAction = useCallback((partial) => {
    const action = {
      ...partial,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }
    setActions((prev) => [...prev, action])
    return action.id
  }, [])

  // Update action by id
  const updateAction = useCallback((id, updates) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    )
  }, [])

  // Capture frame from video
  const handleCaptureFrame = useCallback(async () => {
    if (videoRef.current && isCapturing) {
      const frame = await captureFrame(videoRef.current)
      if (frame) {
        setLastScreenshot(frame.base64)
        return frame
      }
    }
    return null
  }, [captureFrame, isCapturing])

  // Execute automation with real screenshot
  const executeAutomation = useCallback(async (userIntent) => {
    setIsProcessing(true)

    try {
      // Step 1: Capture real screenshot
      const screenshotActionId = addAction({
        description: "Capture d'écran en cours...",
        status: 'in-progress',
      })

      let screenshotBase64 = null
      
      if (isCapturing && videoRef.current) {
        const frame = await handleCaptureFrame()
        if (frame) {
          screenshotBase64 = frame.base64
          updateAction(screenshotActionId, {
            description: `Capture d'écran effectuée (${frame.width}x${frame.height})`,
            status: 'completed',
          })
        } else {
          updateAction(screenshotActionId, {
            description: "Capture d'écran échouée - vidéo non prête",
            status: 'error',
          })
        }
      } else {
        updateAction(screenshotActionId, {
          description: "Aucun partage d'écran actif",
          status: 'error',
        })
        
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'ai',
            content: "⚠️ Veuillez d'abord partager votre écran en cliquant sur 'Partager l'écran' pour que je puisse voir ce que vous faites.",
            timestamp: new Date(),
          },
        ])
        setIsProcessing(false)
        return
      }

      // Step 2: Send to AI for analysis
      const analysisActionId = addAction({
        description: 'Envoi à Claude pour analyse...',
        status: 'in-progress',
      })

      const analysisRes = await fetch(`${BACKEND_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenshot: screenshotBase64,
          userIntent,
        }),
      })

      if (!analysisRes.ok) {
        throw new Error(`API error: ${analysisRes.status}`)
      }

      const analysisData = await analysisRes.json()

      updateAction(analysisActionId, {
        description: 'Analyse Claude complétée',
        status: 'completed',
      })

      // Add AI response to chat
      const aiResponse = analysisData.response || analysisData.analysis?.explanation || "J'ai analysé votre écran."
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
        },
      ])

      // Step 3: Show suggested actions
      const analysis = analysisData.analysis
      
      if (analysis?.coordinates) {
        // Show highlight where AI suggests to click
        setCurrentHighlight({
          x: analysis.coordinates.x,
          y: analysis.coordinates.y,
        })

        addAction({
          description: `💡 Action suggérée: Cliquer à (${analysis.coordinates.x}, ${analysis.coordinates.y})`,
          coordinates: analysis.coordinates,
          status: 'completed',
        })

        // Clear highlight after 5 seconds
        setTimeout(() => setCurrentHighlight(null), 5000)
      }

      if (analysis?.command) {
        addAction({
          description: `💡 Commande suggérée: ${analysis.command}`,
          status: 'completed',
        })
      }

      // Confidence info
      if (analysis?.confidence) {
        addAction({
          description: `Confiance de l'analyse: ${analysis.confidence}%`,
          status: 'completed',
        })
      }

    } catch (error) {
      console.error('Automation error:', error)
      addAction({
        description: `❌ Erreur: ${error.message}`,
        status: 'error',
      })
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'ai',
          content: `Désolé, une erreur s'est produite: ${error.message}`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }, [addAction, updateAction, isCapturing, handleCaptureFrame])

  // Handle send message
  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    if (!isAgentRunning) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "⚠️ L'agent n'est pas actif. Cliquez sur 'Démarrer' pour commencer.",
          timestamp: new Date(),
        },
      ])
      return
    }

    if (!isCapturing) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "⚠️ Veuillez d'abord partager votre écran pour que je puisse l'analyser.",
          timestamp: new Date(),
        },
      ])
      return
    }

    await executeAutomation(content)
  }

  // Toggle agent
  const handleToggleAgent = () => {
    const newState = !isAgentRunning
    setIsAgentRunning(newState)
    
    const statusMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: newState
        ? "✅ Agent démarré ! Je suis prêt à analyser votre écran et vous aider. Décrivez ce que vous voulez faire."
        : "🛑 Agent arrêté.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, statusMessage])

    if (newState) {
      addAction({
        description: 'Agent démarré',
        status: 'completed',
      })
    }
  }

  // Clear session
  const handleClearSession = () => {
    setMessages([
      {
        id: Date.now().toString(),
        type: 'ai',
        content: "Session réinitialisée. Partagez votre écran et démarrez l'agent pour commencer !",
        timestamp: new Date(),
      },
    ])
    setActions([])
    setCurrentHighlight(null)
    setLastScreenshot(null)
    setIsAgentRunning(false)
  }

  // Clear actions
  const handleClearActions = () => {
    setActions([])
  }

  // Handle screen capture start
  const handleStartCapture = async () => {
    const result = await startCapture()
    if (result) {
      addAction({
        description: "Partage d'écran activé",
        status: 'completed',
      })
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'ai',
          content: "📺 Parfait ! Je vois maintenant votre écran. Démarrez l'agent si ce n'est pas fait, puis dites-moi ce que vous voulez accomplir.",
          timestamp: new Date(),
        },
      ])
    }
  }

  // Handle screen capture stop
  const handleStopCapture = () => {
    stopCapture()
    addAction({
      description: "Partage d'écran arrêté",
      status: 'completed',
    })
  }

  return (
    <div data-testid="dashboard" className="h-screen w-full flex flex-col bg-background">
      <Header
        isAgentRunning={isAgentRunning}
        onToggleAgent={handleToggleAgent}
        onClearSession={handleClearSession}
        isCapturing={isCapturing}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-[400px] border-r flex flex-col">
          <ChatPanel 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right Panel - Preview & Logs */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ScreenPreview 
              currentHighlight={currentHighlight} 
              screenshot={lastScreenshot}
              stream={stream}
              isCapturing={isCapturing}
              onStartCapture={handleStartCapture}
              onStopCapture={handleStopCapture}
              captureError={captureError}
              videoRef={videoRef}
            />
          </div>
          <div className="h-52 border-t">
            <ActionLogs 
              actions={actions} 
              onClear={handleClearActions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
