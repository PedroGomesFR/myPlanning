import express from 'express';
import connectDB from '../db/connection.js';
import { ObjectId } from 'mongodb';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Middleware to check if user is admin
const verifyAdmin = async (req, res, next) => {
    try {
        const db = await connectDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.userId) });

        if (!user || user.isAdmin !== true) {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error during admin verification' });
    }
};

// Get all users (Protected)
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const db = await connectDB();
        const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user (Protected)
router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const db = await connectDB();

        // Delete user
        await db.collection('users').deleteOne({ _id: new ObjectId(id) });

        // Also delete associated bookings
        await db.collection('bookings').deleteMany({
            $or: [{ clientId: id }, { professionalId: id }]
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
