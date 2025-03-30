import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prismaClient } from "@repo/db/client";
import PartyPageComponent from "../../../../components/PartyPage";

const fetchPartyData = async (partySlug: string) => {
  try {
    const party = await prismaClient.party.findFirst({
      where: {
        slug: partySlug,
      },
      include: {
        participants: {
          include : {
            participant : {
              select : {
                username : true,
                image : true
              }
            }
          }
        },
        chats : {
          include : {
            user : {
              select : {
                username : true,
                image : true
              }
            }
          }
        },
      },
    });
    return party;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default async function PartyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = decodeURIComponent((await params).slug);
  const party = await fetchPartyData(slug);

  if (!party) {
    return (
      <div className="py-10">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Party Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The watch party you're looking for doesn't exist.
          </p>
          <Link href="/home" className="mt-6 inline-block">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const videoId = party.videoUrl.split("v=")[1]?.split("&")[0] || "";

  return (
    <div>
      <PartyPageComponent party={party} videoId={videoId} />
    </div>
  );
}
