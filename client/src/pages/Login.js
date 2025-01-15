import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined as LockIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (!response.ok) {
        throw new Error('Login fehlgeschlagen');
      }

      const data = await response.json();
      if (data.isAdmin) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Zeigen Sie dem Benutzer eine Fehlermeldung
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Fade in={true}>
        <Paper 
          elevation={3}
          sx={{ 
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              p: 3,
              bgcolor: 'primary.main',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <LockIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" component="h1">
              Admin Login
            </Typography>
          </Box>

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <TextField
              name="username"
              label="Benutzername"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              name="password"
              label="Passwort"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {error && (
              <Alert 
                severity="error" 
                variant="filled"
                sx={{ 
                  borderRadius: 2,
                  alignItems: 'center'
                }}
              >
                {error}
              </Alert>
            )}
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                py: 1.5,
                mt: 2,
                borderRadius: 2,
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: 'primary.light',
                    position: 'absolute'
                  }} 
                />
              ) : (
                'Anmelden'
              )}
            </Button>

            <Typography 
              variant="body2" 
              color="text.secondary"
              align="center"
            >
              Nur für autorisierte Mitarbeiter
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default Login; 