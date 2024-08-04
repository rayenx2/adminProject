import React, { useState, useContext, useEffect } from 'react';
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
import { createProduct, findAllCategories } from '../../api/api'; // Adjust the import path
import { CategoryContext } from '../../components/Context/CategoryContext';
import CheckboxTwo from '../Checkboxes/CheckboxTwo';

const ProductModal = ({ show, onClose, reloadItems }) => {
  const { category, setCategory } = useContext(CategoryContext);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    categoryId: '',
    image: '',
    instantDelivery: false,
  });
  const [error, setError] = useState('');

  const handleFormChange = (field, e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = {
        ...formData,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
      };

      if (!cleanedData.categoryId) {
        setError('Category is required.');
        return;
      }

      await createProduct(cleanedData);
      onClose(); // Close the modal after successful creation
      reloadItems(); // Refresh products list
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Failed to create product:', error.response.data.message);
      } else {
        console.error('Failed to create product:', error.message);
      }
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  useEffect(() => {
    if (show) {
      findAllCategories()
        .then((data) => {
          setCategory(data);
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
        });
    }
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <Modal
      open={show}
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
          Add New Product
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
              type="number"
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
              {category.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
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
           <CheckboxTwo
              isChecked={formData.instantDelivery}
              onChange={(value) => handleCheckboxChange('instantDelivery', value)}
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
              Add Product
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

export default ProductModal;
