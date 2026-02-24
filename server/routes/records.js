import express from 'express';
import connectDB from '../db/connection.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
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
    const { prenom, nom, dateDeNaissance, email, password, profession, companyName, siret, type } = req.body;

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
    } else if (type == 'professional') {
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
      profilePhoto: null,
      salonPhotos: [],
      description: null,
      address: null,
      phone: null,
      openingHours: null,
      location: null,
      latitude: null,
      longitude: null,
      averageRating: 0,
      totalReviews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    // Generate JWT
    const token = generateToken(result.insertedId);

    res.status(201).json({
      user: {
        id: result.insertedId,
        prenom,
        nom,
        email,
        isClient,
        isAdmin: false, // Default to false
        companyName,
        profilePhoto: null
      },
      token
    });
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

    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        isClient: user.isClient,
        isAdmin: user.isAdmin || false, // Return isAdmin status
        companyName: user.companyName,
        profilePhoto: user.profilePhoto,
        salonPhotos: user.salonPhotos
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all professionals
router.get('/professionals', async (req, res) => {
  try {
    const db = await connectDB();
    const { search, profession } = req.query;

    let query = { isClient: false };

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    if (profession) {
      query.profession = profession;
    }

    const professionals = await db.collection('users').find(
      query,
      { projection: { password: 0 } }
    ).toArray();

    res.status(200).json(professionals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professional profile details
router.get('/professional/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    const professional = await db.collection('users').findOne(
      { _id: new ObjectId(id), isClient: false },
      { projection: { password: 0 } }
    );

    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    res.status(200).json(professional);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update professional profile
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { description, address, phone, openingHours, companyName, latitude, longitude } = req.body;

    const db = await connectDB();
    const updateData = { updatedAt: new Date() };

    if (description !== undefined) updateData.description = description;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (openingHours !== undefined) updateData.openingHours = openingHours;
    if (companyName !== undefined) updateData.companyName = companyName;

    // GPS coordinates
    if (latitude !== undefined && longitude !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
      updateData.latitude = parseFloat(latitude);
      updateData.longitude = parseFloat(longitude);
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    res.status(200).json({ message: 'Profile updated successfully', data: updateData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;