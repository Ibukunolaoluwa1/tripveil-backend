import express from 'express';

import tripRoutes from './router/tripRoutes.js'

application.use('/api/trips', tripRoutes);

const router = express.Router();

router.get('/', (req, res) =>{
    res.json({
        message: 'Trips route working'
    });
});

export default router;