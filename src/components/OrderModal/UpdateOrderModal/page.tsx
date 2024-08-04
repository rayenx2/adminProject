import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { updateOrderStatus, updateProductQuantity, deleteOrderProduct } from '../../../api/api';
import DeleteOrderProductModal from '../DeleteOrderProductModal/page'; // Adjust the import path

const StatusUpdateModal = ({ open, onClose, order, onUpdateStatus, onReloadOrders }) => {
  const [newStatus, setNewStatus] = useState(order.status || 'pending');
  const [products, setProducts] = useState([]);
  const [amount, setAmount] = useState(order.amount || 0);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    if (order?.status) {
      setNewStatus(order.status);
    }
    if (order?.orderProducts) {
      setProducts(order.orderProducts.map(p => ({ ...p, quantity: p.quantity })));
    }
    if (order?.amount) {
      setAmount(order.amount);
    }
  }, [order]);

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      onUpdateStatus(order.id, newStatus);
      onReloadOrders();
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (product) => {
    try {
      if (product.product.id && product.quantity) {
        await updateProductQuantity(order.id, product.product.id, product.quantity);
      } else {
        console.error('Product ID and quantity are required');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (productToDelete) {
        const updatedOrder = await deleteOrderProduct(order.id, productToDelete.product.id);
        const updatedProducts = products.filter(product => product.product.id !== productToDelete.product.id);
        setProducts(updatedProducts);
        setAmount(updatedOrder.amount);

        onReloadOrders();
        handleCloseDeleteModal();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateAll = async () => {
    setLoading(true);
    try {
      await handleUpdateStatus();
      for (const product of products) {
        await handleUpdateQuantity(product);
      }
      onReloadOrders();
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="status-update-modal-title" aria-describedby="status-update-modal-description">
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
          <Typography id="status-update-modal-title" variant="h6" component="h2">
            Update Order Details
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Select New Status:
            </Typography>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="not_delivered">Not Delivered</MenuItem>
            </Select>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Update Products:
            </Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {products.map((product, index) => (
                <React.Fragment key={product.product.id}>
                  <ListItem alignItems="flex-start">
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TextField
                          disabled
                          id={`product-title-${product.product.id}`}
                          label="Product Title"
                          value={product.product.title}
                          variant="outlined"
                          fullWidth
                        />
                        <DeleteForeverIcon
                          sx={{ ml: 2, cursor: 'pointer' }}
                          onClick={() => handleOpenDeleteModal(product)}
                        />
                      </Box>
                      <TextField
                        label="Quantity"
                        type="number"
                        value={product.quantity}
                        onChange={(e) => {
                          const newProducts = [...products];
                          newProducts[index].quantity = e.target.value;
                          setProducts(newProducts);
                        }}
                        fullWidth
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </ListItem>
                  {index < products.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Total Amount: ${amount.toFixed(2)}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleUpdateAll} disabled={loading} fullWidth>
              Update
            </Button>
            <Button variant="contained" onClick={onClose} fullWidth sx={{ mt: 1 }}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {productToDelete && (
        <DeleteOrderProductModal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteProduct}
        />
      )}
    </>
  );
};

export default StatusUpdateModal;
