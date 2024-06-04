import express from "express";
import dotenv from "dotenv";
import socket from "socket.io";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
const app = express();
let server = http.createServer(app);
let io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
dotenv.config();

let port = process.env.PORT_SERVER;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("Hello");
});
io.on("connection", (socket) => {
  console.log(`User connected with socket id: ${socket.id}`);
  let id = socket.id;
  io.emit("id", id);
  socket.on("send", (data) => {
    console.log(data);
    io.emit("send", { data: data, id: id });
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected with socket id: ${socket.id}`);
  });
});
server.listen(port, (err) => {
  console.log("App is running on port", port);
});
