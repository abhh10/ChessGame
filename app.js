const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const chess = new Chess();
const players = [];

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render("index", { title: "Chess Game" });
});

io.on('connection', (socket) => {
  console.log("New client connected:", socket.id);

  // Assign role: 'W' to first, then 'B'
  if (players.length < 2) {
    const role = players.length === 0 ? 'W' : 'B';
    players.push({ id: socket.id, role });
    socket.emit("assignRole", role);
    console.log(`Assigned role ${role} to ${socket.id}`);
  } else {
    socket.emit("assignRole", null);
    return;
  }

  // Handle move from client
  socket.on("move", (move) => {
    const player = players.find(p => p.id === socket.id);
    if (!player) return;

    const expectedTurn = chess.turn() === 'w' ? 'W' : 'B';

    if (player.role !== expectedTurn) {
      socket.emit("invalidMove", "Not your turn");
      return;
    }

    const result = chess.move(move);

    if (result) {
      io.emit("move", move); // send to all clients
    } else {
      socket.emit("invalidMove", "Illegal move");
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const index = players.findIndex(p => p.id === socket.id);
    if (index !== -1) {
      players.splice(index, 1);
    }
  });
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
