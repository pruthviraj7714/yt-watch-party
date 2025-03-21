import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PartyCard } from "../../../components/party-card";
import { prismaClient as prisma } from "@repo/db/client";

const fetchParties = async () => {
  try {
    const parties = await prisma.party.findMany({
      include: {
        participants: true,
      },
    });

    return parties;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default async function Home() {
  const parties = await fetchParties();

  return (
    <div className="py-10 space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            YouTube Watch Party
          </h1>
          <p className="text-muted-foreground mt-2">
            Join an existing watch party or create your own to watch YouTube
            videos with friends
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
          <p className="text-muted-foreground mt-1">
            Create a new party to get started
          </p>
          <Link href="/party/create" className="mt-4 inline-block">
            <Button>Create Your First Party</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
