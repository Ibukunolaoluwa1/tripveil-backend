import cron from "node-cron";
import Trip from "../model/trip.js";
import SOS from "../model/sos.js";

// runs every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();

    const overdueTrips = await Trip.find({
      status: "active",
      nextCheckInDue: { $lt: now }
    });

    for (const trip of overdueTrips) {

      const existingSOS = await SOS.findOne({
        user: trip.user,
        trip: trip._id,
        status: "active"
      });

      if (!existingSOS) {
        await SOS.create({
          user: trip.user,
          trip: trip._id,
          location: {
            latitude: 0,
            longitude: 0,
            address: "Auto SOS - Missed Check-in"
          },
          message: "User missed scheduled check-in!",
          status: "active"
        });

        console.log(`🚨 SOS triggered for missed check-in: ${trip._id}`);
      }
    }

  } catch (error) {
    console.error("Check-in scheduler error:", error.message);
  }
});