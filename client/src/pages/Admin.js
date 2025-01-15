import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import ProductManager from './admin/ProductManager';
import BookingManager from './admin/BookingManager';

const Admin = () => {
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname === '/admin/bookings' ? 1 : 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Produkte" component={Link} to="/admin/products" />
            <Tab label="Buchungen" component={Link} to="/admin/bookings" />
          </Tabs>
        </Box>
      </Paper>

      <Routes>
        <Route path="/products" element={<ProductManager />} />
        <Route path="/bookings" element={<BookingManager />} />
      </Routes>
    </Container>
  );
};

export default Admin; 