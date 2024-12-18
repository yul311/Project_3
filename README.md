# OneCanvas2Draw

**OneCanvas2Draw** is a web-based collaborative drawing game designed for players to work together on a shared canvas. Players collaborate in real-time to create drawings based on given prompts and compete for the highest ratings. This project explores full-stack development with a focus on real-time communication using WebSocket and RESTful APIs.

## Features

- **Collaborative Drawing**: Players draw on two separate halves of a shared canvas in real-time.
- **Game Rooms**: Players can create or join unique game lobbies with randomly generated IDs.
- **Custom Prompts and Settings**: Lobby creators can set game prompts and configure game settings.
- **Chat Box**: Real-time messaging between players during gameplay.
- **Rating System**: Players rate completed drawings at the end of the game.
- **Leaderboard**: Displays the top players with the highest scores.
- **Download Drawings**: Players can save their favorite collaborative artworks.

## Technologies Used

### Frontend

- **HTML5 Canvas**: For drawing and rendering the collaborative canvas.
- **React**: For building the user interface.
- **JavaScript**: For interactivity and client-side logic.

### Backend

- **Node.js**: Backend server for handling requests and managing game logic.
- **Socket.io**: For real-time, bi-directional communication between clients and the server.
- **RESTful API**: For HTTP-based communication and server interaction.

### Potential Features

- **Database**: (Planned) Redis/MongoDB for storing drawings and game data for persistence.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yul311/Project_3
   cd Project_3
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Start backend server

   ```
   node server.js
   ```

4. Start React app

   ```
   cd client
   npm start
   ```
