import React, { useState, useEffect, useContext } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { MdOutlineDoneOutline } from 'react-icons/md';
import { CategoryContext } from "../../Context/CategoryContext";

const UpdateProductModal = ({ open, onClose, product, categories, onSubmit }) => {
  const { category, setCategory } = useContext(CategoryContext);
  const [formData, setFormData] = useState({
    id: product.id || '',
    title: product.title || '',
    price: product.price || '',
    description: product.description || '',
    categoryId: product.category.id || '',
    image: product.image || '',
    instantDelivery: product.instantDelivery || false,
  });

  const handleFormChange = (field, e) => {
    const value = e.target.value;
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Call the submit handler passed as a prop
    onClose(); // Close modal after submitting
  };

  useEffect(() => {
    console.log('form data', formData); 
  }, [formData]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="product-form-modal-title"
      aria-describedby="product-form-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="product-form-modal-title" variant="h6" component="h2">
          {product ? 'Edit Product' : 'Add New Product'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={formData.title}
              onChange={(e) => handleFormChange('title', e)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              value={formData.price}
              onChange={(e) => handleFormChange('price', e)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={formData.description}
              onChange={(e) => handleFormChange('description', e)}
              sx={{ mb: 2 }}
            />
            <Select
              label="Category Name"
              value={formData.categoryId}
              onChange={(e) => handleFormChange('categoryId', e)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="">Select a category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Image URL"
              variant="outlined"
              fullWidth
              value={formData.image}
              onChange={(e) => handleFormChange('image', e)}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.instantDelivery}
                  onChange={(e) => handleFormChange('instantDelivery', e)}
                />
              }
              label="Instant Delivery"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<MdOutlineDoneOutline />}
              sx={{ mr: 2 }}
            >
              {product ? 'Update Product' : 'Add Product'}
            </Button>
            <Button
              variant="contained"
              onClick={onClose}
            >
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateProductModal;
