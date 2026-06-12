const admin = require ('../model/firebase');

class NotificationService {
    static async sendNotifications(deviceToken, title, body) {
        const message = {
            notification: {
                title, body
            },
            token:deviceToken
        };
        try{
            const response = await admin.messaging().send(message)
            return response;
        }
        catch(error){
            return {
                success: false,
                message: "notification not sent",
                error: error.message
            }
        }
    }
 };

 module.exports = NotificationService;