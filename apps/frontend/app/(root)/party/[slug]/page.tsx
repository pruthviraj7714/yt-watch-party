
import Link from "next/link"
import { ArrowLeft, MessageSquare, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatPanel } from "../../../../components/chat-panel"
import { VideoPlayer } from "../../../../components/video-player"
import { prismaClient } from "@repo/db/client"

const fetchPartyData = async (partySlug : string) => {
  try {
    const party = await prismaClient.party.findFirst({
      where : {
        slug : partySlug
      },
      include : {
        participants : true
      }
    })
    return party;
  } catch (error : any) {
    throw new Error(error.message);
  }
}

export default async function PartyPage({params} : {
  params : Promise<{slug : string}>
}) {
  const slug = decodeURIComponent((await params).slug);
  const party = await fetchPartyData(slug);

  if (!party) {
    return (
      <div className="py-10">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Party Not Found</h2>
          <p className="text-muted-foreground mt-2">The watch party you're looking for doesn't exist.</p>
          <Link href="/home" className="mt-6 inline-block">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const videoId = party.videoUrl.split("v=")[1]?.split("&")[0] || ""

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to home</span>
          </Link>
          <h1 className="text-2xl font-bold">{party.slug}</h1>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{party.participants.length} watching</span>
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
                Participants ({party.participants.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="mt-4">
              <ChatPanel partyId={party.id} />
            </TabsContent>
            <TabsContent value="participants" className="mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  {Array.from({ length: party.participants.length }).map((_, i) => (
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

