const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(5000, () => {
  console.log('Test-Server läuft auf Port 5000');
}); 