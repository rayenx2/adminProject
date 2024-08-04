import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { updateOrderStatus, deleteOrder } from '../../api/api'; // Adjust import path as needed

const OrderModal = ({ order, onClose, onUpdateStatus, onDeleteOrder }) => {
  const [newStatus, setNewStatus] = useState(order.status || 'pending'); // Default to 'pending' if no status

  const handleUpdateStatus = async () => {
    console.log('Updating status...', order.id, newStatus);
    try {
      const updatedOrder = await updateOrderStatus(order.id, newStatus);
      console.log('Status updated successfully!', updatedOrder);
      onUpdateStatus(order.id, updatedOrder.status); // Update frontend state with new status
      onClose(); // Close modal after successful update
    } catch (error) {
      console.error('Error updating status:', error);
      // Handle error as per your application's needs (e.g., show error message)
    }
  };

  const handleDeleteOrder = async () => {
    console.log('Deleting order...', order.id);
    try {
      await deleteOrder(order.id);
      console.log('Order deleted successfully!');
      onDeleteOrder(order.id); // Update frontend state if necessary
      onClose(); // Close modal after successful delete
    } catch (error) {
      console.error('Error deleting order:', error);
      // Handle error as per your application's needs (e.g., show error message)
    }
  };

  const handleClose = () => {
    onClose(); // Close modal on cancel/close
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="order-modal-title"
      aria-describedby="order-modal-description"
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
        <Typography id="order-modal-description" variant="body1" gutterBottom>
          <strong>Email:</strong> {order.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>User Name:</strong> {order.userName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Amount:</strong> {order.amount.toLocaleString('en-US')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Status:</strong> {order.status || 'Pending'}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>Select New Status:</Typography>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="not_delivered">Not Delivered</option>
          </select>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdateStatus} sx={{ mr: 2 }}>
            Update Status
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteOrder}>
            Delete Order
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrderModal;