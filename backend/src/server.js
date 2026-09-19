// Express entry point.
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import summarizeRouter from './routes/summarize.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check — confirms the backend is up.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes: POST /api/summarize
app.use('/api', summarizeRouter);

// Production: the built web UI is copied to ./public and served from here, so the whole
// app answers on one origin. In development this folder is absent and Vite serves the UI.
const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  // Anything that isn't an API call falls back to index.html (single-page app).
  app.get(/^\/(?!api|health).*/, (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.listen(config.port, () => {
  console.log(`[backend] listening on http://localhost:${config.port}`);
});
