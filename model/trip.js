import mongoose from 'mongoose';

const tripSchema = new
mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    destination: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
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

}, {timestamps: true});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;