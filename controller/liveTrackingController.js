import LiveTracking from "../model/liveTrackingModel.js";
import User from "../model/user.js";
import Trip from "../model/trip.js";

export const createTracking = async (req, res) => {
  try {
    const { userId, tripId, latitude, longitude, accuracy } = req.body;

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if trip exists
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // Prevent duplicate tracking records
    const existingTracking = await LiveTracking.findOne({
      userId,
      tripId,
    });

    if (existingTracking) {
      return res.status(400).json({
        success: false,
        message: "Tracking already exists for this trip",
      });
    }

    //create tracking
    const tracking = await LiveTracking.create({
      userId,
      tripId,
      latitude,
      longitude,
      accuracy,
    });

    res.status(201).json({
      success: true,
      message: "Tracking created successfully",
      data: tracking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// for current location
export const updateLocation = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const { latitude, longitude, accuracy } = req.body;

    const tracking = await LiveTracking.findById(trackingId);

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Tracking record not found",
      });
    }

    tracking.latitude = latitude;
    tracking.longitude = longitude;
    tracking.accuracy = accuracy;
    tracking.lastUpdated = Date.now();

    await tracking.save();

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: tracking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get tracking by trip
export const getTripLocation = async (req, res) => {
  try {
    const { tripId } = req.params;

    const tracking = await LiveTracking.findOne({
      tripId,
    })
      .populate("userId")
      .populate("tripId");

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tracking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get tracking by ID

export const getTrackingById = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const tracking = await LiveTracking.findById(trackingId)
      .populate("userId")
      .populate("tripId");

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Tracking record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tracking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Start tracking

export const startTracking = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const tracking = await LiveTracking.findByIdAndUpdate(
      trackingId,
      {
        isActive: true,
        lastUpdated: Date.now(),
      },
      {
        new: true,
      },
    );

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Tracking record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tracking started",
      data: tracking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stop tracking

export const stopTracking = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const tracking = await LiveTracking.findByIdAndUpdate(
      trackingId,
      {
        isActive: false,
        lastUpdated: Date.now(),
      },
      {
        new: true,
      },
    );

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Tracking record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tracking stopped",
      data: tracking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all tracking records

export const getAllTracking = async (req, res) => {
  try {
    const tracking = await LiveTracking.find()
      .populate("userId")
      .populate("tripId");

    res.status(200).json({
      success: true,
      count: tracking.length,
      data: tracking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
