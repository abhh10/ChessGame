const express = require('express');
const app = express(); 
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');
const { title } = require('process');


const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = 'W';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render("index" , {title: "Chess Game"});
});

io.on("connection", (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on("join", (color) => {
    players[socket.id] = color;
    socket.join(color);
    currentPlayer = color === 'W' ? 'B' : 'W';
  });

  socket.on("move", (move) => {
    if (players[socket.id] === currentPlayer) {
      const result = chess.move(move);
      if (result) {
        io.emit("move", result);
        currentPlayer = currentPlayer === 'W' ? 'B' : 'W';
      }
    }
  });

  socket.on("disconnect", () => {
    console.log('User disconnected: ' + socket.id);
    delete players[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});