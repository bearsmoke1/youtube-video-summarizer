// Express entry point.
import express from 'express';
import cors from 'cors';
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

app.listen(config.port, () => {
  console.log(`[backend] listening on http://localhost:${config.port}`);
});
