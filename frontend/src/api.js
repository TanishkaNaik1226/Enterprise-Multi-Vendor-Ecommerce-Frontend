/**
 * Central API Client for ShopStack Backend
 * Handles auth tokens, error normalization, and standard HTTP requests.
 */

const BASE_URL = ''; // Proxied via Vite config to avoid CORS & hardcoded URL issues

export const tokenStorage = {
  getToken: () => localStorage.getItem('shopstack_token'),
  setToken: (token) => localStorage.setItem('shopstack_token', token),
  clearToken: () => localStorage.removeItem('shopstack_token'),
};

async function apiRequest(endpoint, options = {}) {
  const token = tokenStorage.getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Check for 204 No Content
    if (response.status === 204) {
      return null;
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Normalise backend errors
      const errorMessage = data?.message || data?.error || response.statusText || 'An unexpected error occurred';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // --- AUTH ENDPOINTS ---
  auth: {
    login: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: credentials,
    }),
    register: (userData) => apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
    }),
    me: () => apiRequest('/auth/me', {
      method: 'GET',
    }),
  },

  // --- CUSTOMER PORTAL ---
  customer: {
    register: (customerData) => apiRequest('/api/v1/customers', {
      method: 'POST',
      body: customerData,
    }),
    getProfile: () => apiRequest('/api/v1/customers/me', {
      method: 'GET',
    }),
    getAddresses: (customerId) => apiRequest(`/api/v1/customers/${customerId}/addresses`, {
      method: 'GET',
    }),
    addAddress: (customerId, addressData) => apiRequest(`/api/v1/customers/${customerId}/addresses`, {
      method: 'POST',
      body: addressData,
    }),
  },

  // --- VENDOR PORTAL ---
  vendor: {
    register: (vendorData) => apiRequest('/api/v1/vendors', {
      method: 'POST',
      body: vendorData,
    }),
    getProfile: () => apiRequest('/api/v1/vendors/me', {
      method: 'GET',
    }),
    updateProfile: (vendorId, updateData) => apiRequest(`/api/v1/vendors/${vendorId}`, {
      method: 'PATCH',
      body: updateData,
    }),
    addAddress: (vendorId, addressData) => apiRequest(`/api/v1/vendors/${vendorId}/addresses`, {
      method: 'POST',
      body: addressData,
    }),
    addBankDetails: (vendorId, bankData) => apiRequest(`/api/v1/vendors/${vendorId}/bank-details`, {
      method: 'POST',
      body: bankData,
    }),
    uploadDocument: (vendorId, docData) => apiRequest(`/api/v1/vendors/${vendorId}/documents`, {
      method: 'POST',
      body: docData,
    }),
  },

  // --- PRODUCT & CATEGORY ENDPOINTS ---
  products: {
    browseActive: () => apiRequest('/api/products/browse', {
      method: 'GET',
    }),
    getById: (id) => apiRequest(`/api/products/${id}`, {
      method: 'GET',
    }),
    search: (keyword) => apiRequest(`/api/products/search?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
    }),
    getByCategory: (categoryId) => apiRequest(`/api/products/category/${categoryId}`, {
      method: 'GET',
    }),
    getMyProducts: () => apiRequest('/api/products/my-products', {
      method: 'GET',
    }),
    create: (productData) => apiRequest('/api/products', {
      method: 'POST',
      body: productData,
    }),
    update: (id, productData) => apiRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: productData,
    }),
    delete: (id) => apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    }),
  },

  categories: {
    listAll: () => apiRequest('/api/categories', {
      method: 'GET',
    }),
  },

  reviews: {
    getByProduct: (productId) => apiRequest(`/api/reviews/${productId}`, {
      method: 'GET',
    }),
    create: (productId, reviewData) => apiRequest(`/api/reviews/${productId}`, {
      method: 'POST',
      body: reviewData,
    }),
    delete: (reviewId) => apiRequest(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    }),
  },

  // --- ADMIN PORTAL ---
  admin: {
    getStats: () => apiRequest('/admin/dashboard/stats', {
      method: 'GET',
    }),
    listVendors: (status = '') => apiRequest(`/admin/vendors${status ? `?status=${status}` : ''}`, {
      method: 'GET',
    }),
    getVendorById: (id) => apiRequest(`/admin/vendors/${id}`, {
      method: 'GET',
    }),
    approveVendor: (id, remarks) => apiRequest(`/admin/vendors/${id}/approve`, {
      method: 'POST',
      body: { remarks },
    }),
    rejectVendor: (id, remarks) => apiRequest(`/admin/vendors/${id}/reject`, {
      method: 'POST',
      body: { remarks },
    }),
    suspendVendor: (id, remarks) => apiRequest(`/admin/vendors/${id}/suspend`, {
      method: 'POST',
      body: { remarks },
    }),
    getVendorApprovalHistory: (id) => apiRequest(`/admin/vendors/${id}/approval-history`, {
      method: 'GET',
    }),
    listProducts: () => apiRequest('/admin/products', {
      method: 'GET',
    }),
    listPendingProducts: () => apiRequest('/admin/products/pending', {
      method: 'GET',
    }),
    approveProduct: (id, remarks) => apiRequest(`/admin/products/${id}/approve`, {
      method: 'POST',
      body: { remarks },
    }),
    rejectProduct: (id, remarks) => apiRequest(`/admin/products/${id}/reject`, {
      method: 'POST',
      body: { remarks },
    }),
    listCategories: () => apiRequest('/admin/categories', {
      method: 'GET',
    }),
    createCategory: (catData) => apiRequest('/admin/categories', {
      method: 'POST',
      body: catData,
    }),
    updateCategory: (id, catData) => apiRequest(`/admin/categories/${id}`, {
      method: 'PUT',
      body: catData,
    }),
    deleteCategory: (id) => apiRequest(`/admin/categories/${id}`, {
      method: 'DELETE',
    }),
    createStaffAccount: (staffData) => apiRequest('/admin/staff', {
      method: 'POST',
      body: staffData,
    }),
    listCustomers: () => apiRequest('/admin/customers', {
      method: 'GET',
    }),
  },
};
