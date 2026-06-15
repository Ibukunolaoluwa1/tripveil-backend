import User from "../model/user.js";

export const saveDeviceToken = async (req, res) => {
    try {
        const { fcmToken } = req.body;

        if (!fcmToken) {
            return res.status(400).json({
                message: "FCM token required"
            });
        }

        await User.findByIdAndUpdate(req.user._id, {
            fcmToken
        });

        return res.status(200).json({
            message: "Token saved successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};