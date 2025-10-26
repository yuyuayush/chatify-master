import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import "./workers/emailWorker.js";
import "./workers/smsWorker.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";
import { sendSMS } from "./config/twillo.js";
import router from "./routes/index.js";
import Movie from "./models/Movie.js";
import { esClient } from "./config/elastic.js";
import webhookRoute from "./routes/webhook.route.js";
import('./config/redis.js')




const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;
app.use("/api/webhook", webhookRoute);

app.use(express.json({ limit: "5mb" })); // req.body
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use("/api", router);
app.get("/sync", async (req, res) => {
  const movies = await Movie.find();
  const body = movies.flatMap(doc => [{ index: { _index: "movies" } }, { title: doc.title, year: doc.year, genre: doc.genre }])
  await esClient.bulk({
    refresh: true,
    body
  });
  res.json({ message: "Synced successfully!" })
})


// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
  
}
server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
