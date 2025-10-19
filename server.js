const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.post("/update", (req, res) => {
  const { id, name, number, lat, lon } = req.body;
  if (!id || !lat || !lon) return res.sendStatus(400);
  io.emit("location", { id, name, number, lat, lon });
  res.sendStatus(200);
});

server.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port " + (process.env.PORT || 3000))
);
