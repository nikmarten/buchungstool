import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button,
  Box,
  Chip,
  Divider,
  ImageList,
  ImageListItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { addDays } from 'date-fns';
import BookingDialog from '../components/BookingDialog';
import bookingService from '../services/bookingService';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState(location.state?.startDate || null);
  const [endDate, setEndDate] = useState(location.state?.endDate || null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  // Produkt laden
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Verfügbarkeit prüfen wenn sich Datum ändert
  useEffect(() => {
    if (startDate && endDate) {
      checkAvailability();
    }
  }, [startDate, endDate]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Produkt nicht gefunden');
      }
      const data = await response.json();
      setProduct(data);
      setError(null);
    } catch (err) {
      setError('Produkt konnte nicht geladen werden');
      console.error('Fehler:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      const availabilityData = await bookingService.checkAvailability(
        id,
        startDate.toISOString(),
        endDate.toISOString()
      );
      setIsAvailable(!availabilityData[id]);
    } catch (err) {
      console.error('Fehler bei der Verfügbarkeitsprüfung:', err);
    }
  };

  const handleBookingComplete = (result, bookingData) => {
    setBookingDialogOpen(false);
    if (result === 'success' && bookingData) {
      navigate('/booking-success', { 
        state: { 
          booking: {
            ...bookingData,
            startDate: startDate,
            endDate: endDate
          }
        }
      });
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Produkt nicht gefunden'}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Bilder-Bereich */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Kein+Bild';
                }}
              />
            </Box>
            
            {/* Thumbnail-Galerie */}
            {product.images.length > 1 && (
              <ImageList sx={{ height: 100 }} cols={4} rowHeight={100}>
                {product.images.map((img, index) => (
                  <ImageListItem 
                    key={index}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid primary.main' : 'none'
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      style={{ height: '100px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200?text=Kein+Bild';
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Paper>
        </Grid>

        {/* Produkt-Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip label={product.category} color="primary" sx={{ mr: 1 }} />
              <Chip label={product.brand} />
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Buchungs-Bereich */}
            <Typography variant="h6" gutterBottom>
              Zeitraum auswählen
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <DatePicker
                  label="Von"
                  value={startDate}
                  onChange={setStartDate}
                  minDate={new Date()}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="Bis"
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate ? addDays(startDate, 1) : new Date()}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>

            {!isAvailable && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Das Produkt ist im gewählten Zeitraum leider nicht verfügbar
              </Alert>
            )}

            <Button 
              variant="contained" 
              size="large" 
              fullWidth
              onClick={() => setBookingDialogOpen(true)}
              disabled={!startDate || !endDate || !isAvailable}
            >
              {isAvailable ? 'Jetzt buchen' : 'Nicht verfügbar'}
            </Button>

            <Divider sx={{ my: 3 }} />

            {/* Produkteigenschaften */}
            <Typography variant="h6" gutterBottom>
              Eigenschaften:
            </Typography>
            <Box sx={{ mb: 3 }}>
              {product.features.map((feature, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  • {feature}
                </Typography>
              ))}
            </Box>

            {/* Technische Daten */}
            {product.specs && product.specs.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Technische Daten:
                </Typography>
                <Box>
                  {product.specs.map((spec, index) => (
                    <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: 150, fontWeight: 'bold' }}>
                        {spec.key}:
                      </Typography>
                      <Typography variant="body2">
                        {spec.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <BookingDialog
        open={bookingDialogOpen}
        onClose={handleBookingComplete}
        product={product}
        startDate={startDate}
        endDate={endDate}
      />
    </Container>
  );
};

export default ProductDetail; 