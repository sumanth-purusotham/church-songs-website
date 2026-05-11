import { Router } from 'express';
import {
  deleteSong,
  getSongById,
  getSongs,
  updateSong,
  uploadSong
} from '../controllers/songController';
import { requireAuth } from '../middleware/auth';
import { songsReadLimiter, songsWriteLimiter } from '../middleware/rateLimit';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', songsReadLimiter, getSongs);
router.get('/:id', songsReadLimiter, getSongById);
router.post('/upload', songsWriteLimiter, requireAuth, upload.single('file'), uploadSong);
router.put('/:id', songsWriteLimiter, requireAuth, updateSong);
router.delete('/:id', songsWriteLimiter, requireAuth, deleteSong);

export default router;
