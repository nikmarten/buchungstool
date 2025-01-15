import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import BookingPage from './pages/BookingPage';
import BookingSuccess from './pages/BookingSuccess';
import NotFound from './pages/NotFound';
import { CartProvider } from './context/CartContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <Router>
          <CartProvider>
            <Navbar />
            <Cart />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>}>
                <Route path="products" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="bookings" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              </Route>
              
              {/* 404 Route - muss immer als letztes kommen */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
