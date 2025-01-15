import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Badge } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartItems, setCartOpen } = useCart();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold',
              letterSpacing: 1
            }}
          >
            FLORIDA TECHNIK
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
              sx={{ borderRadius: 2 }}
            >
              Home
            </Button>
            
            {isAdmin ? (
              <>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/admin/products"
                  sx={{ borderRadius: 2 }}
                >
                  Admin
                </Button>
                <Button 
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ borderRadius: 2 }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ borderRadius: 2 }}
              >
                Admin Login
              </Button>
            )}

            <Button 
              onClick={() => setCartOpen(true)}
              sx={{ 
                borderRadius: 2,
                backgroundColor: 'secondary.main',
                color: 'white',
                minWidth: '120px',
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                },
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                transition: 'all 0.2s ease-in-out',
                transform: cartItems.length > 0 ? 'scale(1.05)' : 'scale(1)',
                animation: cartItems.length > 0 ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(231, 76, 60, 0.4)'
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(231, 76, 60, 0)'
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(231, 76, 60, 0)'
                  }
                }
              }}
            >
              <Badge 
                badgeContent={cartItems.length} 
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: 'white',
                    color: 'secondary.main',
                    fontWeight: 'bold'
                  }
                }}
              >
                <ShoppingCartIcon />
              </Badge>
              <Box component="span" sx={{ ml: 1 }}>
                Warenkorb
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 