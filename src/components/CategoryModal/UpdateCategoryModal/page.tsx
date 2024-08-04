"use client";
import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { updateCategory } from '../../../api/api'; // Import the updateCategory API function

const UpdateCategoryModal = ({ open, onClose, category, onUpdateCategory }) => {
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategory(category.id, formData); // Call the updateCategory API function
      onUpdateCategory(); // Call the onUpdateCategory function to refresh the category list
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating category:', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="update-category-modal-title">
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
        <Typography id="update-category-modal-title" variant="h6" component="h2">
          Update Category
        </Typography>
        <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
            <Button variant="contained" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateCategoryModal;
