import express from 'express';
import {
    triggerSOS,
    resolveSOS,
    cancelSOS,
    getSOSHistory,
    getSOSById
} from '../controller/sosController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/trigger', triggerSOS);
router.get('/history', getSOSHistory);
router.get('/:sosId', getSOSById);
router.patch('/:sosId/resolve', resolveSOS);
router.patch('/:sosId/cancel', cancelSOS);

export default router;