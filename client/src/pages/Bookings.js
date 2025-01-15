import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

const Bookings = () => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Meine Buchungen
        </Typography>
        {/* Buchungsliste wird hier eingefügt */}
      </Paper>
    </Container>
  );
};

export default Bookings; 