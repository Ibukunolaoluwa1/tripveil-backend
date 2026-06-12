import express from 'express';
import protect from "../middleware/auth.js"
import { 
    createCheckin, 
    getAllCheckins 
} from '../controller/checkin.controller.js';

const router = express.Router();

// Route to create a new check-in
router.post('/', protect, createCheckin);

// Route to get all check-ins
router.get('/', protect, getAllCheckins);

// Health check route matching the team's setup
router.get('/', (req, res) => {
    res.json({
        message: 'Check-in route working'
    });
});

export default router;