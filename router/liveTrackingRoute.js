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

const router = express.Router();

router.post("/", createTracking);

router.get("/", getAllTracking);

router.get("/trip/:tripId", getTripLocation);

router.get("/:trackingId", getTrackingById);

router.put("/:trackingId/location", updateLocation);

router.patch("/:trackingId/start", startTracking);

router.patch("/:trackingId/stop", stopTracking);

export default router;
