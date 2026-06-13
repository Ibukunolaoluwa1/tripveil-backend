import express from "express";
import protect from "../middleware/auth.js";

import {
    saveDeviceToken,
    sendNotification,
} from "../controller/notificationController.js";

const router = express.Router();

router.post("/register-token", protect, saveDeviceToken);

router.post("/send", protect, sendNotification);

export default router;