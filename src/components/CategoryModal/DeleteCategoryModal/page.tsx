"use client";
import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { deleteCategory } from '../../../api/api';
import Alert from '@mui/material/Alert';

const DeleteCategoryModal = ({ open, onClose, categoryId, onDeleteSuccess }) => {
  const [error, setError] = useState(''); // State for error message
  const [showModal, setShowModal] = useState(open); // Boolean state to control the modal

  useEffect(() => {
    // Reset the modal state whenever it opens
    if (open) {
      setError(''); // Clear any previous error messages
      setShowModal(true); // Ensure modal is shown
    } else {
      setShowModal(false); // Ensure modal is hidden
    }
  }, [open]);

  const handleDelete = async () => {
    try {
      await deleteCategory(categoryId);
      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Category cannot be deleted because it is assigned to one or more products.'); // Set error message
    }
  };

  return (
    <Modal
      open={showModal}
      onClose={onClose}
      aria-labelledby="delete-category-modal-title"
      aria-describedby="delete-category-modal-description"
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
        <Typography id="delete-category-modal-title" variant="h6" component="h2">
          Confirm Delete
        </Typography>
        <Typography id="delete-category-modal-description" sx={{ mt: 2 }}>
          Are you sure you want to delete this category?
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Yes, Delete
          </Button>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteCategoryModal;
