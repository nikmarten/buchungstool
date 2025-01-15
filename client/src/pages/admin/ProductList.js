import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import ProductForm from './ProductForm';

// Temporäre Demo-Produkte
const DEMO_PRODUCTS = [
  {
    id: 1,
    name: 'Sony A7 III',
    description: 'Vollformat-Systemkamera',
    category: 'Kameras',
    brand: 'Sony',
    dailyRate: 45,
    deposit: 500,
    available: true
  },
  {
    id: 2,
    name: 'Canon EF 24-70mm f/2.8L II USM',
    description: 'Professionelles Standardzoom-Objektiv',
    category: 'Objektive',
    brand: 'Canon',
    dailyRate: 35,
    deposit: 400,
    available: true
  },
  {
    id: 3,
    name: 'DJI Ronin-S',
    description: '3-Achsen-Gimbal',
    category: 'Stative',
    brand: 'DJI',
    dailyRate: 30,
    deposit: 300,
    available: false
  }
];

const ProductList = ({ showAlert }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: null });
  const [editDialog, setEditDialog] = useState({ open: false, product: null });

  // Produkte laden
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        showAlert('Fehler beim Laden der Produkte', 'error');
      }
    } catch (error) {
      showAlert('Netzwerkfehler', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setProducts(products.filter(product => product._id !== id));
        showAlert('Produkt erfolgreich gelöscht');
      } else {
        showAlert('Fehler beim Löschen des Produkts', 'error');
      }
    } catch (error) {
      showAlert('Netzwerkfehler', 'error');
    }
    setDeleteDialog({ open: false, productId: null });
  };

  const handleEdit = (product) => {
    setEditDialog({ open: true, product: product });
  };

  const handleEditComplete = async () => {
    setEditDialog({ open: false, product: null });
    await fetchProducts(); // Liste neu laden
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Kategorie</TableCell>
              <TableCell>Marke</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell align="center">
                  {product.available ? 'Verfügbar' : 'Verliehen'}
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => window.open(`/products/${product._id}`, '_blank')}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton 
                    color="primary"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => setDeleteDialog({ 
                      open: true, 
                      productId: product._id 
                    })}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Lösch-Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, productId: null })}
      >
        <DialogTitle>Produkt löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Möchten Sie dieses Produkt wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, productId: null })}
          >
            Abbrechen
          </Button>
          <Button 
            onClick={() => handleDelete(deleteDialog.productId)} 
            color="error"
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit-Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, product: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Produkt bearbeiten</DialogTitle>
        <DialogContent>
          {editDialog.product && (
            <ProductForm 
              editProduct={editDialog.product}
              onEditComplete={handleEditComplete}
              showAlert={showAlert}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductList; 