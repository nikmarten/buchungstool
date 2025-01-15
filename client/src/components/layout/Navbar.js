import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit' 
          }}
        >
          Kamera Verleih
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/products"
          >
            Produkte
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/login"
          >
            Login
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/register"
          >
            Registrieren
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 