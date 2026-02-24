import express from 'express';
import connectDB from '../db/connection.js';

const professionalRouter = express.Router();

professionalRouter.get('/feature', async (req, res) => {
    try {
        const db = await connectDB();
        const professionals = await db.collection('professionals').find({}).toArray();
        res.json(professionals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default professionalRouter;