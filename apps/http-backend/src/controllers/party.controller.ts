import { Request, Response } from "express";
import {  prisma } from "@repo/db/client";
import { createPartySchema } from "@repo/types/types";

export const createParty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hostId = req.userId!;

    const parsedBody = createPartySchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({
        message: "Invalid Inputs",
      });
      return;
    }

    const { slug, videoUrl } = parsedBody.data;

    const party = await prisma.party.create({
      data: {
        slug,
        videoUrl,
        hostId,
      },
    });

    res.status(201).json({
      message: "Party Successfully Created",
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const fetchPartyDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partyId = req.params.partyId;

    if (!partyId) {
      res.status(400).json({
        message: "Party Id not found!",
      });
      return;
    }

    const party = await prisma.party.findFirst({
      where: {
        id: partyId,
      },
    });

    res.status(200).json(party);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteParty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partyId = req.params.partyId;
    const hostId = req.userId!;

    if (!partyId) {
      res.status(400).json({
        message: "Party Id not found!",
      });
      return;
    }

    const party = await prisma.party.findFirst({
      where: {
        id: partyId,
      },
    });

    if (!party) {
      res.status(400).json({
        message: "Party Not found!",
      });
      return;
    }

    if (party.hostId !== hostId) {
      res.status(403).json({
        message: "You are not authorized to delete this party",
      });
      return;
    }

    await prisma.party.delete({
      where: {
        id: partyId,
        hostId,
      },
    });

    res.status(200).json({
      message: "Party Successfully Deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const changeTimestamp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partyId = req.params.partyId;
    const hostId = req.userId!;
    const newTimestamp = req.body.newTimestamp;

    if (!partyId) {
      res.status(400).json({
        message: "Party Id not found!",
      });
      return;
    }

    const party = await prisma.party.findFirst({
      where: {
        id: partyId,
      },
    });

    if (!party) {
      res.status(400).json({
        message: "Party Not found!",
      });
      return;
    }

    if (party.hostId !== hostId) {
      res.status(403).json({
        message: "You are not authorized to change timestamp",
      });
      return;
    }

    await prisma.party.update({
      where: {
        id: partyId,
      },
      data : {
        currentTimestamp : Number(newTimestamp)
      }
    });

    res.status(200).json({
      message: "Timestamp successfully updated!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
