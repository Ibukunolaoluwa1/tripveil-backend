import express from "express";
import {
  createTracking,
  updateLocation,
  getTripLocation,
  getTrackingById,
  startTracking,
  stopTracking,
  getAllTracking,
} from "../controller/liveTrackingController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect, createTracking);

router.get("/", protect, getAllTracking);

router.get("/trip/:tripId", protect, getTripLocation);

router.get("/:id", protect, getTrackingById);

router.put("/update/:trackingId", protect, updateLocation);

router.patch("/start/:trackingId", protect, startTracking);

router.patch("/stop/:trackingId", protect, stopTracking);

export default router;
