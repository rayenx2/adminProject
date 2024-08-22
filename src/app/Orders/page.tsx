"use client"
import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OrderModal from '../../components/OrderModal/page';
import DeleteOrderModal from '../../components/OrderModal/DeleteOrderModal/page';
import ViewOrderModal from '../../components/OrderModal/ViewOrderModal/page';
import StatusUpdateModal from '../../components/OrderModal/UpdateOrderModal/page'; // Import the new StatusUpdateModal
import { getOrders, getOrdersByUserName, getOrdersByAmount, getOrdersByStatus, deleteOrder } from '../../api/api';
import TextField from '@mui/material/TextField';
import { useDebounce } from 'use-debounce';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

const columns = [
  { id: 'email', label: 'Email', minWidth: 150 },
  { id: 'userName', label: 'User Name', minWidth: 150 },
  { id: 'amount', label: 'Amount', minWidth: 100, align: 'right', format: (value) => value.toLocaleString('en-US') },
  { id: 'products', label: 'Products', minWidth: 200 },
  { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 100, align: 'center' },
];

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [statusUpdateModalOpen, setStatusUpdateModalOpen] = useState(false); // State for status update modal
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('userName');
  const [noResults, setNoResults] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm, searchType]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSearch = async () => {
    if (!debouncedSearchTerm) {
      fetchOrders();
      return;
    }

    let data;
    try {
      if (searchType === 'userName') {
        data = await getOrdersByUserName(debouncedSearchTerm);
      } else if (searchType === 'amount') {
        const parsedAmount = parseInt(debouncedSearchTerm);
        if (isNaN(parsedAmount)) {
          throw new Error('Amount must be a number');
        }
        data = await getOrdersByAmount(parsedAmount);
      } else if (searchType === 'status') {
        data = await getOrdersByStatus(debouncedSearchTerm);
      }

      if (data.length > 0) {
        setOrders(data);
        setNoResults(false);
      } else {
        setNoResults(true);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error searching orders:', error);
      setNoResults(true);
      setOrders([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    fetchOrders();
  };

  const handleOpenDeleteModal = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(orderToDelete.id);
      setDeleteModalOpen(false);
      setOrderToDelete(null);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleOpenViewModal = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOpenStatusUpdateModal = (order) => {
    setSelectedOrder(order);
    setStatusUpdateModalOpen(true);
  };

  const handleCloseStatusUpdateModal = () => {
    setStatusUpdateModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  
  

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Orders" />
    <div>
      <h1>Orders</h1>
      <br />
      <div>
        <TextField
          label="Search Orders"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: 16 }}
        />

        <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
          <InputLabel id="search-type-label">Search Type</InputLabel>
          <Select
            labelId="search-type-label"
            id="search-type"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            label="Search Type"
          >
            <MenuItem value="userName">User Name</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
        <br />
        <br />
        <br />
        {noResults && searchTerm && <p>No results found.</p>}
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={order.id}>
                  {columns.map((column) => {
                    const value = order[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'status' ? (
                          <span style={{ color: getStatusColor(value) }}>{getStatusText(value)}</span>
                        ) : column.id === 'products' ? (
                          order.orderProducts && order.orderProducts.length > 0 ? (
                            order.orderProducts.map((product) => {
                              return product.product.title;
                            }).join(', ')
                          ) : (
                            'No products'
                          )
                        ) : column.id === 'action' ? (
                          <>
                            <IconButton
                              color="primary"
                              style={{ marginRight: 8 }}
                              onClick={() => handleOpenViewModal(order)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              color="success"
                              style={{ marginRight: 8 }}
                              onClick={() => handleOpenStatusUpdateModal(order)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleOpenDeleteModal(order)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        ) : column.format && typeof value === 'number' ? (
                          column.format(value)
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {showModal && (
          <OrderModal
            order={selectedOrder}
            onClose={handleCloseModal}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
        {deleteModalOpen && (
          <DeleteOrderModal
            open={deleteModalOpen}
            onClose={handleCloseDeleteModal}
            onDelete={handleDeleteOrder}
          />
        )}
        {viewModalOpen && (
          <ViewOrderModal
            open={viewModalOpen}
            onClose={handleCloseViewModal}
            order={selectedOrder}
          />
        )}
        {statusUpdateModalOpen && (
          <StatusUpdateModal
            open={statusUpdateModalOpen}
            onClose={handleCloseStatusUpdateModal}
            order={selectedOrder}
            onUpdateStatus={handleUpdateStatus}
            onReloadOrders={fetchOrders}
          />
        )}
      </Paper>
    </div>
    </DefaultLayout>
  );
};

// Helper function to get status text based on delivery status
const getStatusText = (deliveryStatus) => {
  if (deliveryStatus === 'delivered') {
    return 'Delivered';
  } else if (deliveryStatus === 'pending') {
    return 'Pending';
  } else {
    return 'Not Delivered';
  }
};

// Helper function to get status color based on delivery status
const getStatusColor = (deliveryStatus) => {
  if (deliveryStatus === 'delivered') {
    return 'green';
  } else if (deliveryStatus === 'pending') {
    return 'orange';
  } else {
    return 'red';
  }
};

export default Order;