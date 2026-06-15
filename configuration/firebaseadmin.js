import { initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

let serviceAccount;

if (process.env.FIREBASE_SERVICE_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY);
} else {
    serviceAccount = JSON.parse(
        fs.readFileSync("./firebase-service.json", "utf8")
    );
}

const app = initializeApp({
    credential: cert(serviceAccount)
});

export const messaging = getMessaging(app);