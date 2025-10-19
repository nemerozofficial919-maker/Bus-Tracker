const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const app = express();
app.use(express.json());

// Serve HTML files
app.get("/device.html", (req, res) => res.sendFile(path.join(__dirname, "device.html")));
app.get("/viewer.html", (req, res) => res.sendFile(path.join(__dirname, "viewer.html")));

// Use dynamic port from Render or default to 3000 for local testing
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

// Receive GPS updates from bus phone
app.post("/update", (req, res) => {
  const { id, lat, lon, ts } = req.body;
  io.emit("location", { id, lat, lon, ts });
  res.sendStatus(200);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
