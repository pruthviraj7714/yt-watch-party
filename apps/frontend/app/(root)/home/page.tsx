import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { PartyCard } from "../../../components/party-card"

// Mock data for active parties - in a real app, this would come from a database
const parties = [
  {
    id: "1",
    slug: "react-conf-2023",
    title: "React Conf 2023",
    videoUrl: "https://www.youtube.com/watch?v=QvHf94hxzRc",
    participants: 12,
    createdAt: "2023-05-10T12:00:00Z",
  },
  {
    id: "2",
    slug: "nextjs-conf",
    title: "Next.js Conf Special",
    videoUrl: "https://www.youtube.com/watch?v=NiknNI_0J48",
    participants: 8,
    createdAt: "2023-05-11T14:30:00Z",
  },
  {
    id: "3",
    slug: "tailwind-tips",
    title: "Tailwind CSS Tips & Tricks",
    videoUrl: "https://www.youtube.com/watch?v=QBajvZaWLXs",
    participants: 5,
    createdAt: "2023-05-12T09:15:00Z",
  },
]

export default function Home() {
  return (
    <div className="py-10 space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">YouTube Watch Party</h1>
          <p className="text-muted-foreground mt-2">
            Join an existing watch party or create your own to watch YouTube videos with friends
          </p>
        </div>
        <Link href="/party/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Party
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parties.map((party) => (
          <PartyCard key={party.id} party={party} />
        ))}
      </div>

      {parties.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No active parties</h3>
          <p className="text-muted-foreground mt-1">Create a new party to get started</p>
          <Link href="/party/create" className="mt-4 inline-block">
            <Button>Create Your First Party</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

