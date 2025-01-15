import React from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Divider,
  Alert 
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import { clearCart } from '../redux/cartSlice';

const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Gesamtpreis berechnen
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const days = Math.ceil(
        (new Date(item.rentPeriod.endDate) - new Date(item.rentPeriod.startDate)) 
        / (1000 * 60 * 60 * 24)
      );
      return total + (item.dailyRate * days);
    }, 0);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          Ihr Warenkorb ist leer. 
          <Button 
            color="inherit" 
            onClick={() => navigate('/products')}
            sx={{ ml: 2 }}
          >
            Zu den Produkten
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Warenkorb
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        {cartItems.map((item) => (
          <React.Fragment key={item._id}>
            <CartItem item={item} />
            <Divider sx={{ my: 2 }} />
          </React.Fragment>
        ))}

        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100' }}>
          <Typography variant="h6" gutterBottom>
            Zusammenfassung
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Gesamtbetrag:</Typography>
            <Typography variant="h6">
              €{calculateTotal().toFixed(2)}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            * Kaution (20%) wird bei der Buchung fällig
          </Typography>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => dispatch(clearCart())}
            color="error"
          >
            Warenkorb leeren
          </Button>
          
          <Button 
            variant="contained" 
            onClick={handleCheckout}
            sx={{ ml: 'auto' }}
          >
            Zur Kasse
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Cart; 