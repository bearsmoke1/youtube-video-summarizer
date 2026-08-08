import { Router } from 'express';
import { handleSummarize } from '../controllers/summaryController.js';

const router = Router();

// POST /api/summarize  { url, type }  ->  { summary, type, videoId } | { error }
router.post('/summarize', handleSummarize);

export default router;
