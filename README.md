# The Web-Based Maze Game

**The Web-Based Maze Game** is a simple, online game where you are trapped in a twisting maze, and your only hope is to move fast! Beware—the Chaser is always one step behind, so plan your moves carefully and escape before it catches up!

## 🚀 Features

- **Engaging Gameplay**: Navigate through complex mazes while avoiding the relentless Chaser.
- **Phaser 3**: Utilizes the Phaser 3 framework, leveraging its physics arcade engine for gravity and collision detection.
- **Player Data**: Track progress, login, and view player stats.

## 🛠️ Technologies Used

- **Frontend**: Phaser 3 (JavaScript game framework with physics capabilities)
- **Backend**: Flask (Python web framework for the API and server-side logic)

## 📋 API Endpoints

- **POST** `/api/register`: Register a new player.
- **POST** `/api/login`: Authenticate and login the player.
- **GET** `/api/top_players`: Fetch the top 5 players.
- **POST** `/api/players_data/<username>`: Submit player progress and data.
- **GET** `/api/players_data/<username>`: Retrieve player progress and data.

## 🏆 Leaderboard

Compete with other players and try to make it to the top 5!

## 🌐 Live Demo

Play the game here: [The Web-Based Maze Game](http://webmaze.karoury.tech/)

## 📖 How to Play

1. Use the arrow keys to move through the maze.
2. Avoid the Chaser—it's always one step behind!

Plan your moves carefully or risk getting caught!

---

### 📄 License

This project is open-source and available under the [MIT License](./LICENSE).