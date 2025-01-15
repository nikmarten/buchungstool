import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const BookingDialog = ({ open, onClose, product, startDate, endDate }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          userName,
          userEmail,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Buchung konnte nicht durchgeführt werden');
      }

      const bookingData = await response.json();
      
      // Erfolgreiche Buchung
      onClose('success', {
        ...bookingData,
        productId: product._id,
        userName,
        userEmail,
        startDate,
        endDate
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>Buchung abschließen</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Produkt: {product?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Zeitraum: {startDate && format(startDate, 'dd.MM.yyyy', { locale: de })} - {endDate && format(endDate, 'dd.MM.yyyy', { locale: de })}
            </Typography>
          </Box>

          <TextField
            fullWidth
            required
            label="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            type="email"
            label="E-Mail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>
            Abbrechen
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading || !userName || !userEmail}
          >
            {loading ? 'Wird gebucht...' : 'Jetzt buchen'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookingDialog; 