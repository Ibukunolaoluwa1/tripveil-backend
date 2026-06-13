import mongoose from 'mongoose';

const checkinSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        location: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'Checked In'
        },

        checkInInterval: {
             type: Number,
             default: 6 * 60 * 60 * 10000
        },

        lastCheckIn: {
            type: Date,
            default: null
        },

        nextCheckInDue: {
            type: Date,
            default: null
        }
    }, 
    { timestamps: true } // Automatically adds createdAt and updatedAt dates
);

const Checkin = mongoose.model('Checkin', checkinSchema);

export default Checkin;