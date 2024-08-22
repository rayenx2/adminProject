"use client";
import React, { useState, useEffect, useContext } from 'react';
import { findAllCategories, getCategoryByName, deleteCategory, updateCategory, createCategory } from '../../api/api'; // Adjust import path as needed
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Import AddCircleOutlineIcon
import TextField from '@mui/material/TextField';
import { useDebounce } from 'use-debounce';
import { CategoryContext } from '../../components/Context/CategoryContext';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import DeleteCategoryModal from '../../components/CategoryModal/DeleteCategoryModal/page';
import UpdateCategoryModal from '../../components/CategoryModal/UpdateCategoryModal/page';
import AddCategoryModal from '../../components/CategoryModal/AddCategoryModal/page'; // Import the AddCategoryModal component
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box'; // Import Box for layout
import Typography from '@mui/material/Typography'; // Import Typography for text
import Button from '@mui/material/Button'; // Import Button for clickable area
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

const columns = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'action', label: 'Action', minWidth: 150, align: 'center' },
];

const Categories = () => {
  const { category, setCategory } = useContext(CategoryContext);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoriesState, setCategoriesState] = useState({
    categories: [],
    loading: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // State to manage AddCategoryModal visibility
  const [currentCategory, setCurrentCategory] = useState(null);
  const [alert, setAlert] = useState(null);

  const getData = async () => {
    try {
      setCategoriesState({ ...categoriesState, loading: true });
      const data = await findAllCategories();
      setCategoriesState({
        loading: false,
        categories: data,
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategoriesState({
        ...categoriesState,
        loading: false,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = async () => {
    if (!debouncedSearchTerm) {
      getData();
      return;
    }

    try {
      const data = await getCategoryByName(debouncedSearchTerm);
      if (data.length > 0) {
        setCategoriesState({
          ...categoriesState,
          categories: data,
          loading: false,
        });
        setNoResults(false);
      } else {
        setCategoriesState({
          ...categoriesState,
          categories: [],
          loading: false,
        });
        setNoResults(true);
      }
    } catch (error) {
      console.error('Error searching categories:', error);
      setCategoriesState({
        ...categoriesState,
        categories: [],
        loading: false,
      });
      setNoResults(true);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleUpdateCategory = async (formData) => {
    try {
      await updateCategory(currentCategory.id, formData); // Call the updateCategory API function
      getData(); // Reload the category list
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating category:', error);
      setAlert({
        severity: 'error',
        message: 'Failed to update category. Please try again.',
      });
    }
  };

  const handleDeleteCategorySuccess = async () => {
    try {
      await deleteCategory(currentCategory.id); // Call the deleteCategory API function
      getData(); // Reload the category list
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      setAlert({
        severity: 'error',
        message: 'Category cannot be deleted because it is assigned to one or more products.',
      });
    }
  };

  const handleAddCategory = async (formData) => {
    try {
      await createCategory(formData); // Call the addCategory API function
      getData(); // Reload the category list
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding category:', error);
      setAlert({
        severity: 'error',
        message: 'Failed to add category. Please try again.',
      });
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Categories" />
    <div >
      <h1 id="categories">Categories</h1>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setShowAddModal(true)}
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Add New Category
      </Button>


      <div>
        <TextField
          label="Search Categories"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: 16 }}
        />
        {noResults && searchTerm && <p>No results found.</p>}
      </div>
      {alert && (
        <Alert severity={alert.severity}>
          <AlertTitle>{alert.severity === 'error' ? 'Error' : 'Success'}</AlertTitle>
          {alert.message}
        </Alert>
      )}
      <div >
        {noResults && searchTerm ? (
          <p>No results found.</p>
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
                  {categoriesState.categories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setCurrentCategory(category);
                              setShowUpdateModal(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => {
                              setCurrentCategory(category);
                              setShowDeleteModal(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 100]}
              component="div"
              count={categoriesState.categories.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </div>
      <DeleteCategoryModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        categoryId={currentCategory ? currentCategory.id : null}
        onDeleteSuccess={handleDeleteCategorySuccess}
      />
      <UpdateCategoryModal
        open={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        category={currentCategory}
        onUpdateCategory={handleUpdateCategory}
      />
      <AddCategoryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddCategory={handleAddCategory}
      />
    </div>
    </DefaultLayout>
  );
};

export default Categories;
