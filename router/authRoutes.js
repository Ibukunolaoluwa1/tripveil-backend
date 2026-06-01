import express from 'express';

import {
    registerUser,
    loginUser
} from '../controller/authController.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/',(req, res) => {
    res.json({
        message: 'Auth route working'
    });
});


export default router;