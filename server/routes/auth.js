const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Benutzer in der Datenbank suchen
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // Passwort überprüfen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // Erfolgreiche Anmeldung
    res.json({
      message: 'Erfolgreich angemeldet',
      isAdmin: true
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server-Fehler' });
  }
});

module.exports = router; 