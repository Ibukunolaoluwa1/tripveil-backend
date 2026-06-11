import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './router/authRoutes.js';
import checkInRoutes from './router/checkin.routes.js';
import emergencyContactRoutes from './router/emergencyContact.routes.js';
import sosRoutes from './router/sosRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/checkin', checkInRoutes);

app.use('/api/emergency-contacts', emergencyContactRoutes);

app.use('/api/sos', sosRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Database connected successfully');
})
.catch((error) => {
    console.log(error);
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
