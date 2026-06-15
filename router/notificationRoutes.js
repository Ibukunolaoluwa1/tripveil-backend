import express from "express";
import protect from "../middleware/auth.js";
import { saveDeviceToken } from "../controller/notificationController.js";

const router = express.Router();

router.post("/register-token", protect, saveDeviceToken);

export default router;