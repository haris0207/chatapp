# ChatApp — Real-Time Chat

A simple real-time chat application built with **Next.js** (frontend) and **NestJS WebSocket** (backend).

## Features

- Single public chatroom
- Username-only entry (no auth)
- Real-time messaging via WebSocket
- In-memory message storage
- Works across multiple browser tabs
- Dark theme with glassmorphism design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, TypeScript, CSS Modules |
| Backend | NestJS, Socket.IO, TypeScript |
| Hosting | Vercel (frontend) + Render (backend) |

## Local Development

```bash
# Terminal 1 — Backend (port 3001)
cd server && npm install && npm run start:dev

# Terminal 2 — Frontend (port 3000)
cd client && npm install && npm run dev
```

Open `http://localhost:3000` in multiple tabs.

## Deployment

- **Frontend** → Vercel (auto-deploys from `client/` directory)
- **Backend** → Render (auto-deploys from `server/` directory)

Set `NEXT_PUBLIC_SOCKET_URL` environment variable in Vercel to your Render backend URL.
