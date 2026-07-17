import React, { useState, useEffect } from 'react';
import VendorDashboard from "../pages/vendor/VendorDashboard";
import { api } from '../api';
import { PRODUCTS_DATA } from '../data/products';

const DEMO_CATEGORIES = ['electronics', 'fashion', 'home', 'beauty'].map((category) => ({ id: category, categoryName: category }));
const DEMO_VENDOR = { vendorId: 'demo-vendor', businessName: 'Demo Storefront', businessEmail: 'vendor@shopstack.demo', status: 'ACTIVE' };
const normalizeProduct = (product) => ({ ...product, id: product.id || `demo-product-${Date.now()}`, productName: product.productName || product.name || 'Untitled product', name: product.name || product.productName || 'Untitled product', image: product.image || product.imageUrl, category: product.category || product.categoryName || 'electronics', categoryName: product.categoryName || product.category || 'electronics', stockQuantity: Number(product.stockQuantity ?? 0), price: Number(product.price ?? 0) });

export default function VendorPortal({ user, addToast, onProductsChange }) {
  const [vendorProfile, setVendorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Onboarding Form States
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [businessType, setBusinessType] = useState('PROPRIETORSHIP');
  const [description, setDescription] = useState('');

  // Onboarding Address
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Onboarding Bank Details
  const [accName, setAccName] = useState('');
  const [accNum, setAccNum] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifsc, setIfsc] = useState('');

  // Catalog States
  const [myProducts, setMyProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Product Form Fields
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodActive, setProdActive] = useState(true);
  
  // Image upload for product
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Profile Documents State
  const [docType, setDocType] = useState('GST_CERTIFICATE');
  const [docUrl, setDocUrl] = useState('');
  const [docLoading, setDocLoading] = useState(false);

  useEffect(() => {
    loadVendorProfile();
  }, []);

  const loadVendorProfile = async () => {
    setLoading(true);
    try {
      const response = await api.vendor.getProfile();
      const profile = response?.data || response;
      setVendorProfile(profile || DEMO_VENDOR);

      if (profile?.vendorId) {
        const prods = await api.products.getMyProducts();
        const vendorProducts = (prods?.data || prods || []).map(normalizeProduct);
        setMyProducts(vendorProducts);
      }

      const cats = await api.categories.listAll();
      const availableCategories = cats?.data || cats || DEMO_CATEGORIES;
      setCategories(availableCategories.length ? availableCategories : DEMO_CATEGORIES);
      if (availableCategories.length > 0) {
        setProdCategory(availableCategories[0].id);
      }
    } catch (err) {
      // Keep the vendor area usable for demonstrations when services are offline.
      setVendorProfile(DEMO_VENDOR);
      setCategories(DEMO_CATEGORIES);
      setProdCategory(DEMO_CATEGORIES[0].id);
      setMyProducts(PRODUCTS_DATA.slice(0, 3).map((product, index) => normalizeProduct({ ...product, id: `demo-vendor-${index}`, approvalStatus: 'APPROVED', active: true, stockQuantity: 12 + index })));
    } finally {
      setLoading(false);
    }
  };

  const handleOnboarding = async (e) => {
    e.preventDefault();
    if (!businessName || !businessEmail || !businessPhone) {
      addToast('Please fill out the required business details', 'error');
      return;
    }

    setLoading(true);
    try {
      const onboardingData = {
        userId: user.id,
        businessName,
        businessEmail,
        businessPhone,
        gstNumber,
        panNumber,
        businessType,
        description,
        addresses: [
          {
            addressType: 'SHIPPING',
            addressLine1,
            addressLine2,
            city,
            state: stateName,
            country,
            postalCode,
            isDefault: true
          }
        ],
        bankDetails: [
          {
            accountHolderName: accName,
            accountNumber: accNum,
            bankName,
            ifscOrSwiftCode: ifsc
          }
        ],
        documents: []
      };

      const response = await api.vendor.register(onboardingData);
      addToast('Business profile submitted successfully! Awaiting administrator approval.', 'success');
      setVendorProfile(response);
      loadVendorProfile();
    } catch (err) {
      addToast(err.message || 'Onboarding submission failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const price = Number(prodPrice);
    const stockQuantity = Number(prodStock);
    if (!prodName.trim() || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stockQuantity) || stockQuantity < 0 || !prodCategory) {
      addToast('Enter a name, valid price, stock quantity, and category.', 'error');
      return;
    }

    const payload = {
      productName: prodName.trim(), name: prodName.trim(), brand: prodBrand.trim(), description: prodDesc.trim(), price, stockQuantity,
      categoryId: prodCategory, category: prodCategory, categoryName: prodCategory, featured: prodFeatured, active: prodActive,
      image: imagePreview, imageUrl: imagePreview, approvalStatus: 'APPROVED',
    };
    try {
      if (editingProduct) {
        const updated = await api.products.update(editingProduct.id, payload);
        const nextProduct = normalizeProduct({ ...editingProduct, ...payload, ...(updated?.data || updated || {}) });
        setMyProducts((current) => current.map((product) => product.id === editingProduct.id ? nextProduct : product));
        onProductsChange?.((current) => current.map((product) => product.id === editingProduct.id ? nextProduct : product));
        addToast('Product updated successfully!', 'success');
      } else {
        const created = await api.products.create(payload);
        const nextProduct = normalizeProduct({ ...payload, ...(created?.data || created || {}), id: created?.id || created?.data?.id || `demo-product-${Date.now()}` });
        setMyProducts((current) => [nextProduct, ...current]);
        onProductsChange?.((current) => [nextProduct, ...current]);
        addToast('Product added and available in the demo catalog!', 'success');
      }
    } catch (err) {
      const nextProduct = normalizeProduct({ ...payload, ...(editingProduct || {}), id: editingProduct?.id || `demo-product-${Date.now()}` });
      setMyProducts((current) => editingProduct ? current.map((product) => product.id === editingProduct.id ? nextProduct : product) : [nextProduct, ...current]);
      onProductsChange?.((current) => editingProduct ? current.map((product) => product.id === editingProduct.id ? nextProduct : product) : [nextProduct, ...current]);
      addToast('Saved locally for the demo. Backend sync can be enabled later.', 'info');
    }
    setShowProductForm(false); setEditingProduct(null); resetProductForm();
  };

  const resetProductForm = () => {
    setProdName('');
    setProdBrand('');
    setProdDesc('');
    setProdPrice('');
    setProdStock('');
    setProdFeatured(false);
    setProdActive(true);
    setImageFile(null);
    setImagePreview('');
    if (categories?.length > 0) {
      setProdCategory(categories[0].id);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditProduct = (prod) => {
    if (!prod) return;
    setEditingProduct(prod);
    setProdName(prod.productName || '');
    setProdBrand(prod.brand || '');
    setProdDesc(prod.description || '');
    setProdPrice(prod.price || '');
    setProdStock(prod.stockQuantity || '');
    setProdCategory(prod.categoryId || '');
    setProdFeatured(prod.featured || false);
    setProdActive(prod.active ?? true);
    setImagePreview(prod.image || prod.imageUrl || '');
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product listing?')) return;
    try {
      await api.products.delete(id);
    } catch (err) {
      addToast('Removed locally for the demo.', 'info');
    }
    setMyProducts((current) => current.filter((product) => product.id !== id));
    onProductsChange?.((current) => current.filter((product) => product.id !== id));
    addToast('Product listing deleted.', 'success');
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!docUrl) {
      addToast('Please enter a document URL', 'error');
      return;
    }
    setDocLoading(true);
    try {
      await api.vendor.uploadDocument(vendorProfile.vendorId, {
        vendorId: vendorProfile.vendorId,
        documentType: docType,
        documentUrl: docUrl
      });
      addToast('Document uploaded successfully!', 'success');
      setDocUrl('');
      loadVendorProfile();
    } catch (err) {
      addToast(err.message || 'Failed to upload document', 'error');
    } finally {
      setDocLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '6rem' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // --- RENDERING ONBOARDING FORM ---
  if (!vendorProfile) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '2rem' }}>
        <div className="glass-card">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.5rem' }}>Complete Seller Registration</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Set up your business credentials to start publishing and selling products on the ShopStack marketplace.
          </p>

          <form onSubmit={handleOnboarding}>
            {/* Section 1: Business Profile */}
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              1. Business Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Legal Business Name *</label>
                <input type="text" className="form-input" placeholder="Acme Retailers Ltd" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Business Email Address *</label>
                <input type="email" className="form-input" placeholder="sales@acme.com" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Business Phone *</label>
                <input type="tel" className="form-input" placeholder="9199999999" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">GSTIN Number</label>
                <input type="text" className="form-input" placeholder="22AAAAA0000A1Z5" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">PAN Number</label>
                <input type="text" className="form-input" placeholder="ABCDE1234F" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Business Structure Type</label>
              <select className="form-input" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                <option value="PROPRIETORSHIP">Proprietorship</option>
                <option value="PARTNERSHIP">Partnership</option>
                <option value="PRIVATE_LIMITED">Private Limited</option>
                <option value="LLP">LLP</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Business Description</label>
              <textarea className="form-input" placeholder="Describe your store and products..." value={description} onChange={(e) => setDescription(e.target.value)} rows="3"></textarea>
            </div>

            {/* Section 2: Business Address */}
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              2. Warehouse / Business Address
            </h3>
            <div className="form-group">
              <label className="form-label">Address Line 1 *</label>
              <input type="text" className="form-input" placeholder="Building, Street name" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Address Line 2 (Optional)</label>
              <input type="text" className="form-input" placeholder="Area, Landmark" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input type="text" className="form-input" placeholder="Mumbai" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input type="text" className="form-input" placeholder="Maharashtra" value={stateName} onChange={(e) => setStateName(e.target.value)} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Postal Code *</label>
                <input type="text" className="form-input" placeholder="400001" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Country *</label>
                <input type="text" className="form-input" placeholder="India" value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>
            </div>

            {/* Section 3: Bank Details */}
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              3. Bank Details (For Settlements)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Account Holder Name *</label>
                <input type="text" className="form-input" placeholder="John Doe" value={accName} onChange={(e) => setAccName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Account Number *</label>
                <input type="text" className="form-input" placeholder="999888777666" value={accNum} onChange={(e) => setAccNum(e.target.value)} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Bank Name *</label>
                <input type="text" className="form-input" placeholder="State Bank of India" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">IFSC / SWIFT Code *</label>
                <input type="text" className="form-input" placeholder="SBIN0001234" value={ifsc} onChange={(e) => setIfsc(e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
              Submit Onboarding Application
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERING FULL VENDOR DASHBOARD ---
  return (
    <VendorDashboard
      user={user}
      vendorProfile={vendorProfile}
      myProducts={myProducts}
      categories={categories}
      loading={loading}
      showProductForm={showProductForm}
      editingProduct={editingProduct}
      prodName={prodName}
      prodBrand={prodBrand}
      prodDesc={prodDesc}
      prodPrice={prodPrice}
      prodStock={prodStock}
      prodCategory={prodCategory}
      prodFeatured={prodFeatured}
      prodActive={prodActive}
      docType={docType}
      docUrl={docUrl}
      docLoading={docLoading}
      onSetShowProductForm={setShowProductForm}
      onSetEditingProduct={setEditingProduct}
      onSetProdName={setProdName}
      onSetProdBrand={setProdBrand}
      onSetProdDesc={setProdDesc}
      onSetProdPrice={setProdPrice}
      onSetProdStock={setProdStock}
      onSetProdCategory={setProdCategory}
      onSetProdFeatured={setProdFeatured}
      onSetProdActive={setProdActive}
      onSetDocType={setDocType}
      onSetDocUrl={setDocUrl}
      onHandleProductSubmit={handleProductSubmit}
      onStartEditProduct={startEditProduct}
      onHandleDeleteProduct={handleDeleteProduct}
      onHandleDocumentSubmit={handleDocumentSubmit}
      onResetProductForm={resetProductForm}
      imagePreview={imagePreview}
      onHandleImageSelect={handleImageSelect}
      addToast={addToast}
    />
  );
}
