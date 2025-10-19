const fs = require("fs");
const https = require("https");
const express = require("express");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
app.use(express.json());

// Serve HTML files
app.get("/device.html", (req, res) => res.sendFile(path.join(__dirname, "device.html")));
app.get("/viewer.html", (req, res) => res.sendFile(path.join(__dirname, "viewer.html")));

// Use mkcert certs (same folder)
const server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, "192.168.1.6+1-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "192.168.1.6+1.pem"))
}, app);

const io = new Server(server, { cors: { origin: "*" } });

// Receive GPS updates from bus phone
app.post("/update", (req, res) => {
  const { id, lat, lon, ts } = req.body;
  io.emit("location", { id, lat, lon, ts });
  res.sendStatus(200);
});

// Instead of hardcoding 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`HTTPS server running on port ${PORT}`));

