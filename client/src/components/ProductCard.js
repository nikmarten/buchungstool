import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Fade
} from '@mui/material';
import { PhotoCamera, CheckCircle, Error } from '@mui/icons-material';

const ProductCard = ({ product, available, onAddToCart, bookingDates }) => {
  return (
    <Fade in={true} timeout={500}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-8px)',
            '& .MuiCardMedia-root': {
              transform: 'scale(1.05)',
            },
          },
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {/* Kategorie-Chip */}
        <Chip
          label={product.category}
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: -12,
            right: 16,
            zIndex: 1,
          }}
        />

        {/* Produktbild */}
        <Box sx={{ position: 'relative', p: 2, backgroundColor: 'grey.50' }}>
          <CardMedia
            component="img"
            height="200"
            image={product.imageUrl}
            alt={product.name}
            sx={{
              objectFit: 'contain',
              borderRadius: 1,
              transition: 'transform 0.3s ease-in-out',
            }}
          />
          {!available && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="h6"
                color="white"
                sx={{ textAlign: 'center' }}
              >
                Nicht verfügbar
              </Typography>
            </Box>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Produktname */}
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <PhotoCamera fontSize="small" color="primary" />
            {product.name}
          </Typography>

          {/* Beschreibung */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2, flexGrow: 1 }}
          >
            {product.description}
          </Typography>

          {/* Verfügbarkeitsstatus */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {available ? (
              <>
                <CheckCircle fontSize="small" color="success" />
                <Typography variant="body2" color="success.main">
                  Verfügbar
                </Typography>
              </>
            ) : (
              <>
                <Error fontSize="small" color="error" />
                <Typography variant="body2" color="error">
                  Nicht verfügbar
                </Typography>
              </>
            )}
          </Box>

          {/* Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => onAddToCart(product)}
            disabled={!available || !bookingDates.startDate || !bookingDates.endDate}
            color={available ? 'primary' : 'error'}
            sx={{
              mt: 'auto',
              py: 1.5,
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:not(:disabled):hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            {!bookingDates.startDate || !bookingDates.endDate 
              ? 'Zeitraum wählen'
              : available 
                ? 'In den Warenkorb' 
                : 'Nicht verfügbar'}
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default ProductCard; 