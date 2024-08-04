import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const ViewOrderModal = ({ open, onClose, order }) => {
  // Default to an empty object if order is null
  const safeOrder = order || {};

  console.log('Order', safeOrder);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="view-order-modal-title"
      aria-describedby="view-order-modal-description"
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
        <Typography id="view-order-modal-title" variant="h6" component="h2">
          Order Details
        </Typography>
        <Typography id="view-order-modal-description" sx={{ mt: 2 }}>
          <strong>Email:</strong> {safeOrder.email || 'N/A'}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>User Name:</strong> {safeOrder.userName || 'N/A'}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Amount:</strong> {safeOrder.amount ? safeOrder.amount.toLocaleString('en-US') : 'N/A'}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Status:</strong> {safeOrder.status || 'Pending'}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Delivery Address:</strong> {safeOrder.deliveryAddress || 'N/A'}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <strong>Products:</strong>
          {Array.isArray(safeOrder.orderProducts) ? (
            <ul>
              {safeOrder.orderProducts.map((orderProduct, index) => (
                <li key={index}>
                  {orderProduct.product.title} (Quantity: {orderProduct.quantity})
                </li>
              ))}
            </ul>
          ) : (
            'No products'
          )}
        </Box>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewOrderModal;
