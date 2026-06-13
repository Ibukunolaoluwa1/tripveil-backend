import express from "express";
import { checkIn } from "../controller/checkin.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// User checks in
router.post("/:tripId/checkin", checkIn);

export default router;