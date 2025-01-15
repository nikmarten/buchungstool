const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  dailyRate: {
    type: Number,
    required: true
  },
  images: [String],
  specifications: {
    type: Map,
    of: String
  }
}, { timestamps: true });

// Prüfen ob das Model bereits existiert
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema); 