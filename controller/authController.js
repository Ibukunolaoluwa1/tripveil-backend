import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  { randomBytes, createHash } from "crypto"
import transporter from "../configuration/email.js"

export const registerUser = async (req, res) => {

    try {
        const { firstName, email, password } = req.body || {};

        if (!firstName || !email || ! password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await
        User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await
        bcrypt.hash(password, 10);

        const verificationToken = randomBytes(32).toString("hex");

        const user = await
        User.create({
            firstName,
            email,
            password: hashedPassword,
            verificationToken,
            isVerified: false
        });

        const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;

        await transporter.sendMail({
            from: `"TripVeil" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Tripveil Account",
            html: `
            <h2>Welcome to Tripveil</h2>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationLink}">
            Verify Email
            </a>
            `
        });
        
        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch(error) {

    res.status(500).json({
        message: error.message
    });

}

};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid verification token"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({
            message: "Email verified successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const loginUser = async (req,
    res) => {
        
        try {
            const { email, password } =
            req.body;
            const user = await
            User.findOne({ email });

            if(!user) {
                return
                res.status(404).json({
                    message: 'User not found'
                });
            }

            if (!user.isVerified) {
                return res.status(401).json({
                    message: "Please verify your email first"
                });
            }

            const isMatch = await 
            bcrypt.compare(password,
                user.password);

                if(!isMatch) {
                    return
                    res.status(400).json({
                        message: 'Invalid credentials'
                    });
                }

                const token = jwt.sign(
                    { id: user._id},
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                );

                res.status(200).json({
                    message: 'Login successful',
                    token
                });

        } catch(error) {

            res.status(500).json({
                message: error.message
            });
        }
    };

    export const forgotPassword = async ( req, res) => {
        try {
            const { email } = req.body;

            const user = await
            User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const resetToken = randomBytes(32).toString("hex");

            user.resetPasswordToken = resetToken;

            user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

            await user.save();

            await transporter.sendMail({
                from: `"TripVeil" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Password Changed Successsfully",
                html:`
                <h2>Password Updated</h2>
                <p>Your TripVeil password was changed successfully.</p>
                <p>If this was not you, please contact support immediately.</p>`
            });

            const resetLink = `${process.env.BASE_URL}/api/auth/reset-password/${resetToken}`;

            await transporter.sendMail({
                from: `"TripVeil" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Reset Your Password",
                html: `
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">
                Reset Password
                </a>`
            });

            res.status(200).json({
                message: "Password reset link sent to email"
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    };

    export const resetPassword = async ( req, res ) => {
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

            const hashedPassword = await
            bcrypt.hash(password, 10);

            user.password = hashedPassword;

            user.resetPasswordToken = undefined;

            user.resetPasswordExpires = undefined;

            await user.save();

            res.status(200).json({
                message: "Password reset successful"
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    };

    export const changePassword = async (req, res) => {
        try {
            const {
                email,
                currentPassword,
                newPassword
            } = req.body;

            const user = await
            User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const isMatch = 
            await bcrypt.compare(
                currentPassword, user.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    message: "Current password is incorrect"
                });
            }

            const hashedPassword = 
            await bcrypt.hash(newPassword, 10)

            user.password = hashedPassword;

            await user.save();

            res.status(200).json({
                message: "Password changed successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }