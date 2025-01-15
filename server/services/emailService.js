require('dotenv').config();

const nodemailer = require('nodemailer');

// Debug-Logs für die Konfiguration
console.log('Email-Konfiguration wird geladen...');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Vorhanden' : 'Fehlt');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Vorhanden' : 'Fehlt');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // Expliziter SMTP-Host
  port: 587,               // Standard SMTP-Port
  secure: false,           // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true             // Debug-Modus aktivieren
});

// Verbindung testen
transporter.verify(function(error, success) {
  if (error) {
    console.log('Fehler bei der SMTP-Konfiguration:', error);
  } else {
    console.log('Server ist bereit E-Mails zu versenden');
  }
});

const sendBookingConfirmation = async (booking) => {
  const { customerInfo, startDate, endDate, products } = booking;
  
  // Schönere Formatierung der Produktliste
  const productList = products
    .map(product => `- ${product.name} (${product.category})`)
    .join('\n');

  const emailText = `
Sehr geehrte(r) ${customerInfo.firstName} ${customerInfo.lastName},

vielen Dank für Ihre Buchung. Hier sind Ihre Buchungsdetails:

Zeitraum:
Von: ${new Date(startDate).toLocaleDateString('de-DE')}
Bis: ${new Date(endDate).toLocaleDateString('de-DE')}

Ihre gebuchten Produkte:
${productList}

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Ihr Camera-Rental Team
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerInfo.email,
    subject: 'Ihre Buchungsbestätigung - Camera Rental',
    text: emailText
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-Mail erfolgreich gesendet');
    return info;
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    throw error;
  }
};

module.exports = {
  sendBookingConfirmation
}; 