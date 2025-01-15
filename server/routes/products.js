const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// GET alle Produkte
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST neues Produkt
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    available: req.body.available
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT Produkt aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE Produkt löschen
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Produkt gelöscht' });
    } else {
      res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 