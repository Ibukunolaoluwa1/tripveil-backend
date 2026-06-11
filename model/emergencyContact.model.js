import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
    {
        // The traveler this contact belongs to
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        // Full name of the emergency contact
        name: {
            type: String,
            required: true,
            trim: true
        },

        // Relationship to the traveler e.g. "Sister", "Friend"
        relationship: {
            type: String,
            required: true,
            trim: true
        },

        // Contact's phone number
        phoneNumber: {
            type: String,
            required: true,
            trim: true
        },

        // Contact's email address (optional but useful for notifications)
        email: {
            type: String,
            trim: true,
            lowercase: true
        },

        // Whether this is the primary/first contact to reach
        isPrimary: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true } // adds createdAt and updatedAt automatically
);

const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);

export default EmergencyContact;