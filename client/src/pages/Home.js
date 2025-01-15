import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCart } from '../context/CartContext';
import config from '../config';
import ProductCard from '../components/ProductCard';
import { isWithinInterval } from 'date-fns';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, bookingDates, setBookingDates } = useCart();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchBookings();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/products`);
      if (!response.ok) throw new Error('Fehler beim Laden der Produkte');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings');
      if (!response.ok) throw new Error('Fehler beim Laden der Buchungen');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Fehler beim Laden der Buchungen:', error);
    }
  };

  const isProductAvailable = (productId) => {
    if (!bookingDates.startDate || !bookingDates.endDate) return true;

    return !bookings.some(booking => 
      ((booking.products.some(product => product._id === productId) &&
      isWithinInterval(new Date(bookingDates.startDate), {
        start: new Date(booking.startDate),
        end: new Date(booking.endDate)
      })) ||
      isWithinInterval(new Date(bookingDates.endDate), {
        start: new Date(booking.startDate),
        end: new Date(booking.endDate)
      }))
    );
  };

  const handleDateChange = (field, newValue) => {
    setBookingDates(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main' 
          }}
        >
          FLORIDA TECHNIK BUCHUNG
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          Buchung interner Kamera- und Tontechnik
        </Typography>
      </Box>

      {/* Datepicker Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Zeitraum auswählen
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Von"
              value={bookingDates.startDate}
              onChange={(date) => handleDateChange('startDate', date)}
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 1,
                width: '100%'
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Bis"
              value={bookingDates.endDate}
              onChange={(date) => handleDateChange('endDate', date)}
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 1,
                width: '100%'
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Products Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => {
            const available = isProductAvailable(product._id);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard
                  product={product}
                  available={available}
                  onAddToCart={addToCart}
                  bookingDates={bookingDates}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Home; 