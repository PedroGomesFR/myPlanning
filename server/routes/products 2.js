import express from 'express';
import connectDB from '../db/connection.js';

const router = express.Router();

// Exemple : Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.collection('products').find({}).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exemple : Ajouter un produit
router.post('/', async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const db = await connectDB();
    const newProduct = {
      name,
      price,
      description: description || '',
      createdAt: new Date(),
    };

    const result = await db.collection('products').insertOne(newProduct);
    res.status(201).json({ product: { id: result.insertedId, ...newProduct } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;