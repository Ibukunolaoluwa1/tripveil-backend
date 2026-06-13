import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from "cors";
import authRoutes from './router/authRoutes.js';
import checkInRoutes from './router/checkin.routes.js';
import emergencyContactRoutes from './router/emergencyContact.routes.js';
import sosRoutes from './router/sosRoutes.js';
import tripRoutes from "./router/tripRoutes.js";
import userRoutes from "./router/userRoutes.js";
import liveTrackingRoutes from "./router/liveTrackingRoute.js";
import ratingRoutes from "./router/ratingRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use('/api/checkin', checkInRoutes);

app.use('/api/emergency-contacts', emergencyContactRoutes);

app.use('/api/sos', sosRoutes);

app.use('/api/trips', tripRoutes);

app.use('/api/users', userRoutes);

app.use('/api/tracking', liveTrackingRoutes);

app.use('/api/ratings', ratingRoutes);

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
