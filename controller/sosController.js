import SOS from "../model/sos.js";
import User from "../model/user.js";
import { messaging } from "../configuration/firebaseadmin.js";

/* ================= TRIGGER SOS ================= */
export const triggerSOS = async (req, res) => {
    try {
        const { latitude, longitude, address, message, tripId } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        // prevent duplicate active SOS
        const existingActive = await SOS.findOne({
            user: req.user._id,
            status: "active"
        });

        if (existingActive) {
            return res.status(400).json({
                message: "You already have an active SOS alert"
            });
        }

        // create SOS
        const sosAlert = await SOS.create({
            user: req.user._id,
            trip: tripId || null,
            location: {
                latitude,
                longitude,
                address: address || null
            },
            message: message || "SOS! I need help immediately.",
            status: "active"
        });

        // get user
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        /* ================= FCM NOTIFICATION ================= */
       try {
    if (user.fcmToken) {
        await messaging.send({
            token: user.fcmToken,
            notification: {
                title: "🚨 SOS ALERT",
                body: `${user.firstName} triggered an SOS`
            },
            data: {
                sosId: sosAlert._id.toString(),
                latitude: String(latitude),
                longitude: String(longitude)
            }
        });

        console.log("FCM notification sent successfully");
    }
} catch (err) {
    console.log("FCM ERROR:", err.message);
}

        // Google Maps link
        const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        return res.status(201).json({
            message: "SOS triggered successfully",

            sos: sosAlert,

            // FRONTEND WILL USE THIS FOR EMAIL SERVICE (EmailJS)
            emergencyContacts: user.emergencyContacts || [],

            mapLink,

            // FRONTEND DATA PACKAGE
            sosPayload: {
                userName: user.firstName,
                message: sosAlert.message,
                location: {
                    latitude,
                    longitude,
                    address: address || "No address provided"
                },
                time: new Date().toISOString(),
                mapLink
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

/* ================= RESOLVE SOS ================= */
export const resolveSOS = async (req, res) => {
    try {
        const { sosId } = req.params;

        const sos = await SOS.findById(sosId);

        if (!sos) {
            return res.status(404).json({ message: "SOS not found" });
        }

        if (sos.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (sos.status === "resolved") {
            return res.status(400).json({ message: "Already resolved" });
        }

        sos.status = "resolved";
        sos.resolvedAt = new Date();

        await sos.save();

        return res.status(200).json({
            message: "SOS resolved",
            sos
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

/* ================= CANCEL SOS ================= */
export const cancelSOS = async (req, res) => {
    try {
        const { sosId } = req.params;

        const sos = await SOS.findById(sosId);

        if (!sos) {
            return res.status(404).json({ message: "SOS not found" });
        }

        if (sos.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (sos.status !== "active") {
            return res.status(400).json({
                message: `Cannot cancel ${sos.status} SOS`
            });
        }

        sos.status = "cancelled";

        await sos.save();

        return res.status(200).json({
            message: "SOS cancelled",
            sos
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

/* ================= SOS HISTORY ================= */
export const getSOSHistory = async (req, res) => {
    try {
        const sosAlerts = await SOS.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("trip", "destination startDate endDate");

        return res.status(200).json({
            message: "SOS history retrieved",
            count: sosAlerts.length,
            sosAlerts
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

/* ================= GET SOS BY ID ================= */
export const getSOSById = async (req, res) => {
    try {
        const { sosId } = req.params;

        const sos = await SOS.findById(sosId)
            .populate("user", "firstName email")
            .populate("trip", "destination startDate endDate");

        if (!sos) {
            return res.status(404).json({ message: "SOS not found" });
        }

        if (sos.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        return res.status(200).json({
            message: "SOS retrieved",
            sos
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};