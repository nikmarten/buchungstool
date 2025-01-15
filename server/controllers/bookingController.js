const Booking = require('../models/Booking');
const Product = require('../models/Product');

const bookingController = {
  // Neue Buchung erstellen
  createBooking: async (req, res) => {
    try {
      const { products, startDate, endDate, pickupLocation } = req.body;

      // Verfügbarkeit prüfen
      for (let productItem of products) {
        const existingBookings = await Booking.find({
          'products.product': productItem.product,
          status: { $nin: ['Storniert', 'Zurückgegeben'] },
          $or: [
            {
              startDate: { $lte: new Date(endDate) },
              endDate: { $gte: new Date(startDate) }
            }
          ]
        });

        if (existingBookings.length > 0) {
          return res.status(400).json({ 
            message: `Ein oder mehrere Produkte sind im gewählten Zeitraum nicht verfügbar` 
          });
        }
      }

      // Gesamtbetrag berechnen
      let totalAmount = 0;
      for (let productItem of products) {
        const product = await Product.findById(productItem.product);
        const days = Math.ceil(
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        );
        totalAmount += product.dailyRate * days * productItem.quantity;
      }

      // Kaution berechnen (z.B. 20% des Gesamtbetrags)
      const depositAmount = totalAmount * 0.2;

      const booking = new Booking({
        products,
        startDate,
        endDate,
        totalAmount,
        depositAmount,
        pickupLocation
      });

      await booking.save();
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Buchungen eines Benutzers abrufen
  getUserBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.session.userId })
        .populate('products.product')
        .sort({ createdAt: -1 });
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Buchungsstatus aktualisieren (nur Admin)
  updateBookingStatus: async (req, res) => {
    try {
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: 'Keine Berechtigung' });
      }

      const { status } = req.body;
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ message: 'Buchung nicht gefunden' });
      }

      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate('products.product')
        .sort({ createdAt: -1 });
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = bookingController; 