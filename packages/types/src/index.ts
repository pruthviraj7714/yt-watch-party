import  { z } from "zod";

export const createPartySchema = z.object({
    slug : z.string().min(3, {message : "Slug should be at least of 3 characters"}),
    videoUrl : z.string().url({message : "The Url should be valid"}),
})