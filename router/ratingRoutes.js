import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createRating,
    getAllRatings,
    getRatingById
} from '../controller/ratingController.js';

const router = express.Router();

router.post('/:tripId', protect, createRating);
router.get('/', protect, getAllRatings);
router.get('/:id', protect, getRatingById);

export default router;