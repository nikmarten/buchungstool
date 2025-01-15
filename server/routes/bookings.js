const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { sendBookingConfirmation } = require('../services/emailService');

// GET alle Buchungen
router.get('/', bookingController.getAllBookings);

// POST neue Buchung
router.post('/', bookingController.createBooking);

module.exports = router; 