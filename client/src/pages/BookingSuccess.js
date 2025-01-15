import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Avatar,
  Chip,
  Fade
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  DateRange as DateIcon,
  Person as PersonIcon,
  Inventory as ProductIcon,
  Email as EmailIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  // Überprüfen der Buchungsdaten beim Laden der Komponente
  React.useEffect(() => {
    if (!booking) {
      navigate('/', { replace: true });
    }
  }, [booking, navigate]);

  // Während der Überprüfung zeigen wir nichts an
  if (!booking) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Erfolgs-Header */}
          <Paper 
            sx={{ 
              p: 4, 
              mb: 3, 
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'success.main',
              color: 'white'
            }}
          >
            <SuccessIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Buchung erfolgreich!
            </Typography>
            <Typography variant="subtitle1">
              Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.
            </Typography>
          </Paper>

          {/* Buchungsdetails */}
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {/* Buchungsnummer */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
              <Typography variant="subtitle2" align="center">
                Buchungsnummer: {booking._id}
              </Typography>
            </Box>

            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Kundeninformationen */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <PersonIcon color="primary" />
                    <Typography variant="h6">
                      Kundeninformationen
                    </Typography>
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1">
                          {booking.customerInfo.firstName} {booking.customerInfo.lastName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {booking.customerInfo.email}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          Tel: {booking.customerInfo.phone}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Buchungszeitraum */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <DateIcon color="primary" />
                    <Typography variant="h6">
                      Buchungszeitraum
                    </Typography>
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Von
                        </Typography>
                        <Typography variant="body1">
                          {format(new Date(booking.startDate), 'dd. MMMM yyyy', { locale: de })}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Bis
                        </Typography>
                        <Typography variant="body1">
                          {format(new Date(booking.endDate), 'dd. MMMM yyyy', { locale: de })}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Gebuchte Produkte */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <ProductIcon color="primary" />
                    <Typography variant="h6">
                      Gebuchte Produkte
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {booking.products.map((product) => (
                      <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Avatar 
                              variant="rounded" 
                              src={product.imageUrl}
                              sx={{ width: 64, height: 64 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">
                                {product.name}
                              </Typography>
                              <Chip 
                                label={product.category}
                                size="small"
                                color="primary"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>

              {/* Aktionen */}
              <Box 
                sx={{ 
                  mt: 4, 
                  pt: 3, 
                  borderTop: 1, 
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<BackIcon />}
                  onClick={() => navigate('/')}
                  size="large"
                  sx={{ borderRadius: 2 }}
                >
                  Zurück zur Startseite
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default BookingSuccess; 