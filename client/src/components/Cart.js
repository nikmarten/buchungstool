import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Box,
  Paper,
  Avatar
} from '@mui/material';
import { Delete as DeleteIcon, ShoppingCart as CartIcon } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const Cart = () => {
  const { cartItems, removeFromCart, cartOpen, setCartOpen, bookingDates } = useCart();
  const navigate = useNavigate();

  return (
    <Drawer 
      anchor="right" 
      open={cartOpen} 
      onClose={() => setCartOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CartIcon color="primary" />
        <Typography variant="h6" component="h2">
          Warenkorb
        </Typography>
      </Box>

      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        mb: 2
      }}>
        {cartItems.length > 0 ? (
          <>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Ausgewählter Zeitraum:
              </Typography>
              <Typography variant="body2">
                {bookingDates.startDate && bookingDates.endDate ? (
                  <>
                    {format(bookingDates.startDate, 'dd. MMMM yyyy', { locale: de })}
                    {' - '}
                    {format(bookingDates.endDate, 'dd. MMMM yyyy', { locale: de })}
                  </>
                ) : (
                  'Kein Zeitraum ausgewählt'
                )}
              </Typography>
            </Paper>

            <List sx={{ flexGrow: 1, mb: 2 }}>
              {cartItems.map((item) => (
                <ListItem 
                  key={item._id}
                  sx={{
                    mb: 1,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'grey.100'
                    }
                  }}
                >
                  <Avatar 
                    src={item.imageUrl} 
                    variant="rounded"
                    sx={{ mr: 2, width: 48, height: 48 }}
                  />
                  <ListItemText
                    primary={item.name}
                    secondary={item.category}
                    primaryTypographyProps={{
                      fontWeight: 'medium'
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => removeFromCart(item._id)}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'white'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Box 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              color: 'text.secondary'
            }}
          >
            <CartIcon sx={{ fontSize: 60, opacity: 0.3 }} />
            <Typography variant="h6">
              Ihr Warenkorb ist leer
            </Typography>
            <Typography variant="body2" textAlign="center">
              Fügen Sie Produkte hinzu, um eine Buchung vorzunehmen
            </Typography>
          </Box>
        )}
      </Box>

      {cartItems.length > 0 && (
        <Box sx={{ 
          mt: 'auto',
          pt: 2,
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => {
              setCartOpen(false);
              navigate('/booking');
            }}
            disabled={!bookingDates.startDate || !bookingDates.endDate}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              boxShadow: 2
            }}
          >
            Zur Buchung
          </Button>
          {(!bookingDates.startDate || !bookingDates.endDate) && (
            <Typography 
              variant="caption" 
              color="error" 
              sx={{ 
                mt: 1, 
                display: 'block',
                textAlign: 'center'
              }}
            >
              Bitte wählen Sie einen Zeitraum aus
            </Typography>
          )}
        </Box>
      )}
    </Drawer>
  );
};

export default Cart; 