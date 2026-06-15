import * as admin from "firebase-admin";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../firebase-service.json"),
        "utf8"
    )
);

// Prevent re-initialization safely
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    // ignore "already exists" error
}

export default admin;