import { formatDistanceToNow } from "date-fns"
import { Users, Video } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Party {
  id: string
  slug: string
  title: string
  videoUrl: string
  participants: number
  createdAt: string
}

interface PartyCardProps {
  party: Party
}

export function PartyCard({ party }: PartyCardProps) {
  // Extract video ID from YouTube URL
  const videoId = party.videoUrl.split("v=")[1]?.split("&")[0] || ""
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`

  return (
    <Link href={`/party/${party.slug}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="aspect-video relative overflow-hidden bg-muted">
          {thumbnailUrl ? (
            <img src={thumbnailUrl || "/placeholder.svg"} alt={party.title} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              <Video className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/70">
            <Users className="h-3 w-3 mr-1" />
            {party.participants}
          </Badge>
        </div>
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{party.title}</h3>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-1">youtube.com/watch?v={videoId}</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(party.createdAt))} ago
        </CardFooter>
      </Card>
    </Link>
  )
}

