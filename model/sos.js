import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trip',
            required: false
        },

        location: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            },
            address: {
                type: String,
                default: null
            }
        },

        message: {
            type: String,
            default: 'SOS! I need help. Please contact me immediately.'
        },

        status: {
            type: String,
            enum: ['active', 'resolved', 'cancelled'],
            default: 'active'
        },

        notifiedContacts: [
            {
                name: { type: String },
                email: { type: String },
                phone: { type: String },
                notifiedAt: { type: Date, default: Date.now }
            }
        ],

        resolvedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

const SOS = mongoose.model('SOS', sosSchema);

export default SOS;