import React from 'react'
import { ThemeProvider } from './hooks/useTheme'
import Dashboard from './components/Dashboard'
import './styles/globals.css'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nexus-theme">
      <Dashboard />
    </ThemeProvider>
  )
}

export default App
