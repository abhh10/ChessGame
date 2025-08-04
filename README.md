
# ♟️ Multiplayer Chess Game

A real-time multiplayer chess application built using **Node.js**, **Socket.IO**, **chess.js**, and **HTML/CSS (with Tailwind)**.  
Players can join a shared game session, receive roles (White or Black), make valid moves, and play from opposite sides with automatic turn enforcement and board flipping.

---

## 🌐 Live Demo

🔗 **Render Link**: [https://chessgame-wbe0.onrender.com]


---

## 🚀 Features

- Real-time play using **Socket.IO**
- Automatic role assignment (**White/Black**)
- Chess rules enforcement with **chess.js**
- **Drag-and-drop** interface for moves
- **Turn validation** — only one player can move at a time
- Automatic **board flip** for Black
- Game end detection (**checkmate/draw** alerts)
- Clean UI with **TailwindCSS** styling

---

## ⚙️ Requirements

- **Node.js v14+**
- **npm**

---

## 🔧 Setup & Run Locally

1️⃣ **Clone the repository**

```bash
git clone https://github.com/your-username/multiplayer-chess.git
cd multiplayer-chess
````

2️⃣ **Install Dependencies**

```bash
npm install
```

3️⃣ **Start the Server**

```bash
npm run dev
```

4️⃣ **Play the Game**

Open your browser and go to:
👉 [http://localhost:3000](http://localhost:3000)

Open the same URL in another tab or device to test multiplayer!

---

## 🧠 How It Works

* The server uses **Socket.IO** to manage multiplayer sessions.
* The backend uses **chess.js** to validate move legality and enforce turns.
* The frontend dynamically renders the board and pieces.
* When a player is assigned the **Black** role, the entire board (and their pieces) are flipped for correct perspective.

---

## 🛠 Available Scripts

These scripts can help in development and testing:

```bash
npm install     # Install dependencies
node app.js     # Starts the server at http://localhost:3000
```

---

## 🧩 Features to Add Next

* ♻️ Restart/rematch functionality
* 💬 In-game player chat
* 📜 PGN/FEN move history viewing
* ⏱️ Player timers with countdown clocks
* 🔀 Random matchmaking & lobbies
* 🖼️ Board themes & custom piece styles

---

## ✍️ Author

**Made by Abhiraj**

```





