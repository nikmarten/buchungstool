import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const BookingPage = () => {
  const navigate = useNavigate();
  const { cartItems, bookingDates, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalAmount = () => {
    const days = Math.ceil(
      (new Date(bookingDates.endDate) - new Date(bookingDates.startDate)) / (1000 * 60 * 60 * 24)
    );
    return cartItems.reduce((total, item) => total + (item.dailyRate * days), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const totalAmount = calculateTotalAmount();
      const bookingData = {
        customerInfo: formData,
        products: cartItems.map(item => ({
          product: item._id,
          quantity: 1
        })),
        startDate: bookingDates.startDate,
        endDate: bookingDates.endDate,
        pickupLocation: "Store",
        totalAmount: totalAmount,
        depositAmount: totalAmount * 0.2
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fehler beim Erstellen der Buchung');
      }

      const savedBooking = await response.json();
      clearCart();
      
      navigate('/booking-success', { 
        state: { 
          booking: {
            ...savedBooking,
            products: cartItems
          }
        } 
      });
    } catch (error) {
      console.error('Fehler:', error);
      alert(error.message);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Ihr Warenkorb ist leer
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Zurück zur Übersicht
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Buchungsübersicht */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" gutterBottom>
              Ihre Buchung
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Zeitraum:
              <br />
              {format(bookingDates.startDate, 'dd.MM.yyyy', { locale: de })} 
              {' - '}
              {format(bookingDates.endDate, 'dd.MM.yyyy', { locale: de })}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Ausgewählte Produkte:
            </Typography>
            <List dense>
              {cartItems.map((item) => (
                <ListItem key={item._id}>
                  <ListItemText 
                    primary={item.name}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Buchungsformular */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ihre Daten
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Vorname"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Nachname"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="E-Mail"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!formData.firstName || !formData.lastName || !formData.email}
                  >
                    Buchung abschließen
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingPage; 