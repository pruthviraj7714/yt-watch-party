"use client";

import { Card } from "@/components/ui/card";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { BACKEND_URL } from "../config/config";
import { toast } from "sonner";

interface VideoPlayerProps {
  videoId: string;
  hostId: string;
  partyId: string;
  currentTimestamp: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onTimeChange: (ts: number) => void;
}

export function VideoPlayer({
  videoId,
  hostId,
  partyId,
  currentTimestamp,
  isPlaying,
  onPause,
  onPlay,
  onTimeChange,
}: VideoPlayerProps) {
  const { data: session } = useSession();
  const isHost = session?.user?.id === hostId;
  const playerRef = useRef<any>(null);
  const lastSyncedTime = useRef<number>(currentTimestamp);
  const syncThreshold = 2; 
  const syncInterval = 5000; 

  const onPlayerReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    playerRef.current.seekTo(currentTimestamp, true);
    
    if (isPlaying && playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    const playerState = event.data; // 1 = Playing, 2 = Paused
    
    if (!playerRef.current) return;

    if (isHost) {
      if (playerState === 1 && !isPlaying) {
        onPlay();
        onTimeChange(Math.floor(playerRef.current.getCurrentTime()));
      } else if (playerState === 2 && isPlaying) {
        onPause();
        onTimeChange(Math.floor(playerRef.current.getCurrentTime()));
      }
    } else {
      const currentPlayerTime = playerRef.current.getCurrentTime();
      
      if (playerState === 1 && !isPlaying) {
        playerRef.current.pauseVideo();
      } else if (playerState === 2 && isPlaying) {
        playerRef.current.playVideo();
      }
      
      if (Math.abs(currentPlayerTime - currentTimestamp) > syncThreshold) {
        playerRef.current.seekTo(currentTimestamp, true);
      }
    }
  };

  useEffect(() => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.getCurrentTime();
    const timeDifference = Math.abs(currentTime - currentTimestamp);

    if (timeDifference > syncThreshold) {
      playerRef.current.seekTo(currentTimestamp, true);
      lastSyncedTime.current = currentTimestamp;
    }

    const playerState = playerRef.current.getPlayerState();
    if (isPlaying && playerState !== 1) {
      playerRef.current.playVideo();
    } else if (!isPlaying && playerState !== 2) {
      playerRef.current.pauseVideo();
    }
  }, [currentTimestamp, isPlaying]);

  useEffect(() => {
    if (!isHost || !playerRef.current) return;

    const interval = setInterval(async () => {
      try {
        if (!playerRef.current) return;
        
        const currentTime = Math.floor(playerRef.current.getCurrentTime());
        
        if (Math.abs(currentTime - lastSyncedTime.current) > 1) {
          await axios.post(
            `${BACKEND_URL}/party/${partyId}/update-timestamp`,
            { newTimestamp: currentTime },
            {
              headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
              },
            }
          );
          lastSyncedTime.current = currentTime;
          onTimeChange(currentTime);
        }
      } catch (error: any) {
        console.error("Failed to update timestamp:", error);
        toast.error(
          error.response?.data?.message || "Failed to update timestamp"
        );
      }
    }, syncInterval);

    return () => clearInterval(interval);
  }, [isHost, partyId]);

  const opts = {
    playerVars: {
      autoplay: 0,
      controls: isHost ? 1 : 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      fs: isHost ? 1 : 0,
    },
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-black">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      </div>
    </Card>
  );
}