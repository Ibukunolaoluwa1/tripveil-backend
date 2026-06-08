import mongoose from 'mongoose';

const userSchema = new
mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: 'traveler'
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordExpires: {
        type: Date
    }
    
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;