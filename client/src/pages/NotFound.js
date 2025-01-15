import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Fade
} from '@mui/material';
import {
  SentimentVeryDissatisfied as SadIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={3}
          sx={{
            textAlign: 'center',
            p: 4,
            borderRadius: 3,
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background elements */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              bgcolor: 'primary.main'
            }}
          />
          
          <SadIcon 
            sx={{ 
              fontSize: 80, 
              color: 'primary.main',
              mb: 2
            }} 
          />

          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: '6rem',
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2
            }}
          >
            404
          </Typography>

          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              fontWeight: 'medium',
              mb: 1
            }}
          >
            Seite nicht gefunden
          </Typography>

          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Diese Seite existiert leider nicht oder wurde verschoben.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Zur Startseite
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={() => navigate(-1)}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Zurück
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default NotFound; 