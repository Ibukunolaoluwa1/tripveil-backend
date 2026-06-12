import express from 'express';
import {
    addEmergencyContact,
    getUserEmergencyContacts,
    getEmergencyContactById,
    updateEmergencyContact,
    deleteEmergencyContact
} from '../controller/emergencyContact.controller.js';

const router = express.Router();

import protect from "../middleware/auth.js";


// POST   /api/emergency-contacts/add          — Add a new contact
router.post('/', protect, addEmergencyContact);

// GET    /api/emergency-contacts/user/:userId  — Get all contacts for a user
router.get('/', protect, getUserEmergencyContacts);

// GET    /api/emergency-contacts/:contactId    — Get one specific contact
router.get('/', protect, getEmergencyContactById);

// PUT    /api/emergency-contacts/:contactId    — Update a contact
router.put('/', protect, updateEmergencyContact);

// DELETE /api/emergency-contacts/:contactId    — Delete a contact
router.delete('/', protect, deleteEmergencyContact);

export default router;