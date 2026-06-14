import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// SMTP verification
transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP ERROR:", error);
    } else {
        console.log("SMTP SERVER READY");
    }
});

export default transporter;