# YouTube Video Summarizer

A simple web app that summarizes YouTube videos using AI. Paste a video link, choose a
**short** or **detailed** summary, and get the key points in seconds.

**Stack:** React (Vite), Node.js + Express, DeepSeek API, Docker.

## Run locally

```bash
cp .env.example .env      # add your DeepSeek API key
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend health check: http://localhost:4000/health
