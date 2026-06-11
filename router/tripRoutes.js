import express from 'express';

import { createTrip, getUserTrips } from "../controller/tripController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTrip);
router.get("/", protect, getUserTrips);

export default router;