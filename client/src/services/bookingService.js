const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler beim Erstellen der Buchung');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  checkAvailability: async (productId, startDate, endDate) => {
    try {
      const response = await fetch(`${API_URL}/bookings/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          startDate,
          endDate
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Prüfen der Verfügbarkeit');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getUserBookings: async () => {
    try {
      const response = await fetch(`${API_URL}/bookings/user`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Buchungen');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

export default bookingService; 