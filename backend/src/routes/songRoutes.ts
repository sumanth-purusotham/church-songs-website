import { Router } from 'express';
import {
  deleteSong,
  getSongById,
  getSongs,
  updateSong,
  uploadSong
} from '../controllers/songController';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getSongs);
router.get('/:id', getSongById);
router.post('/upload', requireAuth, upload.single('file'), uploadSong);
router.put('/:id', requireAuth, updateSong);
router.delete('/:id', requireAuth, deleteSong);

export default router;
