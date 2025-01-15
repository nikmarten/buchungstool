import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  TablePagination
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Fehler beim Laden der Buchungen');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBooking._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Fehler beim Löschen');

      setBookings(bookings.filter(booking => booking._id !== selectedBooking._id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  const handleDetailsClick = (booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Buchungen verwalten
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kunde</TableCell>
              <TableCell>Zeitraum</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((booking) => (
                <TableRow 
                  key={booking._id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'action.hover' 
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {booking.customerInfo.firstName[0]}
                        {booking.customerInfo.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {booking.customerInfo.firstName} {booking.customerInfo.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.customerInfo.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DateIcon color="action" fontSize="small" />
                      <Box>
                        <Typography variant="body2">
                          {format(new Date(booking.startDate), 'dd.MM.yyyy')}
                        </Typography>
                        <Typography variant="body2">
                          {format(new Date(booking.endDate), 'dd.MM.yyyy')}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label="Aktiv"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleDetailsClick(booking)}
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <InfoIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteClick(booking)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={bookings.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Zeilen pro Seite:"
        />
      </TableContainer>

      {/* Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Buchungsdetails
        </DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <PersonIcon color="primary" />
                      <Typography variant="h6">
                        Kundeninformationen
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1">
                          {selectedBooking.customerInfo.firstName} {selectedBooking.customerInfo.lastName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          E-Mail
                        </Typography>
                        <Typography variant="body1">
                          {selectedBooking.customerInfo.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Telefon
                        </Typography>
                        <Typography variant="body1">
                          {selectedBooking.customerInfo.phone}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <DateIcon color="primary" />
                      <Typography variant="h6">
                        Zeitraum
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Von
                        </Typography>
                        <Typography variant="body1">
                          {format(new Date(selectedBooking.startDate), 'dd. MMMM yyyy', { locale: de })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Bis
                        </Typography>
                        <Typography variant="body1">
                          {format(new Date(selectedBooking.endDate), 'dd. MMMM yyyy', { locale: de })}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <InventoryIcon color="primary" />
                      <Typography variant="h6">
                        Gebuchte Produkte
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {selectedBooking.products.map((product) => (
                        <Grid item xs={12} key={product._id}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            p: 2,
                            bgcolor: 'grey.50',
                            borderRadius: 1
                          }}>
                            <Avatar 
                              variant="rounded" 
                              src={product.imageUrl}
                              sx={{ width: 48, height: 48 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">
                                {product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {product.category}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            Schließen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Buchung löschen
        </DialogTitle>
        <DialogContent>
          <Typography>
            Möchten Sie die Buchung von {selectedBooking?.customerInfo.firstName} {selectedBooking?.customerInfo.lastName} wirklich löschen?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingManager; 