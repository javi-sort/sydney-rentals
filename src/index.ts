import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import listingRoutes from './routes/listings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Setting up routes
app.use('/listings', listingRoutes);

mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log(`Connected to MongoDB`);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.error('MongoDB connection error:', err));
