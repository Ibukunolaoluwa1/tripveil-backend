import Trip from "../model/trip.js";

// CREATE TRIP
export const createTrip = async (req, res) => {
    try {
        const { destination, startDate, endDate } = req.body;

        const trip = await Trip.create({
            user: req.user.id, // from middleware
            destination,
            startDate,
            endDate
        });

        res.status(201).json({
            message: "Trip created successfully",
            trip
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
//GET ALL USER TRIPS
export const getUserTrips = async (req, res) => {
     try {
        const trips = await 
        Trip.find({ user: req.user.id });

        res.status(200).json(trips);
     } catch (error) {
        res.status(500).json({
            message: error.message
        });
     }
};