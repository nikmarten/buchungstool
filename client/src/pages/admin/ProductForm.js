import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const CATEGORIES = ['Kameras', 'Objektive', 'Stative', 'Beleuchtung', 'Audio', 'Zubehör'];

const ProductForm = ({ showAlert, editProduct = null, onEditComplete = null }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    features: [''],
    specs: [{ key: '', value: '' }],
    images: ['']
  });

  useEffect(() => {
    if (editProduct) {
      const formattedProduct = {
        ...editProduct,
        features: editProduct.features?.length ? editProduct.features : [''],
        specs: editProduct.specs?.length ? editProduct.specs : [{ key: '', value: '' }],
        images: editProduct.images?.length ? editProduct.images : ['']
      };
      setProduct(formattedProduct);
    }
  }, [editProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      if (response.ok) {
        showAlert('Produkt erfolgreich hinzugefügt');
        resetForm();
      } else {
        const error = await response.json();
        showAlert(error.message || 'Fehler beim Hinzufügen des Produkts', 'error');
      }
    } catch (error) {
      showAlert('Netzwerkfehler', 'error');
    }
  };

  const resetForm = () => {
    setProduct({
      name: '',
      description: '',
      category: '',
      brand: '',
      features: [''],
      specs: [{ key: '', value: '' }],
      images: ['']
    });
  };

  // Array-Felder verwalten (Features, Bilder, Specs)
  const handleArrayChange = (field, index, value) => {
    const newArray = [...product[field]];
    newArray[index] = value;
    setProduct({ ...product, [field]: newArray });
  };

  const addArrayField = (field) => {
    setProduct({ 
      ...product, 
      [field]: [...product[field], field === 'specs' ? { key: '', value: '' } : '']
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = product[field].filter((_, i) => i !== index);
    setProduct({ ...product, [field]: newArray });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Produktname"
            value={product.name || ''}
            onChange={(e) => setProduct({...product, name: e.target.value})}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            select
            label="Kategorie"
            value={product.category || ''}
            onChange={(e) => setProduct({...product, category: e.target.value})}
          >
            {CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Marke"
            value={product.brand || ''}
            onChange={(e) => setProduct({...product, brand: e.target.value})}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Beschreibung"
            value={product.description || ''}
            onChange={(e) => setProduct({...product, description: e.target.value})}
          />
        </Grid>

        {/* Features */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          {product.features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 1 }}>
              <TextField
                fullWidth
                label={`Feature ${index + 1}`}
                value={feature || ''}
                onChange={(e) => handleArrayChange('features', index, e.target.value)}
              />
              <IconButton 
                color="error" 
                onClick={() => removeArrayField('features', index)}
                disabled={product.features.length === 1}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Button 
            startIcon={<AddIcon />}
            onClick={() => addArrayField('features')}
          >
            Feature hinzufügen
          </Button>
        </Grid>

        {/* Bilder-URLs */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Bilder
          </Typography>
          {product.images.map((image, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 1 }}>
              <TextField
                fullWidth
                label={`Bild-URL ${index + 1}`}
                value={image || ''}
                onChange={(e) => handleArrayChange('images', index, e.target.value)}
              />
              <IconButton 
                color="error" 
                onClick={() => removeArrayField('images', index)}
                disabled={product.images.length === 1}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Button 
            startIcon={<AddIcon />}
            onClick={() => addArrayField('images')}
          >
            Bild hinzufügen
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            fullWidth
          >
            {editProduct ? 'Änderungen speichern' : 'Produkt speichern'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm; 