import express from 'express';
import {
    addEmergencyContact,
    getUserEmergencyContacts,
    getEmergencyContactById,
    updateEmergencyContact,
    deleteEmergencyContact
} from '../controller/emergencyContact.controller.js';

const router = express.Router();

// Health check — matches the pattern the team already uses
router.get('/', (req, res) => {
    res.json({ message: 'Emergency contacts route working' });
});

// POST   /api/emergency-contacts/add          — Add a new contact
router.post('/add', addEmergencyContact);

// GET    /api/emergency-contacts/user/:userId  — Get all contacts for a user
router.get('/user/:userId', getUserEmergencyContacts);

// GET    /api/emergency-contacts/:contactId    — Get one specific contact
router.get('/:contactId', getEmergencyContactById);

// PUT    /api/emergency-contacts/:contactId    — Update a contact
router.put('/:contactId', updateEmergencyContact);

// DELETE /api/emergency-contacts/:contactId    — Delete a contact
router.delete('/:contactId', deleteEmergencyContact);

export default router;