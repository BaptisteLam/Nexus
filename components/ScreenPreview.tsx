"use client";

import { useEffect, useState } from "react";

interface ScreenPreviewProps {
  currentHighlight: { x: number; y: number } | null;
}

export default function ScreenPreview({ currentHighlight }: ScreenPreviewProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => setIsConnected(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Preview Header */}
      <div className="px-6 py-3 bg-white border-b border-gray-300 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-times">Aperçu de l'écran</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            {isConnected ? "Connecté • Streaming en direct" : "Connexion en cours..."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="px-2 py-1 text-xs border border-gray-400 hover:bg-gray-100"
              title="Zoom out"
            >
              -
            </button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="px-2 py-1 text-xs border border-gray-400 hover:bg-gray-100"
              title="Zoom in"
            >
              +
            </button>
          </div>
          <button
            onClick={() => setZoom(100)}
            className="px-3 py-1 text-xs border border-gray-400 hover:bg-gray-100"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4">
        {!isConnected ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600">Connexion au bureau...</p>
          </div>
        ) : (
          <div
            className="relative bg-white border-2 border-black shadow-2xl overflow-hidden"
            style={{
              transform: `scale(${zoom / 100})`,
              transition: "transform 0.2s ease",
            }}
          >
            {/* Mock Desktop Screenshot */}
            <div className="w-[900px] h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 relative">
              {/* Mock Window 1 */}
              <div className="absolute top-10 left-10 w-80 h-52 bg-white border border-gray-300 shadow-lg rounded-sm">
                <div className="h-8 bg-gray-200 border-b border-gray-300 flex items-center px-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="ml-4 text-xs font-medium">Fichiers - Bureau</div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-blue-200 rounded" />
                    <span>Documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-yellow-200 rounded" />
                    <span>Images</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-green-200 rounded" />
                    <span>Downloads</span>
                  </div>
                </div>
              </div>

              {/* Mock Window 2 */}
              <div className="absolute top-24 left-96 w-96 h-64 bg-white border border-gray-300 shadow-lg rounded-sm">
                <div className="h-8 bg-gray-800 flex items-center px-3">
                  <div className="text-white text-xs font-medium">Terminal</div>
                </div>
                <div className="p-3 bg-black text-green-400 font-mono text-xs">
                  <div>$ npm run dev</div>
                  <div className="mt-1 opacity-70">Starting development server...</div>
                  <div className="mt-1 opacity-70">Ready on http://localhost:3000</div>
                  <div className="mt-2 animate-pulse">█</div>
                </div>
              </div>

              {/* Mock Desktop Icons */}
              <div className="absolute bottom-10 left-10 space-y-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-blue-400 rounded shadow" />
                  <span className="text-xs text-white drop-shadow">Chrome</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-purple-400 rounded shadow" />
                  <span className="text-xs text-white drop-shadow">VS Code</span>
                </div>
              </div>

              {/* Current Highlight */}
              {currentHighlight && (
                <div
                  className="absolute w-20 h-20 border-4 border-red-500 rounded animate-pulse pointer-events-none"
                  style={{
                    left: `${currentHighlight.x}px`,
                    top: `${currentHighlight.y}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                    ACTION IA
                  </div>
                </div>
              )}

              {/* Cursor */}
              <div
                className="absolute w-4 h-4 bg-black pointer-events-none"
                style={{
                  clipPath: "polygon(0 0, 0 100%, 25% 75%, 45% 100%, 55% 90%, 35% 65%, 100% 30%)",
                  left: currentHighlight ? `${currentHighlight.x}px` : "50%",
                  top: currentHighlight ? `${currentHighlight.y}px` : "50%",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview Footer */}
      <div className="px-6 py-2 bg-white border-t border-gray-300 text-xs text-gray-600 flex items-center justify-between">
        <div>Résolution: 1920×1080 • FPS: 30</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Stream actif</span>
        </div>
      </div>
    </div>
  );
}
