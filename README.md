# AI Flow - MERN App

A full-stack MERN application where users type a prompt into a React Flow node, click **Run Flow**, and see the AI-generated response in a connected result node. Conversations can be saved to MongoDB.

## Tech Stack

- **Frontend:** React (Vite) + React Flow (`@xyflow/react`)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **AI:** OpenRouter API (free Gemini model)

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- OpenRouter API key ([get one here](https://openrouter.ai/keys))

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd chat-project
```

### 2. Set up the backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your credentials:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
CLIENT_ORIGIN=http://localhost:5173
```

Install dependencies and start the server:

```bash
npm install
npm run dev
```

The server runs on `http://localhost:5000`.

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

## Usage

1. Type a question or prompt into the **Prompt** node.
2. Click **Run Flow** — the edge animates while the AI processes your request.
3. The response appears in the **AI Response** node.
4. Click **Save** to persist the prompt and response to MongoDB.

## Project Structure

```
chat-project/
├── client/                     # React frontend
│   └── src/
│       ├── components/         # UI components (FlowCanvas, nodes, Toolbar)
│       ├── hooks/              # Custom hooks (useAskAi, useSaveConversation, useFlowRunner)
│       ├── services/           # API client (axios)
│       └── constants/          # React Flow defaults (nodes, edges, types)
├── server/                     # Express backend
│   └── src/
│       ├── config/             # DB connection, env validation
│       ├── controllers/        # Request handlers
│       ├── middleware/         # Error handler
│       ├── models/             # Mongoose schemas
│       ├── routes/             # Express routes
│       └── services/           # OpenRouter API integration
└── README.md
```

## API Endpoints

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| POST   | `/api/ask-ai`        | Send a prompt, receive AI response   |
| POST   | `/api/conversations` | Save a prompt/response to MongoDB    |
| GET    | `/api/health`        | Health check                         |

## Environment Variables

### Server (`server/.env`)

| Variable            | Required | Description                      |
| ------------------- | -------- | -------------------------------- |
| `PORT`              | No       | Server port (default: 5000)      |
| `MONGODB_URI`       | Yes      | MongoDB connection string        |
| `OPENROUTER_API_KEY`| Yes      | OpenRouter API key               |
| `CLIENT_ORIGIN`     | No       | CORS origin (default: localhost) |

### Client (`client/.env`)

| Variable            | Required | Description                              |
| ------------------- | -------- | ---------------------------------------- |
| `VITE_API_BASE_URL` | No       | Backend URL (empty for dev proxy)        |
