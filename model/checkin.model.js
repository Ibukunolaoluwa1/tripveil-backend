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
        }
    }, 
    { timestamps: true } // Automatically adds createdAt and updatedAt dates
);

const Checkin = mongoose.model('Checkin', checkinSchema);

export default Checkin;