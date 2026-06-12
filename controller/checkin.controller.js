import Checkin from '../model/checkin.model.js';

export const createCheckin = async (req, res) => {
    try {
        const { user = req.user.id, location, status } = req.body;

        const newCheckin = await Checkin.create({
            user: req.user.id, // middleware
            location,
            status
        });

        return res.status(201).json({
            message: 'Check-in successful',
            checkin: newCheckin
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const getAllCheckins = async (req, res) => {
    try {
        const checkins = await Checkin.find().populate('user', 'firstName email');
        
        return res.status(200).json({
            message: 'Check-ins retrieved successfully',
            checkins
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};