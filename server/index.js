// npm init -y
// npm i express mongoose cors dotenv http      => cors is to connect front & back... for test coding?
// npm i socket.io
// npm i nodemon
// ADD "type": "module", INTO PACKAGE.JSON              => require doesnt work.... import works

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import io from "./utils/io.js";
import roomsRoute from "./routes/rooms.js"
import chatsRoute from "./routes/chats.js"

const app = express();
dotenv.config();


/** Socket Server created */
const httpServer = createServer(app);
const ioServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io(ioServer); // doing all the io functions.. 


const cnt = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to backend");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
  console.log("mongoDB connected!");
});

httpServer.listen(process.env.PORT, async () => {
  console.log(`server listening on ${process.env.PORT}`);
  await cnt();
});


app.use(express.json())
app.use(cors());
app.use("/api/v1/rooms", roomsRoute);
app.use("/api/v1/chats", chatsRoute);
