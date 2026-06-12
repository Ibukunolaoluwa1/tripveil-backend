const NotificationService = require("../controller/notificationController")

const sendFirebaseNotification = async (req, res) => {
    try{
        const { title, body, deviceToken} = req.body;
        await NotificationService.sendNotification(deviceToken, title, body);
        return res.status (200)
        .json ({
            message: "notification sent successfully",
            success: true,
        })
    }catch(error){
        return res.status (500)
        .json ({
            message: "Error sending notification",
            success: false,
            error: error.message
        })
    }
}
module.exports = sendFirebaseNotification