"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface VideoPlayerProps {
  videoId: string
}

// Declare YT as a global variable to satisfy TypeScript
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Initialize player when API is ready
    const onYouTubeIframeAPIReady = () => {
      if (!playerRef.current) return

      // @ts-ignore - YouTube API is loaded dynamically
      new window.YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            // Player is ready
            console.log("Player ready")
          },
          onStateChange: (event) => {
            // Handle state changes
            // In a real app, you would sync this with other participants
            console.log("Player state changed", event.data)
          },
        },
      })
    }

    // @ts-ignore - YouTube API is loaded dynamically
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady()
    } else {
      // @ts-ignore - YouTube API is loaded dynamically
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
    }

    return () => {
      // Cleanup
      // @ts-ignore - YouTube API is loaded dynamically
      window.onYouTubeIframeAPIReady = null
    }
  }, [videoId])

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-black">
        <div ref={playerRef} className="w-full h-full" />
      </div>
    </Card>
  )
}

