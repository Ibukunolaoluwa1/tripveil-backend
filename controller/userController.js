import User from "../model/user.js";
/**
 * GET CURRENT USER (PROFILE)
 * Protected route
 */
export const getMe = async (req, res) => {
    try {
        const user = await
        User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * GET ALL USERS
 * (Usually admin or testing purpose)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await
        User.find().select("-password");

        res.status(200).json({
            count: users.length, users
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * UPDATE USER PROFILE
 * Protected route
 */
export const updateUser = async (req, res) => {
    try {
        const user = await
        User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // update fields only if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * DELETE USER
 * Protected route
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await
        User.findByIdAndDelete(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};