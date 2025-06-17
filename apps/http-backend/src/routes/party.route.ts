import { Router } from "express";
import { changeTimestamp, createParty, deleteParty, fetchPartyDetails } from "../controllers/party.controller";
import { userMiddleware } from "../middlewares/user.middleware";

export const partyRouter : Router = Router();

partyRouter.get('/:partyId', userMiddleware, fetchPartyDetails);
partyRouter.post('/create', userMiddleware, createParty);
partyRouter.delete('/delete/:partyId', userMiddleware, deleteParty);
partyRouter.delete('/:partyId/update-timestamp', userMiddleware, changeTimestamp);

