require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Hier Ihre gewünschten Anmeldedaten eintragen
const ADMIN_USERNAME = 'cammans';
const ADMIN_PASSWORD = 'bestesteamderwelt';

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Prüfen ob Admin bereits existiert
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      await User.deleteOne({ username: 'admin' });
      console.log('Bestehender Admin-User gelöscht');
    }
    
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    await User.create({
      username: ADMIN_USERNAME,
      password: hashedPassword
    });

    console.log('Admin-User erfolgreich erstellt');
    console.log('Username:', ADMIN_USERNAME);
    console.log('Passwort:', ADMIN_PASSWORD);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Fehler:', error);
    process.exit(1);
  }
};

createAdmin(); 