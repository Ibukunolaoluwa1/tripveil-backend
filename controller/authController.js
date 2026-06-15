import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from "crypto";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
    try {
        const { firstName, email, password } = req.body || {};

        if (!firstName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = randomBytes(32).toString("hex");

        const user = await User.create({
            firstName,
            email,
            password: hashedPassword,
            verificationToken,
            isVerified: false
        });

        const verificationUrl =
            `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;

        return res.status(201).json({
            message: "User registered successfully",

            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                isVerified: user.isVerified
            },

            verificationToken,
            verificationUrl
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


/* ================= VERIFY EMAIL ================= */
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({
                message: "Invalid verification token"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


/* ================= RESEND VERIFICATION ================= */
export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "User already verified"
            });
        }

        const verificationToken = randomBytes(32).toString("hex");

        user.verificationToken = verificationToken;
        await user.save();

        const verificationUrl =
            `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;

        return res.status(200).json({
            message: "Verification token regenerated",

            verificationToken,
            verificationUrl
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken = randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl =
            `${process.env.BASE_URL}/api/auth/reset-password/${resetToken}`;

        return res.status(200).json({
            message: "Reset token generated",

            resetToken,
            resetUrl
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password reset successful"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};