import Trip from "../model/trip.js";

export const checkIn = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (trip.status !== "active") {
      return res.status(400).json({ message: "Trip is not active" });
    }

    const now = new Date();

    trip.lastCheckIn = now;
    trip.nextCheckInDue = new Date(
      now.getTime() + trip.checkInInterval
    );

    await trip.save();

    res.status(200).json({
      message: "Check-in successful",
      lastCheckIn: trip.lastCheckIn,
      nextCheckInDue: trip.nextCheckInDue
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};