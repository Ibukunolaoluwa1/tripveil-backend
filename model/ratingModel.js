import mongoose from 'mongoose';

const ratingSchema = mongoose.Schema({
    star: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    review: {
        type: String,
        required: true,
        maxlength: 1000
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps : true});


// prevents duplicate ratings from the same user on the same trip
ratingSchema.index(
    { trip: 1, user: 1 },
    { unique: true }
);


const ratingModel = mongoose.model('Rating', ratingSchema);
export default ratingModel;