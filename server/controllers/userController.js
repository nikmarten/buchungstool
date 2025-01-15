const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userController = {
  // Registrierung
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName, phoneNumber } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email bereits registriert' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber
      });

      await user.save();

      // Session erstellen
      req.session.userId = user._id;
      req.session.isAdmin = user.isAdmin;

      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Benutzer nicht gefunden' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Falsches Passwort' });
      }

      // Session erstellen
      req.session.userId = user._id;
      req.session.isAdmin = user.isAdmin;

      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Profil abrufen
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Benutzer nicht gefunden' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController; 