import React, { useState, useEffect, useCallback } from 'react'
import Header from './Header'
import ChatPanel from './ChatPanel'
import ScreenPreview from './ScreenPreview'
import ActionLogs from './ActionLogs'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || ''

export default function Dashboard() {
  const [isAgentRunning, setIsAgentRunning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: "Bonjour ! Je suis Nexus, votre assistant d'automatisation desktop basé sur Claude AI. Décrivez-moi ce que vous souhaitez automatiser.",
      timestamp: new Date(),
    },
  ])
  const [actions, setActions] = useState([])
  const [currentHighlight, setCurrentHighlight] = useState(null)
  const [screenshot, setScreenshot] = useState(null)

  // Add action to logs
  const addAction = useCallback((partial) => {
    const action = {
      ...partial,
      id: `action-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    }
    setActions((prev) => [...prev, action])
    return action.id
  }, [])

  // Update last action
  const updateAction = useCallback((id, updates) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    )
  }, [])

  // Execute automation
  const executeAutomation = useCallback(async (userIntent) => {
    setIsProcessing(true)

    try {
      // Step 1: Capture screenshot
      const screenshotActionId = addAction({
        description: "Capture d'écran en cours...",
        status: 'in-progress',
      })

      const screenshotRes = await fetch(`${BACKEND_URL}/api/desktop/screenshot`, {
        method: 'POST',
      })
      const screenshotData = await screenshotRes.json()

      if (screenshotData.screenshot) {
        setScreenshot(screenshotData.screenshot)
        updateAction(screenshotActionId, {
          description: "Capture d'écran effectuée",
          status: 'completed',
        })
      } else {
        updateAction(screenshotActionId, {
          description: "Capture d'écran (simulation)",
          status: 'completed',
        })
      }

      // Step 2: Analyze with AI
      const analysisActionId = addAction({
        description: 'Analyse visuelle de l\'interface...',
        status: 'in-progress',
      })

      const analysisRes = await fetch(`${BACKEND_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenshot: screenshotData.screenshot,
          userIntent,
        }),
      })
      const analysisData = await analysisRes.json()

      updateAction(analysisActionId, {
        description: 'Analyse visuelle complétée',
        status: 'completed',
      })

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'ai',
          content: analysisData.response || analysisData.analysis?.explanation || "J'ai analysé votre demande.",
          timestamp: new Date(),
        },
      ])

      // Step 3: Execute actions if coordinates provided
      const analysis = analysisData.analysis
      if (analysis?.coordinates) {
        setCurrentHighlight(analysis.coordinates)

        const moveActionId = addAction({
          description: `Déplacement du curseur vers (${analysis.coordinates.x}, ${analysis.coordinates.y})`,
          coordinates: analysis.coordinates,
          status: 'in-progress',
        })

        await fetch(`${BACKEND_URL}/api/desktop/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'move',
            payload: analysis.coordinates,
          }),
        })

        updateAction(moveActionId, { status: 'completed' })

        // Click action
        const clickActionId = addAction({
          description: 'Clic exécuté',
          coordinates: analysis.coordinates,
          status: 'in-progress',
        })

        await fetch(`${BACKEND_URL}/api/desktop/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'click',
            payload: { ...analysis.coordinates, button: 'left' },
          }),
        })

        updateAction(clickActionId, { status: 'completed' })

        setTimeout(() => setCurrentHighlight(null), 2000)
      }

      // Final success
      addAction({
        description: `Tâche complétée avec succès`,
        status: 'completed',
      })

    } catch (error) {
      console.error('Automation error:', error)
      addAction({
        description: `Erreur: ${error.message}`,
        status: 'error',
      })
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'ai',
          content: "Désolé, une erreur s'est produite lors de l'exécution. Veuillez réessayer.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }, [addAction, updateAction])

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
          content: "L'agent n'est pas actif. Cliquez sur 'Démarrer' pour commencer l'automatisation.",
          timestamp: new Date(),
        },
      ])
      return
    }

    await executeAutomation(content)
  }

  // Toggle agent
  const handleToggleAgent = () => {
    setIsAgentRunning(!isAgentRunning)
    const statusMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: !isAgentRunning
        ? "Agent démarré. Je surveille votre écran et suis prêt à exécuter vos commandes."
        : "Agent arrêté. Session terminée.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, statusMessage])
  }

  // Clear session
  const handleClearSession = () => {
    setMessages([
      {
        id: Date.now().toString(),
        type: 'ai',
        content: "Bonjour ! Je suis Nexus, votre assistant d'automatisation desktop basé sur Claude AI. Décrivez-moi ce que vous souhaitez automatiser.",
        timestamp: new Date(),
      },
    ])
    setActions([])
    setCurrentHighlight(null)
    setScreenshot(null)
    setIsAgentRunning(false)
  }

  // Clear actions
  const handleClearActions = () => {
    setActions([])
  }

  return (
    <div data-testid="dashboard" className="h-screen w-full flex flex-col bg-background">
      <Header
        isAgentRunning={isAgentRunning}
        onToggleAgent={handleToggleAgent}
        onClearSession={handleClearSession}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-[380px] border-r flex flex-col">
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
              screenshot={screenshot}
            />
          </div>
          <div className="h-48 border-t">
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
