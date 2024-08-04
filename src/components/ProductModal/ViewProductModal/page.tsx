import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const ProductViewModal = ({ open, onClose, product }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 4, bgcolor: 'background.paper', margin: 'auto', mt: 5 }}>
        <Typography variant="h6" component="h2">
          {product.title}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Price: ${product.price}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Description: {product.description}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Category: {product.category.name}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Image: {product.image}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Instant Delivery: {product.instantDelivery ? 'Yes' : 'No'}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductViewModal;
