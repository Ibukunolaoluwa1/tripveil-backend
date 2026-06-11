import ratingModel from '../model/ratingModel.js';
import Trip from '../model/trip.js';

export const createRating = async (req, res) => {
    try {
        const { star, review } = req.body;
        const { tripId } = req.params;

        const userId = req.user.id;

        const getTrip = await Trip.findById(tripId);

        if (!getTrip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        const rating = await ratingModel.create({
            star,
            review,
            trip: getTrip._id,
            user: userId
        });

        return res
            .status(201)
            .json({ message: "Rating created successfully", rating });
    } catch (error) {
        // MongoDB error check for duplicate user rating on the same trip
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already rated this trip"
            });
        }

        return res.status(500).json({ message: "Error creating rating", error });
    }
};

export const getAllRatings = async (req, res) => {
    try {
        const ratings = await ratingModel.find();

        return res.status(200).json({ message: "Ratings fetched successfully", ratings });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching ratings", error });
    }
};

export const getRatingById = async (req, res) => {
    try {
        const { id } = req.params;
        const rating = await ratingModel.findById(id);

        if (!rating) {
            return res.status(404).json({ message: "Rating not found" });
        } 
        return res
            .status(200)
            .json({ message: "Rating fetched successfully", rating });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching rating", error });
    }
};