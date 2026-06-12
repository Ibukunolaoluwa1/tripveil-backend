import LiveTracking from "../model/liveTrackingModel.js";
import Trip from "../model/trip.js";

export const createTracking = async (req, res) => {
  try {
    const { tripId, latitude, longitude, accuracy } = req.body;

    console.log(req.body)
    console.log(longitude)

    const trip = await
    Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found"});
    }

    const tracking = await
    LiveTracking.create({
      user: req.user.id,
      trip: tripId,
      latitude,
      longitude,
      accuracy,
      isActive: true,
      lastUpdate: new Date(),
    });

    res.status(201).json({
      message: "Tracking created successfully",
      tracking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message})
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
    tracking.lastUpdated = new Date();

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
      trip: tripId, })
      .sort({ lastUpdate: -1});

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "No tracking data found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Latest trip location fetched",
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
       const tracking = await LiveTracking.findById(req.params.id)
      .populate("user", "name email")
      .populate("trip");

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

    const tracking = await LiveTracking.findById(
      trackingId,)

      if (!tracking) {
        return
        res.status(404).json({ message: "Tracking not found"});
      }

      tracking.isActive = true;
      tracking.lastUpdate = new Date();

      await tracking.save();

      res.status(200).json({
        message: "Tracking started",
        tracking,
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

    const tracking = await LiveTracking.findById(
      trackingId);

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Tracking record not found",
      });
    }

    tracking.isActive = false;
    tracking.lastUpdate = new Date();

    await tracking.save();

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
      .populate("user", "name email")
      .populate("trip");

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
