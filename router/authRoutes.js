import express from 'express';

import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    changePassword
} from '../controller/authController.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.put("/change-password", changePassword);

router.get('/',(req, res) => {
    res.json({
        message: 'Auth route working'
    });
});


export default router;