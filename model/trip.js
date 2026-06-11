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
    }

}, {timestamps: true});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;