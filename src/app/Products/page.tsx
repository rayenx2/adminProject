"use client";
import React, { useContext, useEffect, useState } from 'react';
import {
  getAllProducts,
  deleteProduct,
  findAllCategories,
  getProductByCategory,
  getProductByPrice,
  getProductByTitle,
  updateProduct
} from '../../api/api'; // Adjust import path as per your project structure
import ProductModal from '../../components/ProductModal/page';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CategoryContext } from '../../components/Context/CategoryContext';
import TextField from '@mui/material/TextField';
import { useDebounce } from 'use-debounce';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import UpdateProductModal from '../../components/ProductModal/UpdateProductModal/page'; // Adjust import path as needed
import DeleteProductModal from '../../components/ProductModal/DeleteProductModal/page'; // Adjust import path as needed
import ProductViewModal from '../../components/ProductModal/ViewProductModal/page'; // Adjust import path as needed
import IconButton from '@mui/material/IconButton'; // Import IconButton
import Button from '@mui/material/Button'; // Import Button
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';




const columns = [
  { id: 'title', label: 'Title', minWidth: 150 },
  { id: 'price', label: 'Price', minWidth: 100, align: 'right', format: (value) => value.toLocaleString('en-US') },
  { id: 'description', label: 'description', minWidth: 150 },
  { id: 'category', label: 'Category', minWidth: 150 },
  { id: 'image', label: 'Image', minWidth: 100 },
  { id: 'instantDelivery', label: 'Instant Delivery', minWidth: 150 },
  { id: 'action', label: 'Action', minWidth: 150, align: 'center' },
];

const Products = () => {
  const { category, setCategory } = useContext(CategoryContext);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title'); 
  const [noResults, setNoResults] = useState(false); 
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000); // Use debounce hook
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  

  useEffect(() => {
    if (showModal || showDeleteModal || showViewModal) {
      findAllCategories()
        .then((data) => {
          setCategory(data);
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
        });
    }
  }, [showModal, showDeleteModal, showViewModal, setCategory]);


  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await updateProduct(products.id, updatedProduct); // Call your API function with item.id and updatedProduct
      console.log(updatedProduct);
      reloadItems(); // Reload items after successful update
    } catch (error) {
      console.error("Error updating product:", error);
      // Handle error state or notify user
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(products.id); // Call your API function to delete the product
      reloadItems(); // Reload items after successful deletion
      setShowDeleteModal(false); // Close the delete modal
    } catch (error) {
      console.error("Error deleting product:", error);
      // Handle error state or notify user
    }
  };

  // Function to fetch products
  const reloadItems = () => {
    getAllProducts()
      .then((data) => {
        setProducts(data);
        setNoResults(data.length === 0); // Update no results state
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };


  useEffect(() => {
    reloadItems();
  }, []);

  // Function to delete a product
  const deleteElement = (id) => {
    deleteProduct(id)
      .then((data) => {
        if (data.status === 200) {
          reloadItems(); // Refresh products after successful deletion
        }
      })
      .catch((error) => {
        console.error(`Error deleting product with ID ${id}:`, error);
      });
  };

  const handleSearch = async () => {
    if (!debouncedSearchTerm) {
      reloadItems(); // Fetch all products when search term is empty
      return;
    }

    let data;
    try {
      if (searchType === 'title') {
        data = await getProductByTitle(debouncedSearchTerm);
        if (data.length > 0) {
          console.log(data);
          setProducts(data);
          setNoResults(false);
        } else {
          setNoResults(true);
          setProducts([]);
        }
      } else if (searchType === 'price') {
        data = await getProductByPrice(parseInt(debouncedSearchTerm));
        if (data.length > 0) {
          setProducts(data);
          setNoResults(false);
        } else {
          setNoResults(true);
          setProducts([]);
        }
      } else if (searchType === 'category') {
        const categoryObj = category.find(cat => cat.name.toLowerCase() === debouncedSearchTerm.toLowerCase());
        if (categoryObj) {
          data = await getProductByCategory(categoryObj.id);
        } else {
          setNoResults(true);
          setProducts([]);
          return;
        }
      }

      if (data.length > 0) {
        setProducts(data);
        setNoResults(false);
      } else {
        setNoResults(true);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setNoResults(true); // Set no results to true in case of error
      setProducts([]);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm, searchType]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Products" />
    <div >
      <h1>Products</h1>
      <br />

      <div>
        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: 16 }}
        />

        <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
          <InputLabel id="search-type-label">Search By</InputLabel>
          <Select
            labelId="search-type-label"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            label="Search By"
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="category">Category</MenuItem>
          </Select>
        </FormControl>
      </div>

      <br />
      <br />
     
      <Button
        variant="contained"
        color="primary"
        
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setShowForm(true)}
        sx={{ mb: 2 }}
      >
        Add New Product
      </Button>

      <ProductModal show={showForm} onClose={() => setShowForm(false)} reloadItems={reloadItems} />

      <div >
      {noResults ? (
          <p>No products found with the specified {searchType}: {searchTerm}</p>
        ) : (
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
                  {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={product.id}>
                      <TableCell>{product.title}</TableCell>
                      <TableCell align="right">{product.price}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>
                        {product.category ? 
                          category.find(cat => cat.id === product.category.id)?.name || 'Unknown' : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {product.image && <img src={product.image} alt={product.image} style={{ maxWidth: 100 }} />}
                      </TableCell>
                      <TableCell>{product.instantDelivery ? 'Yes' : 'No'}</TableCell>
                      <TableCell align="center">
                        <div>
                          <IconButton onClick={() => {
                            setCurrentProduct(product);
                            setShowViewModal(true);
                          }}>
                            <VisibilityIcon color="primary" />
                          </IconButton>
                          <IconButton onClick={() => {
                            setCurrentProduct(product);
                            setShowDeleteModal(true);
                          }}>
                            <DeleteIcon color="error" />
                          </IconButton>
                          <IconButton onClick={() => {
                            setCurrentProduct(product);
                            setShowModal(true);
                          }}>
                            <EditIcon color="success" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {showModal && currentProduct && (
        <UpdateProductModal
          open={showModal}
          onClose={() => setShowModal(false)}
          product={currentProduct}
          categories={category}
          onSubmit={(formData) => {
            handleUpdateProduct(formData);
            setShowModal(false);
          }}
        />
      )}
      {showDeleteModal && (
        <DeleteProductModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteProduct}
        />
      )}
      {showViewModal && currentProduct && (
        <ProductViewModal
          open={showViewModal}
          onClose={() => setShowViewModal(false)}
          product={currentProduct}
        />
      )}
          </Paper>
        )}
      </div>
    </div>
    </DefaultLayout>
  );
};

export default Products;
