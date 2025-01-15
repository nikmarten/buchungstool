import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  Fade,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoIcon
} from '@mui/icons-material';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error('Fehler beim Laden der Produkte');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl
    });
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Fehler beim Löschen');

      setProducts(products.filter(product => product._id !== deleteId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = selectedProduct
        ? `http://localhost:5000/api/products/${selectedProduct._id}`
        : 'http://localhost:5000/api/products';

      const response = await fetch(url, {
        method: selectedProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Fehler beim Speichern');

      const data = await response.json();

      if (selectedProduct) {
        setProducts(products.map(p => 
          p._id === selectedProduct._id ? data : p
        ));
      } else {
        setProducts([...products, data]);
      }

      setDialogOpen(false);
      setSelectedProduct(null);
      setFormData({
        name: '',
        category: '',
        description: '',
        imageUrl: ''
      });
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Produkte verwalten
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedProduct(null);
            setDialogOpen(true);
          }}
          sx={{ 
            borderRadius: 2,
            px: 3
          }}
        >
          Neues Produkt
        </Button>
      </Box>

      {/* Produkt-Grid */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Fade in={true}>
              <Card 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ 
                      objectFit: 'contain',
                      p: 2,
                      backgroundColor: 'grey.50'
                    }}
                  />
                  <Chip
                    label={product.category}
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {product.description}
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1,
                    mt: 'auto'
                  }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(product)}
                      fullWidth
                      sx={{ borderRadius: 2 }}
                    >
                      Bearbeiten
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(product._id)}
                      sx={{ 
                        borderRadius: 2,
                        border: 1,
                        borderColor: 'error.main'
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Produkt-Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedProduct ? 'Produkt bearbeiten' : 'Neues Produkt'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Produktname"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="category"
                  label="Kategorie"
                  fullWidth
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Beschreibung"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="imageUrl"
                  label="Bild-URL"
                  fullWidth
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: <PhotoIcon color="action" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            color="inherit"
          >
            Abbrechen
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ px: 3 }}
          >
            {selectedProduct ? 'Speichern' : 'Erstellen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lösch-Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Produkt löschen
        </DialogTitle>
        <DialogContent>
          <Typography>
            Möchten Sie dieses Produkt wirklich löschen?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
          >
            Abbrechen
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductManager;
 