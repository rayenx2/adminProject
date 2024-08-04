import axios from 'axios';


const API_URL = 'http://localhost:3002'; 
const axiosClient = axios.create({
  baseURL: API_URL, // Adjust to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createProduct = async (productData) => {
  try {
    const response = await axiosClient.post('/products', productData);
    console.log('Product created:', response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Error creating product:', error.response.data.message);
      throw new Error(error.response.data.message); // Rethrow the error with the server-side message
    } else {
      console.error('Error creating product:', error.message);
      throw new Error('Failed to create product. Please try again later.'); // Handle generic error
    }
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axiosClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axiosClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

// export const createProduct = async (productData) => {
//   try {
//     const response = await axiosClient.post('/products', productData);
//     console.log('Product created:', response.data);
//     return response.data;
//   } catch (error) {
//     if (error.response && error.response.data) {
//       console.error('Error creating product:', error.response.data.message);
//       throw new Error(error.response.data.message); // Rethrow the error with the server-side message
//     } else {
//       console.error('Error creating product:', error.message);
//       throw new Error('Failed to create product. Please try again later.'); // Handle generic error
//     }
//   }
// };

// export const updateProduct = async (productId, updatedProductData) => {
//   try {
//     const response = await axiosClient.patch(`/products/${productId}`, updatedProductData);
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating product with ID ${productId}:`, error);
//     throw error;
//   }
// };

export const updateProduct = async (productId, updatedProductData) => {
    
    try {
      const response = await axiosClient.patch(`/products/${productId}`, updatedProductData);
      
      return response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${productId}:`, error);
      throw error;
    }
  };

export const deleteProduct = async (productId) => {
  try {
    const response = await axiosClient.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axiosClient.get('/orders'); // Adjust the URL as needed
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};


export const findAllCategories = async () => {
  try {
    const response = await axiosClient.get('/categories');
    return response.data; // Assuming the response.data is an array of categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories. Please try again later.');
  }
};


export const updateCategory = async (id, updateCategoryDto) => {
  try {
    const response = await axiosClient.patch(`/categories/${id}`, updateCategoryDto);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category. Please try again later.');
  }
};


export const createCategory = async (categoryData) => {
  try {
    const response = await axiosClient.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category. Please try again later.');
  }
};



export const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosClient.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category. Please try again later.');
  }
};


export const getSumOfAllOrders = async () => {
  try {
    const response = await axiosClient.get('/statistics/sum-of-all-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching sum of all orders:', error);
    throw error;
  }
};



export const getProductsOrderedByMostSold = async () => {
  try {
    const response = await axiosClient.get('/statistics/products-ordered-by-most-sold');
    return response.data;
  } catch (error) {
    console.error('Error fetching products ordered by most sold:', error);
    throw error;
  }
};


export const getCategoriesOrderedByMostSold = async () => {
  try {
    const response = await axiosClient.get('/statistics/categories-ordered-by-most-sold');
    
    return response.data;
  } catch (error) {
    console.error('Error fetching categories ordered by most sold:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axiosClient.delete(`/orders/${orderId}`);
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order with ID ${orderId}:`, error);
    throw new Error('Failed to delete order. Please try again later.');
  }
};

export const updateOrderStatus = async (orderId, updatedStatus) => {
  console.log(updatedStatus);
  try {
    console.log(orderId, updatedStatus);
    const response = await axiosClient.patch(`/orders/${orderId}/status`, {
      status: updatedStatus,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating order with ID ${orderId}:`, error);
    throw error;
  }
};


// export const getProductByPrice = async (pricePrefix) => {
//   try {
//     // Convert the pricePrefix to a number, if it's not already
//     const numericPrefix = Number(pricePrefix);
    
//     if (isNaN(numericPrefix)) {
//       throw new Error('Invalid price prefix');
//     }
    
//     // Make the API request with the numericPrefix
//     const response = await axiosClient.get(`/products/price/${numericPrefix}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching products by price prefix ${pricePrefix}:`, error);
//     throw error;
//   }
// };



export const getProductByPrice = async (price) => {
  try {
    const response = await axiosClient.get(`/products/price/${price}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products by price ${price}:`, error);
    throw error;
  }
};

export const getProductByTitle = async (title) => {
  try {
    const response = await axiosClient.get(`/products/title/${title}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products by title "${title}":`, error);
    throw error;
  }
};

export const getProductByCategory = async (categoryId) => {
  try {
    const response = await axiosClient.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products by category ID ${categoryId}:`, error);
    throw error;
  }
};



export const getOrdersByUserName = async (userName) => {
  try {
    const response = await axiosClient.get(`/orders/user/${userName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders by user name "${userName}":`, error);
    throw error;
  }
};

export const getOrdersByAmount = async (amount) => {
  try {
    const response = await axiosClient.get(`/orders/amount/${amount}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders by amount ${amount}:`, error);
    throw error;
  }
};

export const getOrdersByStatus = async (status) => {
  try {
    const response = await axiosClient.get(`/orders/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders by status "${status}":`, error);
    throw error;
  }
};

export const getCategoryByName= async (name) => {

  try {
    const response = await axiosClient.get(`/categories/name/${name}`);
    return response.data;
    
  } catch (error) {
    console.error(`Error fetching category by name "${name}":`, error);
    throw error;
    
  }
}


export const checkCategoryUnused = async (categoryId) => {
  try {
    const response = await axiosClient.get(`/products/category/${categoryId}/check-unused`);
    return response.data.unused;
  } catch (error) {
    console.error('Error checking if category is unused:', error);
    throw new Error('Failed to check category. Please try again later.');
  }
};



export const getProductsOrderedByMostSoldByWeek = async () => {
  try {
    const response = await axiosClient.get('/statistics/products-ordered-by-most-sold-by-week');
    return response.data;
  } catch (error) {
    console.error('Error fetching products ordered by most sold by week:', error);
    throw error;
  }
};


export const getProductsOrderedByMostSoldByMonth = async () => {
  try {
    const response = await axiosClient.get('/statistics/products-ordered-by-most-sold-by-month');
    return response.data;
  } catch (error) {
    console.error('Error fetching products ordered by most sold by month:', error);
    throw error;
  }
};


export const getSumOfAllOrdersByWeek = async () => {
  try {
    const response = await axiosClient.get('/statistics/sum-by-week');
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly order sum:', error);
    throw error;
  }
};

export const getSumOfAllOrdersByMonth  = async () => {
  try {
    const response = await axiosClient.get('/statistics/sum-by-month');
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly order sum:', error);
    throw error;
  }
};

export const updateProductQuantity = async (orderId, productId, quantity) => {
  try {
    // Convert quantity from string to number
    const parsedQuantity = parseInt(quantity, 10);

    // Check if parsedQuantity is a valid number
    if (isNaN(parsedQuantity)) {
      throw new Error('Invalid quantity provided');
    }

    // Send the PATCH request with the converted quantity
    const response = await axiosClient.patch(`/orders/${orderId}/product/${productId}/quantity`, {
      quantity: parsedQuantity,
    });

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating product quantity:', error);
    throw error;
  }
};


export const updateProductInOrder = async (orderId, oldProductId, newProductId) => {
  try {
    const response = await axiosClient.patch(`/orders/${orderId}/product`, {
      oldProductId,
      newProductId,
    });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating product in order:', error);
    throw error;
  }
};


export const deleteOrderProduct = async (orderId, productId) => {
  try {
    const response = await axiosClient.delete(`/orders/${orderId}/products/${productId}`);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting order product:', error);
    throw error;
  }
}