import EmergencyContact from '../model/emergencyContact.model.js';

// ─── ADD A NEW EMERGENCY CONTACT ────────────────────────────────────────────
export const addEmergencyContact = async (req, res) => {
    try {
        const { user, name, relationship, phoneNumber, email, isPrimary } = req.body;

        // If this new contact is being set as primary,
        // remove the primary flag from any existing primary contact
        if (isPrimary) {
            await EmergencyContact.updateMany(
                { user, isPrimary: true },
                { isPrimary: false }
            );
        }

        const contact = await EmergencyContact.create({
            user,
            name,
            relationship,
            phoneNumber,
            email,
            isPrimary: isPrimary || false
        });

        return res.status(201).json({
            message: 'Emergency contact added successfully',
            contact
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// ─── GET ALL CONTACTS FOR A USER ────────────────────────────────────────────
export const getUserEmergencyContacts = async (req, res) => {
    try {
        const { userId } = req.params;

        const contacts = await EmergencyContact
            .find({ user: userId })
            .populate('user', 'firstName email')
            .sort({ isPrimary: -1, createdAt: -1 }); // primary contacts appear first

        return res.status(200).json({
            message: 'Emergency contacts retrieved successfully',
            contacts
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// ─── GET A SINGLE CONTACT BY ID ─────────────────────────────────────────────
export const getEmergencyContactById = async (req, res) => {
    try {
        const { contactId } = req.params;

        const contact = await EmergencyContact
            .findById(contactId)
            .populate('user', 'firstName email');

        if (!contact) {
            return res.status(404).json({
                message: 'Emergency contact not found'
            });
        }

        return res.status(200).json({
            message: 'Emergency contact retrieved successfully',
            contact
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// ─── UPDATE AN EMERGENCY CONTACT ────────────────────────────────────────────
export const updateEmergencyContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const updates = req.body;

        // If updating to isPrimary = true, clear other primary contacts first
        if (updates.isPrimary === true) {
            const contact = await EmergencyContact.findById(contactId);
            if (contact) {
                await EmergencyContact.updateMany(
                    { user: contact.user, isPrimary: true },
                    { isPrimary: false }
                );
            }
        }

        const updatedContact = await EmergencyContact.findByIdAndUpdate(
            contactId,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({
                message: 'Emergency contact not found'
            });
        }

        return res.status(200).json({
            message: 'Emergency contact updated successfully',
            contact: updatedContact
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// ─── DELETE AN EMERGENCY CONTACT ────────────────────────────────────────────
export const deleteEmergencyContact = async (req, res) => {
    try {
        const { contactId } = req.params;

        const contact = await EmergencyContact.findByIdAndDelete(contactId);

        if (!contact) {
            return res.status(404).json({
                message: 'Emergency contact not found'
            });
        }

        return res.status(200).json({
            message: 'Emergency contact deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};