import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middleware";
import { createParty, deleteParty, fetchPartyDetails } from "../controllers/party.controller";

export const partyRouter : Router = Router();

partyRouter.get('/:partyId', userMiddleware, fetchPartyDetails);
partyRouter.post('/create', userMiddleware, createParty);
partyRouter.delete('delete/:partyId', userMiddleware, deleteParty);
