"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatPanel } from "../../../../components/chat-panel"
import { VideoPlayer } from "../../../../components/video-player"

const partiesData = {
  "react-conf-2023": {
    id: "1",
    slug: "react-conf-2023",
    title: "React Conf 2023",
    videoUrl: "https://www.youtube.com/watch?v=QvHf94hxzRc",
    participants: 12,
    createdAt: "2023-05-10T12:00:00Z",
  },
  "nextjs-conf": {
    id: "2",
    slug: "nextjs-conf",
    title: "Next.js Conf Special",
    videoUrl: "https://www.youtube.com/watch?v=NiknNI_0J48",
    participants: 8,
    createdAt: "2023-05-11T14:30:00Z",
  },
  "tailwind-tips": {
    id: "3",
    slug: "tailwind-tips",
    title: "Tailwind CSS Tips & Tricks",
    videoUrl: "https://www.youtube.com/watch?v=QBajvZaWLXs",
    participants: 5,
    createdAt: "2023-05-12T09:15:00Z",
  },
}

export default function PartyPage() {
  const params = useParams()
  const slug = params.slug as string
  const [party, setParty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching party data
    setTimeout(() => {
      const partyData = partiesData[slug as keyof typeof partiesData]
      setParty(partyData || null)
      setLoading(false)
    }, 500)
  }, [slug])

  if (loading) {
    return (
      <div className="py-10 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading party...</p>
        </div>
      </div>
    )
  }

  if (!party) {
    return (
      <div className="py-10">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Party Not Found</h2>
          <p className="text-muted-foreground mt-2">The watch party you're looking for doesn't exist.</p>
          <Link href="/" className="mt-6 inline-block">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Extract video ID from YouTube URL
  const videoId = party.videoUrl.split("v=")[1]?.split("&")[0] || ""

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to home</span>
          </Link>
          <h1 className="text-2xl font-bold">{party.title}</h1>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{party.participants} watching</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer videoId={videoId} />
        </div>

        <div className="lg:col-span-1">
          <Tabs defaultValue="chat">
            <TabsList className="w-full">
              <TabsTrigger value="chat" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                Participants ({party.participants})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="mt-4">
              <ChatPanel partyId={party.id} />
            </TabsContent>
            <TabsContent value="participants" className="mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  {/* Mock participants - in a real app, this would come from a database */}
                  {Array.from({ length: party.participants }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">U{i + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">User {i + 1}</p>
                        {i === 0 && <p className="text-xs text-muted-foreground">Host</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

