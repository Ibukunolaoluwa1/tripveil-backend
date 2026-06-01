import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './router/authRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

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
