import express from "express";
import cors from "cors";
import { partyRouter } from "./routes/party.route";
import { userRouter } from "./routes/user.route";
import { videoRouter } from "./routes/video.route";
import { config } from "dotenv";
config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send("Healthy server");
  return;
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/party', partyRouter);
app.use('/api/v1/video', videoRouter);

app.listen(3001, () => {
  console.log("Server is Listening on PORT 3001");
});
