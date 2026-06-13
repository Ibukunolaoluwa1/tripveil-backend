import dotenv from 'dotenv';
import SOS from '../model/sos.js';
import User from '../model/user.js';
import Trip from '../model/trip.js';
import transporter from '../configuration/email.js';

dotenv.config()

const sendMailWithTimeout = (mailOptions, timeout = 8000) => {
    return Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Email timeout")), timeout)
        )
    ]);
};

const notifyEmergencyContacts = async (user, sosAlert) => {
    const { location, message } = sosAlert;

    const googleMapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

    const emailBody = `
        <h2>SOS Alert from ${user.firstName}</h2>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Location:</strong> ${location.address || 'See coordinates below'}</p>
        <p><strong>Coordinates:</strong> ${location.latitude}, ${location.longitude}</p>
        <p><strong>Google Maps:</strong> <a href="${googleMapsLink}">${googleMapsLink}</a></p>
        <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
        <p>Please try to reach ${user.firstName} immediately or contact local emergency services.</p>
    `;

    const notified = [];

    if (user.emergencyContacts && user.emergencyContacts.length > 0) {

        await Promise.all(
            user.emergencyContacts.map(async (contact) => {

                if (!contact.email) return;

                try {
                    await transporter.sendMailWithTimeout({
                        from: `"TripVeil Safety" <${process.env.EMAIL_USER}>`,
                        to: contact.email,
                        subject: `SOS Alert - ${user.firstName} needs help!`,
                        html: emailBody
                    });

                    notified.push({
                        name: contact.name,
                        email: contact.email || null,
                        phone: contact.phone || null,
                        notifiedAt: new Date()
                    });

                } catch (err) {
                    console.error(`Email failed for ${contact.email}:`, err.message);
                }
            })
        );
    }

    return notified;
};

export const triggerSOS = async (req, res) => {
    try {
        const { latitude, longitude, address, message, tripId } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                message: 'Latitude and longitude are required to trigger SOS.'
            });
        }

        const existingActive = await SOS.findOne({
            user: req.user._id,
            status: 'active'
        });

        if (existingActive) {
            return res.status(400).json({
                message: 'You already have an active SOS alert. Please resolve or cancel it first.'
            });
        }

        const sosAlert = await SOS.create({
            user: req.user._id,
            trip: tripId || null,
            location: {
                latitude,
                longitude,
                address: address || null
            },
            message: message || 'SOS! I need help. Please contact me immediately.',
            status: 'active'
        });

        const user = await User.findById(req.user._id);
        const notified = await notifyEmergencyContacts(user, sosAlert);

        sosAlert.notifiedContacts = notified;
        await sosAlert.save();

        res.status(201).json({
            message: 'SOS alert triggered successfully. Your emergency contacts have been notified.',
            sos: sosAlert
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resolveSOS = async (req, res) => {
    try {
        const { sosId } = req.params;

        const sosAlert = await SOS.findById(sosId);

        if (!sosAlert) {
            return res.status(404).json({ message: 'SOS alert not found.' });
        }

        if (sosAlert.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to resolve this SOS alert.' });
        }

        if (sosAlert.status === 'resolved') {
            return res.status(400).json({ message: 'This SOS alert is already resolved.' });
        }

        sosAlert.status = 'resolved';
        sosAlert.resolvedAt = new Date();
        await sosAlert.save();

        res.status(200).json({
            message: 'SOS alert resolved successfully.',
            sos: sosAlert
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelSOS = async (req, res) => {
    try {
        const { sosId } = req.params;

        const sosAlert = await SOS.findById(sosId);

        if (!sosAlert) {
            return res.status(404).json({ message: 'SOS alert not found.' });
        }

        if (sosAlert.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to cancel this SOS alert.' });
        }

        if (sosAlert.status !== 'active') {
            return res.status(400).json({
                message: `Cannot cancel an SOS alert that is already ${sosAlert.status}.`
            });
        }

        sosAlert.status = 'cancelled';
        await sosAlert.save();

        res.status(200).json({
            message: 'SOS alert cancelled.',
            sos: sosAlert
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSOSHistory = async (req, res) => {
    try {
        const sosAlerts = await SOS.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('trip', 'destination startDate endDate');

        res.status(200).json({
            message: 'SOS history retrieved successfully.',
            count: sosAlerts.length,
            sosAlerts
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSOSById = async (req, res) => {
    try {
        const { sosId } = req.params;

        const sosAlert = await SOS.findById(sosId)
            .populate('user', 'firstName email')
            .populate('trip', 'destination startDate endDate');

        if (!sosAlert) {
            return res.status(404).json({ message: 'SOS alert not found.' });
        }

        if (sosAlert.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to view this SOS alert.' });
        }

        res.status(200).json({
            message: 'SOS alert retrieved successfully.',
            sosAlert
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};