import express from "express";
import {
    getMe,
    getAllUsers,
    updateUser,
    deleteUser
} from "../controller/userController.js";

import protect  from "../middleware/auth.js";

const router = express.Router();

// Get logged-in user's profile
router.get('/me', protect, getMe);

//Get all users
router.get("/users", protect, getAllUsers);

//Update logged-in user's profile
router.put("/update", protect, updateUser);

//Delete logged-in user's account
router.delete("/delete", protect, deleteUser);

export default router;