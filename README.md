# Church Songs Website

A full-stack platform to upload, manage, search, and download church devotional songs stored as PowerPoint files.

## Tech Stack

- Frontend: React 18 + TypeScript + Tailwind CSS + Vite
- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- Auth: JWT
- File upload: Multer

## Project Structure

- `frontend/` React application
- `backend/` Express API and MongoDB models

## Backend API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/songs/upload`
- `GET /api/songs`
- `GET /api/songs/:id`
- `PUT /api/songs/:id`
- `DELETE /api/songs/:id`

## Run Locally

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Set `.env` values:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (optional, default `5000`)
- `CLIENT_URL` (optional, default `http://localhost:5173`)

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.
