import React, { useState, useEffect } from 'react';
import { api } from '../api';
import AdminDashboard from "../pages/admin/AdminDashboard";


export default function AdminPortal({ user, addToast }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);

  // Statistics
  const [stats, setStats] = useState(null);

  // Vendors List & Approval
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  // Products Approval List
  const [pendingProducts, setPendingProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Categories
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Staff Account Provisioning
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState('WAREHOUSE_STAFF');

  // Customer List
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadTabContent();
  }, [activeTab, vendorFilter]);

  const loadTabContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const statsResponse = await api.admin.getStats();
        setStats(statsResponse.data || statsResponse);
      } else if (activeTab === 'vendors') {
        const vendorsResponse = await api.admin.listVendors(vendorFilter);
        const list = vendorsResponse.data?.content || vendorsResponse.content || vendorsResponse.data || vendorsResponse || [];
        setVendors(list);
      } else if (activeTab === 'products') {
        const productsResponse = await api.admin.listPendingProducts();
        setPendingProducts((productsResponse.data || productsResponse || []).map((product) => ({
          ...product,
          image: product.image || product.imageUrl,
        })));
      } else if (activeTab === 'categories') {
        const categoriesResponse = await api.admin.listCategories();
        setCategories(categoriesResponse.data || categoriesResponse || []);
      } else if (activeTab === 'customers') {
        const customersResponse = await api.admin.listCustomers();
        setCustomers(customersResponse.data || customersResponse || []);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVendorReview = async (vendorId, action) => {
    try {
      if (action === 'approve') {
        await api.admin.approveVendor(vendorId, reviewRemarks);
        addToast('Vendor profile approved and activated!', 'success');
      } else if (action === 'reject') {
        await api.admin.rejectVendor(vendorId, reviewRemarks);
        addToast('Vendor profile rejected.', 'warning');
      } else if (action === 'suspend') {
        await api.admin.suspendVendor(vendorId, reviewRemarks);
        addToast('Vendor merchant account suspended.', 'error');
      }
      setReviewRemarks('');
      setSelectedVendor(null);
      loadTabContent();
    } catch (err) {
      addToast(err.message || 'Action failed', 'error');
    }
  };

  const handleProductReview = async (productId, action) => {
    try {
      if (action === 'approve') {
        await api.admin.approveProduct(productId, reviewRemarks);
        addToast('Product approved and live in catalog!', 'success');
      } else {
        await api.admin.rejectProduct(productId, reviewRemarks);
        addToast('Product rejected.', 'warning');
      }
      setReviewRemarks('');
      setSelectedProduct(null);
      loadTabContent();
    } catch (err) {
      addToast(err.message || 'Action failed', 'error');
    }
  };

  const viewVendorDetails = async (vendor) => {
    setSelectedVendor(vendor);
    try {
      const historyResponse = await api.admin.getVendorApprovalHistory(vendor.vendorId);
      setApprovalHistory(historyResponse.data || historyResponse || []);
    } catch (err) {
      console.error('Failed to load approval log history', err);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catName) return;
    try {
      const payload = {
        categoryName: catName,
        description: catDesc
      };
      if (editingCategory) {
        payload.active = true;
        await api.admin.updateCategory(editingCategory.id, payload);
        addToast('Category updated successfully!', 'success');
      } else {
        await api.admin.createCategory(payload);
        addToast('New category taxonomy created!', 'success');
      }
      setCatName('');
      setCatDesc('');
      setEditingCategory(null);
      setShowCategoryForm(false);
      loadTabContent();
    } catch (err) {
      addToast(err.message || 'Failed to submit category', 'error');
    }
  };

  const startEditCategory = (cat) => {
    setEditingCategory(cat);
    setCatName(cat.categoryName || '');
    setCatDesc(cat.description || '');
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category? Products in this category may lose their reference.')) return;
    try {
      await api.admin.deleteCategory(id);
      addToast('Category deleted successfully.', 'success');
      loadTabContent();
    } catch (err) {
      addToast(err.message || 'Failed to delete category', 'error');
    }
  };

  const handleStaffProvision = async (e) => {
    e.preventDefault();
    if (!staffName || !staffEmail || !staffPassword) {
      addToast('All fields except phone are required for staff provisioning', 'error');
      return;
    }
    try {
      await api.admin.createStaffAccount({
        name: staffName,
        email: staffEmail,
        password: staffPassword,
        role: staffRole,
        phone: staffPhone ? parseInt(staffPhone.replace(/\D/g, '')) : null
      });
      addToast(`Staff account for ${staffName} provisioned successfully!`, 'success');
      setStaffName('');
      setStaffEmail('');
      setStaffPassword('');
      setStaffPhone('');
    } catch (err) {
      addToast(err.message || 'Provisioning failed', 'error');
    }
  };

  return (
    <AdminDashboard
      user={user}
      activeTab={activeTab}
      onSetActiveTab={setActiveTab}
      loading={loading}
      stats={stats}
      vendors={vendors}
      vendorFilter={vendorFilter}
      onSetVendorFilter={setVendorFilter}
      selectedVendor={selectedVendor}
      onSetSelectedVendor={setSelectedVendor}
      approvalHistory={approvalHistory}
      reviewRemarks={reviewRemarks}
      onSetReviewRemarks={setReviewRemarks}
      pendingProducts={pendingProducts}
      selectedProduct={selectedProduct}
      onSetSelectedProduct={setSelectedProduct}
      categories={categories}
      showCategoryForm={showCategoryForm}
      onSetShowCategoryForm={setShowCategoryForm}
      editingCategory={editingCategory}
      catName={catName}
      catDesc={catDesc}
      onSetCatName={setCatName}
      onSetCatDesc={setCatDesc}
      staffName={staffName}
      staffEmail={staffEmail}
      staffPassword={staffPassword}
      staffPhone={staffPhone}
      staffRole={staffRole}
      onSetStaffName={setStaffName}
      onSetStaffEmail={setStaffEmail}
      onSetStaffPassword={setStaffPassword}
      onSetStaffPhone={setStaffPhone}
      onSetStaffRole={setStaffRole}
      customers={customers}
      onHandleVendorReview={handleVendorReview}
      onHandleProductReview={handleProductReview}
      onViewVendorDetails={viewVendorDetails}
      onHandleCategorySubmit={handleCategorySubmit}
      onStartEditCategory={startEditCategory}
      onHandleDeleteCategory={handleDeleteCategory}
      onHandleStaffProvision={handleStaffProvision}
      onRefresh={loadTabContent}
      addToast={addToast}
    />
  );
}
