import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const DeleteOrderModal = ({ open, onClose, onDelete }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-order-modal-title"
      aria-describedby="delete-order-modal-description"
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
        <Typography id="delete-order-modal-title" variant="h6" component="h2">
          Confirm Delete
        </Typography>
        <Typography id="delete-order-modal-description" sx={{ mt: 2 }}>
          Are you sure you want to delete this order?
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="error" onClick={onDelete}>
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

export default DeleteOrderModal;
