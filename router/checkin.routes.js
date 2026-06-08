import express from 'express';
import { 
    createCheckin, 
    getAllCheckins 
} from '../controller/checkin.controller.js';

const router = express.Router();

// Route to create a new check-in
router.post('/create', createCheckin);

// Route to get all check-ins
router.get('/all', getAllCheckins);

// Health check route matching the team's setup
router.get('/', (req, res) => {
    res.json({
        message: 'Check-in route working'
    });
});

export default router;