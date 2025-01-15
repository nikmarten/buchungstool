const Product = require('../models/Product');
const Booking = require('../models/Booking');

const productController = {
  // Alle Produkte abrufen
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Produkt nach ID abrufen
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Produkt nicht gefunden' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Verfügbarkeit prüfen
  checkAvailability: async (req, res) => {
    try {
      const { productId, startDate, endDate } = req.body;
      
      const bookings = await Booking.find({
        'products.product': productId,
        status: { $nin: ['Storniert', 'Zurückgegeben'] },
        $or: [
          {
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) }
          }
        ]
      });

      const isAvailable = bookings.length === 0;
      res.json({ isAvailable });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Neues Produkt erstellen (nur Admin)
  createProduct: async (req, res) => {
    try {
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: 'Keine Berechtigung' });
      }

      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Produkt aktualisieren (nur Admin)
  updateProduct: async (req, res) => {
    try {
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: 'Keine Berechtigung' });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Produkt nicht gefunden' });
      }

      product.set(req.body);
      await product.save();
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Produkt löschen (nur Admin)
  deleteProduct: async (req, res) => {
    try {
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: 'Keine Berechtigung' });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Produkt nicht gefunden' });
      }

      await product.remove();
      res.json({ message: 'Produkt erfolgreich gelöscht' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = productController; 