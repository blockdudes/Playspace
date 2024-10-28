"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Maximize2, Minimize2, Volume2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { games, Game } from "../page"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [game, setGame] = useState<Game | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setGame(games.find((game) => game.id === parseInt(params.id as string)) || null)
  }, [params.id])


  useEffect(() => {
    const startTime = new Date().toISOString();
    sessionStorage.setItem('startTime', startTime);
  
    return () => {
      try {
        const endTime = new Date().toISOString();
        const savedStartTime = sessionStorage.getItem('startTime');
  
        if (savedStartTime) {
          const duration = (new Date(endTime).getTime() - new Date(savedStartTime).getTime()) / 1000;
          sessionStorage.setItem('duration', duration.toString());
          sessionStorage.removeItem('startTime');
        }
      } catch (error) {
        console.error('Failed to calculate or store duration:', error);
      }
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  if (!game) {
    return (
      <div className="h-screen w-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white flex flex-col">
      <header className="bg-black/50 backdrop-blur-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center flex-grow text-white">{game.title}</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={toggleFullscreen} className="text-white hover:bg-white/10">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      <main className="flex-grow relative p-4">
        <div className="absolute inset-4 bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl">
          <iframe
            ref={iframeRef}
            src={game.gameUrl}
            className="w-full h-full border-0 pointer-events-auto"
            allowFullScreen
            title={`Play ${game.title}`}
          />
        </div>
      </main>
      <footer className="bg-black/50 backdrop-blur-md p-4 text-center">
        <p className="text-sm text-gray-300">{game.description}</p>
        <p className="text-xs text-gray-400 mt-2">© 2024 CryptoGaming Hub. All rights reserved.</p>
      </footer>
    </div>
  )
}
