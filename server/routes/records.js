import express from 'express';
import connectDB from '../db/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Example route
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const records = await db.collection('records').find({}).toArray();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const {prenom, nom, dateDeNaissance, email, password, profession, companyName, siret ,type} = req.body;

    const db = await connectDB();
    const users = db.collection('users');

    // Check if email already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ emailUsed: true });
    }

    let isClient = null;
    if (type == 'client') {
      if (!prenom || !nom || !dateDeNaissance || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      isClient = true;
    }else if (type == 'professional') {
      if (!prenom || !nom || !dateDeNaissance || !email || !password || !profession || !companyName || !siret) {
        return res.status(400).json({ error: 'All fields are required for professionals' });
      }
      isClient = false;
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }


      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = {
        prenom,
        nom,
        dateDeNaissance,
        email,
        password: hashedPassword,
        profession: profession || null,
        companyName: companyName || null,
        siret: siret || null,
        isClient: isClient,
        createdAt: new Date(),
      };

    const result = await users.insertOne(newUser);

    // Generate JWT
    const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.status(201).json({user: { id: result.insertedId, prenom, nom, email }, token });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: error.message });
  }

});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = await connectDB();
    const users = db.collection('users');

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    
    res.json({  user: { id: user._id, prenom: user.prenom, nom: user.nom, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;