import React from 'react';
import { 
  Paper, 
  Typography, 
  Grid, 
  Button 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useCart } from '../context/CartContext';
import { addDays } from 'date-fns';

const DateSelector = () => {
  const { bookingDates, setDates } = useCart();

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Zeitraum auswählen
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5}>
          <DatePicker
            label="Von"
            value={bookingDates.startDate}
            onChange={(newDate) => setDates(newDate, bookingDates.endDate)}
            minDate={new Date()}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <DatePicker
            label="Bis"
            value={bookingDates.endDate}
            onChange={(newDate) => setDates(bookingDates.startDate, newDate)}
            minDate={bookingDates.startDate ? addDays(bookingDates.startDate, 1) : new Date()}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DateSelector; 