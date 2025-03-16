import express from "express";
import cors from "cors";
import { prismaClient as prisma } from "@repo/db/client";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  await prisma.user.create({
    data: {
      githubId: Math.random().toString(),
      username: Math.random().toString(),
    },
  });

  const users = await prisma.user.findMany({});

  res.status(200).json({
    users,
  });
  return;
});

app.listen(3001, () => {
  console.log("Server is Listening on PORT 3001");
});
