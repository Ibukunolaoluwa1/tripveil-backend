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

    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,

    resetPasswordToken: {
        type: String
    },

    resetPasswordExpires: {
        type: Date
    },

    fcmToken: {
    type: String,
    default: null
},

    emergencyContacts: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                trim: true
            },
            phone: {
                type: String,
                trim: true
            }
        }
    ]
    
}, {timestamps: true});

// const User = mongoose.model('User', userSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;