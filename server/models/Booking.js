const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  depositAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['bestätigt', 'abgeschlossen', 'storniert'],
    default: 'bestätigt'
  },
  pickupLocation: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema); 