// Erstellen Sie eine neue Datei für Konfigurationen
const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://ihre-render-domain.com' 
    : 'http://localhost:5000'
};

export default config; 