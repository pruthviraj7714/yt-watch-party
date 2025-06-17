import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { userRouter } from "./routes/user.route";
import { partyRouter } from "./routes/party.route";
import { videoRouter } from "./routes/video.route";
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
