import { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Shield, 
  BarChart2, 
  Star, 
  PlusCircle, 
  Check, 
  X, 
  Camera, 
  Lock, 
  RefreshCw, 
  Key, 
  Info, 
  Edit, 
  Eye, 
  Folder,
  ShoppingBag,
  TrendingUp,
  Package,
  AlertTriangle,
  DollarSign,
  User
} from 'lucide-react';
import './VendorDashboard.css';

export default function VendorDashboard({
  onNavigate,
  user,
  onLogout,
  theme,
  onToggleTheme,
  products = [],
  onUpdateProducts,
  orders = [],
  onUpdateOrderStatus,
  onUpdateUser
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, add-product, stock, security, orders, profile
  const [toasts, setToasts] = useState([]);
  
  // Rejection modal states
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  
  // Custom Alert state for product deletion
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
  
  // Search and filter inside dashboard
  const [productSearch, setProductSearch] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    shopName: user ? (user.vendorDetails ? user.vendorDetails.shopName : 'Apex Tech Supplies') : 'Apex Tech Supplies',
    category: user ? (user.vendorDetails ? user.vendorDetails.category : 'electronics') : 'electronics',
    ownerName: user ? user.name : 'Sarah Jenkins',
    email: user ? user.email : 'vendor@apextech.com',
    phone: user ? (user.vendorDetails ? user.vendorDetails.phone || '+1 555-901-2294' : '+1 555-901-2294') : '+1 555-901-2294',
    address: user ? (user.vendorDetails ? user.vendorDetails.address || '94 Innovation Drive, Warehouse C' : '94 Innovation Drive, Warehouse C') : '94 Innovation Drive, Warehouse C',
    gstin: user ? (user.vendorDetails ? user.vendorDetails.gstin || '22ABCDE1234F1Z5' : '22ABCDE1234F1Z5') : '22ABCDE1234F1Z5',
    memberSince: user ? user.memberSince || '2026-02-10' : '2026-02-10'
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        shopName: user.vendorDetails ? user.vendorDetails.shopName : 'Apex Tech Supplies',
        category: user.vendorDetails ? user.vendorDetails.category : 'electronics',
        ownerName: user.name || '',
        email: user.email || '',
        phone: user.vendorDetails ? user.vendorDetails.phone || '+1 555-901-2294' : '+1 555-901-2294',
        address: user.vendorDetails ? user.vendorDetails.address || '94 Innovation Drive, Warehouse C' : '94 Innovation Drive, Warehouse C',
        gstin: user.vendorDetails ? user.vendorDetails.gstin || '22ABCDE1234F1Z5' : '22ABCDE1234F1Z5',
        memberSince: user.memberSince || '2026-02-10'
      });
    }
  }, [user]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileForm.shopName.trim() || !profileForm.ownerName.trim()) {
      addToast('Shop Name and Owner Name are required.', 'error');
      return;
    }
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        name: profileForm.ownerName,
        email: profileForm.email,
        memberSince: profileForm.memberSince,
        vendorDetails: {
          ...user.vendorDetails,
          shopName: profileForm.shopName,
          category: profileForm.category,
          phone: profileForm.phone,
          address: profileForm.address,
          gstin: profileForm.gstin
        }
      });
      addToast('Boutique profile updated successfully!', 'success');
    }
  };
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  
  // Product Detail Modal State
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailActiveImgIdx, setDetailActiveImgIdx] = useState(0);

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'electronics',
    description: '',
    stock: '10'
  });
  
  // Support up to 5 pictures (URLs or base64 strings)
  const [productPics, setProductPics] = useState([]);
  const [picInputVal, setPicInputVal] = useState('');

  // Toast notification helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Determine current vendor name based on logged-in user
  const vendorName = useMemo(() => {
    if (user && user.vendorDetails && user.vendorDetails.shopName) {
      return user.vendorDetails.shopName;
    }
    return user ? user.name : 'Apex Tech Supplies';
  }, [user]);

  // Filter products owned by this vendor
  const vendorProducts = useMemo(() => {
    return products;
  }, [products]);

  // Filter orders related to this vendor's products
  const vendorOrders = useMemo(() => {
    return orders.filter(order => 
      order.items.some(item => item.vendor === vendorName)
    );
  }, [orders, vendorName]);

  const getVendorItems = (order) => {
    return order.items.filter(item => item.vendor === vendorName);
  };

  const getVendorSubtotal = (order) => {
    return order.items
      .filter(item => item.vendor === vendorName)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0)
      .toFixed(2);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    onUpdateOrderStatus(orderId, newStatus);
  };

  const handleRejectOrderSubmit = (e) => {
    e.preventDefault();
    if (!rejectionReasonText.trim()) {
      addToast('Please enter a rejection reason.', 'error');
      return;
    }
    onUpdateOrderStatus(rejectingOrder.id, 'Rejected', rejectionReasonText);
    setRejectingOrder(null);
    setRejectionReasonText('');
  };

  // Filtering products for the Products list inside dashboard
  const filteredDashboardProducts = useMemo(() => {
    return vendorProducts.filter((p) => {
      const matchesCategory = selectedCategoryTab === 'all' || p.category === selectedCategoryTab;
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.description.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.id.toLowerCase().includes(productSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [vendorProducts, selectedCategoryTab, productSearch]);

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const totalCount = vendorProducts.length;
    const stockValue = vendorProducts.reduce((acc, p) => acc + (p.price * (p.stock || 15)), 0);
    const lowStockCount = vendorProducts.filter((p) => (p.stock !== undefined ? p.stock : 15) < 5).length;
    
    // Calculate total reviews and average ratings
    const totalReviews = vendorProducts.reduce((acc, p) => acc + (p.reviews || 0), 0);
    const avgRating = totalCount > 0 
      ? (vendorProducts.reduce((acc, p) => acc + (p.rating || 4.5), 0) / totalCount).toFixed(1)
      : '0.0';

    const totalOrdersCount = vendorOrders.length;
    const pendingOrdersCount = vendorOrders.filter(o => o.status === 'Pending').length;
    const completedOrdersCount = vendorOrders.filter(o => o.status === 'Delivered').length;
    const rejectedOrdersCount = vendorOrders.filter(o => o.status === 'Rejected').length;

    return {
      totalCount,
      stockValue: stockValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      lowStockCount,
      avgRating,
      totalReviews,
      totalOrdersCount,
      pendingOrdersCount,
      completedOrdersCount,
      rejectedOrdersCount
    };
  }, [vendorProducts, vendorOrders]);

  // Handle stock updates
  const handleUpdateStock = (productId, newStockVal) => {
    const parsedVal = parseInt(newStockVal, 10);
    if (isNaN(parsedVal) || parsedVal < 0) {
      addToast('Please enter a valid stock number.', 'error');
      return;
    }
    
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: parsedVal };
      }
      return p;
    });
    onUpdateProducts(updated);
    addToast('Stock level updated successfully!');
  };

  const handleIncrementStock = (product, amount) => {
    const currentStock = product.stock !== undefined ? product.stock : 15;
    const newStock = Math.max(0, currentStock + amount);
    handleUpdateStock(product.id, newStock);
  };

  // Image Upload helper (converts local files to Base64)
  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (productPics.length + files.length > 5) {
      addToast('Maximum limit of 5 pictures reached.', 'error');
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductPics((prev) => [...prev, reader.result]);
        addToast('Photo uploaded and processed.');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPicByUrl = (e) => {
    e.preventDefault();
    if (!picInputVal) return;
    if (productPics.length >= 5) {
      addToast('Maximum limit of 5 pictures reached.', 'error');
      return;
    }
    setProductPics((prev) => [...prev, picInputVal]);
    setPicInputVal('');
    addToast('External photo URL added.');
  };

  const handleRemovePicIdx = (idxToRemove) => {
    setProductPics((prev) => prev.filter((_, idx) => idx !== idxToRemove));
    addToast('Photo removed from upload list.', 'info');
  };

  // Save password change
  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('Please fill in all fields.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters long.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }

    // Success simulation
    addToast('Account password updated successfully!', 'success');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Add Product Form Submit
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    const { name, price, category, description, stock } = newProduct;

    if (!name || !price || !description) {
      addToast('Please fill out all standard details.', 'error');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      addToast('Please enter a valid product price.', 'error');
      return;
    }

    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      addToast('Please enter a valid initial stock.', 'error');
      return;
    }

    // Set default image if none provided
    const primaryImg = productPics.length > 0 
      ? productPics[0] 
      : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
    
    const allImages = productPics.length > 0 ? productPics : [primaryImg];

    const newlyCreatedProduct = {
      id: `p-${Date.now()}`,
      name,
      category,
      price: priceNum,
      rating: 5.0,
      reviews: 0,
      image: primaryImg,
      images: allImages, // store up to 5 pics
      description,
      vendor: vendorName,
      stock: stockNum
    };

    onUpdateProducts([newlyCreatedProduct, ...products]);
    addToast(`Successfully listed "${name}"!`, 'success');

    // Reset Form
    setNewProduct({
      name: '',
      price: '',
      category: 'electronics',
      description: '',
      stock: '10'
    });
    setProductPics([]);
    setActiveTab('products'); // redirect to catalog
  };

  // Grouped category counts
  const categoryCounts = useMemo(() => {
    const counts = { electronics: 0, fashion: 0, home: 0, beauty: 0 };
    vendorProducts.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [vendorProducts]);

  return (
    <div className={`vendor-dashboard-container ${theme === 'light' ? 'light-theme' : ''}`}>
      {/* Decorative Background Glow Blobs */}
      <div className="bg-blobs">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      {/* Dashboard Top Header */}
      <header className="glass-navbar glass-element">
        <div className="section-width navbar-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="icon-btn back-btn"
              onClick={() => onNavigate('landing')}
              title="Return to Marketplace"
            >
              <ArrowLeft size={18} />
            </button>
            <a href="#" className="brand" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>
              <div className="brand-icon-wrapper" style={{ background: 'var(--button-primary)' }}>
                <Layers size={22} color="#fff" />
              </div>
              <span>Shop<span className="text-gradient">Stack</span></span>
            </a>
            <span className="divider-bar">|</span>
            <span className="dashboard-badge">Merchant Console</span>
          </div>

          <div className="nav-actions">
            {/* Theme Toggle */}
            <button className="icon-btn" onClick={onToggleTheme} title="Toggle dark/light mode">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Vendor Profile Info */}
            {user && (
              <div className="vendor-profile-chip glass-element">
                <div className="avatar-circle">{user.avatar}</div>
                <div className="vendor-info-text">
                  <span className="vendor-shop-name">{vendorName}</span>
                  <span className="vendor-role-tag">{user.role}</span>
                </div>
              </div>
            )}

            {/* Logout button */}
            <button 
              className="primary-btn logout-btn" 
              onClick={() => {
                onLogout();
                onNavigate('landing');
              }}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Toast Alert Notifications */}
      <div className="dashboard-toasts-container">
        {toasts.map((t) => (
          <div className={`toast-card glass-card ${t.type}`} key={t.id}>
            {t.type === 'success' ? <Check size={16} color="#10b981" /> : <Info size={16} color="var(--accent)" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <main className="section-width dashboard-main-layout">
        
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar glass-card">
          <div className="sidebar-header">
            <h3>Control Center</h3>
            <p>Manage your online boutique store</p>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart2 size={18} />
              <span>Overview & Analytics</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} />
              <span>Product Management</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-product')}
            >
              <PlusCircle size={18} />
              <span>Add New Product</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'stock' ? 'active' : ''}`}
              onClick={() => setActiveTab('stock')}
            >
              <TrendingUp size={18} />
              <span>Stock Management</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} />
              <span>Order Management</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Lock size={18} />
              <span>Security Settings</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>Shop Profile Details</span>
            </button>
          </nav>

          <div className="sidebar-footer-info">
            <Shield size={14} color="var(--secondary-glow)" />
            <span>Encrypted SEC-TLS Connection</span>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <section className="dashboard-content-panel">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Dashboard Overview</h2>
                <p>Real-time analytics for your catalog performance metrics</p>
              </div>

              {/* Stats Metrics Cards */}
              <div className="metrics-grid">
                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#aa3bff' }}>
                    <Package size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Active Listings</span>
                    <span className="metric-value">{stats.totalCount}</span>
                  </div>
                </div>

                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#3b82f6' }}>
                    <DollarSign size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Est. Stock Value</span>
                    <span className="metric-value">{stats.stockValue}</span>
                  </div>
                </div>

                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#ef4444' }}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Low Stock Alerts</span>
                    <span className="metric-value" style={{ color: stats.lowStockCount > 0 ? '#ef4444' : 'inherit' }}>
                      {stats.lowStockCount}
                    </span>
                  </div>
                </div>

                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#fb3' }}>
                    <Star size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Avg. Product Rating</span>
                    <span className="metric-value">{stats.avgRating} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({stats.totalReviews} reviews)</span></span>
                  </div>
                </div>
              </div>

              {/* Order Performance Metrics Cards */}
              <div className="metrics-grid" style={{ marginTop: '-12px' }}>
                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: 'linear-gradient(135deg, #aa3bff 0%, #3b82f6 100%)' }}>
                    <ShoppingBag size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Total Orders</span>
                    <span className="metric-value">{stats.totalOrdersCount}</span>
                  </div>
                </div>

                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#f59e0b' }}>
                    <RefreshCw size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Pending Orders</span>
                    <span className="metric-value" style={{ color: stats.pendingOrdersCount > 0 ? '#f59e0b' : 'inherit' }}>
                      {stats.pendingOrdersCount}
                    </span>
                  </div>
                </div>

                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#10b981' }}>
                    <Check size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Delivered Orders</span>
                    <span className="metric-value">{stats.completedOrdersCount}</span>
                  </div>
                </div>

                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#ef4444' }}>
                    <X size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Rejected Orders</span>
                    <span className="metric-value" style={{ color: stats.rejectedOrdersCount > 0 ? '#ef4444' : 'inherit' }}>
                      {stats.rejectedOrdersCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphical CSS Charts Section */}
              <div className="dashboard-charts-layout">
                <div className="chart-card glass-card">
                  <h3>Catalog Distribution</h3>
                  <p className="chart-subtitle">Products classified by primary categories</p>
                  
                  <div className="category-bars-container">
                    {Object.entries(categoryCounts).map(([cat, count]) => {
                      const total = stats.totalCount || 1;
                      const percentage = ((count / total) * 100).toFixed(0);
                      const displayNames = {
                        electronics: 'Electronics',
                        fashion: 'Fashion & Athletics',
                        home: 'Home & Living',
                        beauty: 'Beauty & Wellness'
                      };
                      return (
                        <div className="category-bar-row" key={cat}>
                          <div className="category-bar-label">
                            <span>{displayNames[cat] || cat}</span>
                            <span>{count} ({percentage}%)</span>
                          </div>
                          <div className="bar-track">
                            <div 
                              className={`bar-fill fill-${cat}`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="chart-card glass-card">
                  <h3>Simulated Store Performance</h3>
                  <p className="chart-subtitle">Revenue trend over the last 6 months (in USD)</p>
                  
                  <div className="trend-graph-container">
                    <div className="trend-bars-wrapper">
                      <div className="trend-bar-col">
                        <div className="trend-fill" style={{ height: '35%' }}>
                          <span className="tooltip">$4,250</span>
                        </div>
                        <span className="trend-label">Feb</span>
                      </div>
                      <div className="trend-bar-col">
                        <div className="trend-fill" style={{ height: '50%' }}>
                          <span className="tooltip">$6,100</span>
                        </div>
                        <span className="trend-label">Mar</span>
                      </div>
                      <div className="trend-bar-col">
                        <div className="trend-fill" style={{ height: '42%' }}>
                          <span className="tooltip">$5,020</span>
                        </div>
                        <span className="trend-label">Apr</span>
                      </div>
                      <div className="trend-bar-col">
                        <div className="trend-fill" style={{ height: '65%' }}>
                          <span className="tooltip">$7,890</span>
                        </div>
                        <span className="trend-label">May</span>
                      </div>
                      <div className="trend-bar-col">
                        <div className="trend-fill animate-glow" style={{ height: '85%' }}>
                          <span className="tooltip">$10,400</span>
                        </div>
                        <span className="trend-label">Jun</span>
                      </div>
                      <div className="trend-bar-col">
                        <div className="trend-fill active-glow" style={{ height: '95%' }}>
                          <span className="tooltip">$11,850</span>
                        </div>
                        <span className="trend-label">Jul (Current)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Guidelines Card */}
              <div className="guidelines-card glass-card">
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="guideline-icon">
                    <Info size={24} />
                  </div>
                  <div>
                    <h4>Merchant Commission & Settlement Terms</h4>
                    <p>
                      ShopStack settlements are processed automatically every 24 hours directly to your merchant wallet. 
                      A flat system fee of 2.0% is applied on final values. Keep stock information accurate to maintain 
                      your high-priority store recommendation index.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Product Management</h2>
                <p>Inspect existing catalog details, filters, and categories</p>
              </div>

              {/* Controls bar */}
              <div className="dashboard-toolbar">
                <div className="toolbar-search">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search boutique products by name or description..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                
                <button 
                  className="primary-btn"
                  onClick={() => setActiveTab('add-product')}
                  style={{ gap: '6px', fontSize: '13px' }}
                >
                  <Plus size={16} />
                  <span>List New Product</span>
                </button>
              </div>

              {/* Category selector pill tabs */}
              <div className="dashboard-category-tabs">
                {['all', 'electronics', 'fashion', 'home', 'beauty'].map((cat) => {
                  const displayLabels = {
                    all: 'All Categories',
                    electronics: 'Electronics',
                    fashion: 'Fashion',
                    home: 'Home & Living',
                    beauty: 'Beauty & Health'
                  };
                  return (
                    <button
                      key={cat}
                      className={`category-pill ${selectedCategoryTab === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategoryTab(cat)}
                    >
                      {displayLabels[cat]}
                    </button>
                  );
                })}
              </div>

              {/* Product list rendering */}
              {filteredDashboardProducts.length > 0 ? (
                <div className="dashboard-products-grid">
                  {filteredDashboardProducts.map((p) => {
                    const stockVal = p.stock !== undefined ? p.stock : 15;
                    const isLowStock = stockVal < 5;
                    const isOutOfStock = stockVal === 0;

                    return (
                      <div className="product-card glass-card" key={p.id} style={{ height: 'auto', padding: '16px' }}>
                        <div className="product-image-container">
                          <img src={p.image} alt={p.name} className="product-image" />
                          <span className="product-badge">${p.price}</span>
                          <span className={`stock-badge ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'in'}`}>
                            {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${stockVal} left` : `Stock: ${stockVal}`}
                          </span>
                        </div>

                        <div className="product-meta">
                          <span className="product-vendor">{p.vendor}</span>
                          <span className="product-rating">
                            <Star size={14} fill="#fb3" color="#fb3" />
                            <span>{p.rating || 4.5}</span>
                          </span>
                        </div>

                        <h3 className="product-name" style={{ height: 'auto', minHeight: '44px' }}>{p.name}</h3>
                        <p className="product-desc" style={{ marginBottom: '16px' }}>{p.description}</p>

                        <div className="product-footer" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '12px', display: 'flex', gap: '8px' }}>
                          <button 
                            className="secondary-btn" 
                            style={{ flex: 1, padding: '8px 12px', fontSize: '13px', justifyContent: 'center' }}
                            onClick={() => {
                              setDetailProduct(p);
                              setDetailActiveImgIdx(0);
                            }}
                          >
                            <Eye size={14} style={{ marginRight: '6px' }} />
                            <span>View Details</span>
                          </button>
                          
                          <button 
                            className="secondary-btn" 
                            style={{ 
                              padding: '8px 12px', 
                              fontSize: '13px', 
                              background: 'rgba(239, 68, 68, 0.1)', 
                              border: '1px solid rgba(239, 68, 68, 0.25)', 
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onClick={() => setDeleteConfirmProduct(p)}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="glass-card empty-state" style={{ padding: '60px 24px' }}>
                  <Package size={48} style={{ color: 'var(--text-muted)' }} />
                  <h3>No products matching criteria</h3>
                  <p>Try clearing your search query or choosing a different category filter.</p>
                  <button className="primary-btn" onClick={() => { setProductSearch(''); setSelectedCategoryTab('all'); }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADD NEW PRODUCT */}
          {activeTab === 'add-product' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Add New Product</h2>
                <p>Register a new product layout into the ShopStack catalog</p>
              </div>

              <div className="glass-card form-layout-card">
                <form onSubmit={handleAddProductSubmit} className="dashboard-add-product-form">
                  <div className="form-fields-grid">
                    
                    <div className="form-group flex-full">
                      <label htmlFor="pname">Product Display Title</label>
                      <input 
                        id="pname"
                        type="text" 
                        placeholder="e.g. ShopStack Pro Wireless Mechanical Keyboard"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pprice">Retail Price ($ USD)</label>
                      <input 
                        id="pprice"
                        type="number" 
                        step="0.01"
                        placeholder="99.99"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pstock">Initial Stock Level</label>
                      <input 
                        id="pstock"
                        type="number" 
                        placeholder="25"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pcategory">Product Catalog Category</label>
                      <select 
                        id="pcategory"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      >
                        <option value="electronics">Electronics & Spatial Tech</option>
                        <option value="fashion">Apparel & Athleisure</option>
                        <option value="home">Home Living & Lumens</option>
                        <option value="beauty">Botanics & Beauty Care</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="pvendor">Listing Vendor (Brand)</label>
                      <input 
                        id="pvendor"
                        type="text" 
                        value={vendorName}
                        disabled
                        style={{ opacity: 0.7, background: 'rgba(0,0,0,0.1)' }}
                      />
                    </div>

                    <div className="form-group flex-full">
                      <label htmlFor="pdesc">Detailed Product Description</label>
                      <textarea 
                        id="pdesc"
                        rows="4"
                        placeholder="Write a compelling breakdown of specifications, compatibility, shipping notes, and design accents..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    {/* PHOTO INPUT SECTION (Up to 5 pictures) */}
                    <div className="form-group flex-full picture-uploader-section">
                      <label>Product Photos Gallery (Add up to 5 pictures)</label>
                      <p className="field-hint" style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Provide external picture web URLs or upload local images. The first picture will be the primary card visual.
                      </p>

                      {/* URL input */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <input 
                          type="text" 
                          placeholder="Paste photo web URL (e.g. https://images.unsplash.com/...)" 
                          value={picInputVal}
                          onChange={(e) => setPicInputVal(e.target.value)}
                          style={{ flexGrow: 1 }}
                        />
                        <button 
                          type="button" 
                          className="secondary-btn" 
                          onClick={handleAddPicByUrl}
                          style={{ padding: '0 16px', fontSize: '13px' }}
                        >
                          Add URL
                        </button>
                      </div>

                      {/* File upload drag or select */}
                      <div className="file-uploader-box glass-element" style={{ position: 'relative', overflow: 'hidden' }}>
                        <Camera size={24} style={{ marginBottom: '8px', color: 'var(--text-secondary)' }} />
                        <span>Drag & drop or Click to upload files</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={handleImageFileChange}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                        />
                      </div>

                      {/* Uploaded pictures slots preview list */}
                      <div className="pictures-preview-grid" style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {/* Render existing pics */}
                        {productPics.map((picUrl, idx) => (
                          <div className="pic-preview-slot glass-element" key={idx} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '12px', overflow: 'hidden' }}>
                            <img src={picUrl} alt={`upload-preview-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div className="slot-badge-number">{idx === 0 ? 'Cover' : idx + 1}</div>
                            <button 
                              type="button" 
                              className="remove-pic-btn"
                              onClick={() => handleRemovePicIdx(idx)}
                              title="Delete photo"
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(239, 68, 68, 0.85)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}

                        {/* Render placeholders up to 5 */}
                        {Array.from({ length: Math.max(0, 5 - productPics.length) }).map((_, placeholderIdx) => (
                          <div 
                            className="pic-preview-slot-placeholder glass-element" 
                            key={`placeholder-${placeholderIdx}`}
                            style={{ 
                              width: '90px', 
                              height: '90px', 
                              borderRadius: '12px', 
                              border: '2px dashed var(--glass-border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-muted)'
                            }}
                          >
                            <Camera size={16} />
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                  <div className="form-submit-actions" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button 
                      type="button" 
                      className="secondary-btn"
                      onClick={() => {
                        setNewProduct({ name: '', price: '', category: 'electronics', description: '', stock: '10' });
                        setProductPics([]);
                        setActiveTab('products');
                      }}
                      style={{ padding: '10px 20px' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="primary-btn"
                      style={{ padding: '10px 24px' }}
                    >
                      Publish Listing
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: STOCK MANAGEMENT */}
          {activeTab === 'stock' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Stock Management</h2>
                <p>Modify current inventory counts and monitor supply lines</p>
              </div>

              {/* Table list of all products stock */}
              <div className="glass-card stock-table-card" style={{ padding: '24px', overflowX: 'auto' }}>
                <table className="stock-control-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Product Details</th>
                      <th style={{ width: '150px' }}>Category</th>
                      <th style={{ width: '120px' }}>Price</th>
                      <th style={{ width: '130px' }}>Status</th>
                      <th style={{ width: '220px', textAlign: 'center' }}>Modify Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorProducts.map((p) => {
                      const stockVal = p.stock !== undefined ? p.stock : 15;
                      const isLowStock = stockVal < 5;
                      const isOutOfStock = stockVal === 0;
                      
                      const displayNames = {
                        electronics: 'Electronics',
                        fashion: 'Fashion',
                        home: 'Home & Living',
                        beauty: 'Beauty & Wellness'
                      };

                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="table-product-cell">
                              <img src={p.image} alt={p.name} className="table-product-thumb" />
                              <div className="table-product-info">
                                <span className="table-product-name">{p.name}</span>
                                <span className="table-product-id">ID: {p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="table-category-label">
                              {displayNames[p.category] || p.category}
                            </span>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--text-primary)' }}>${p.price}</strong>
                          </td>
                          <td>
                            <span className={`table-stock-badge ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'in'}`}>
                              {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low (${stockVal} Left)` : `In Stock (${stockVal})`}
                            </span>
                          </td>
                          <td>
                            <div className="table-stock-actions">
                              <button 
                                className="stock-btn decrement"
                                onClick={() => handleIncrementStock(p, -1)}
                                title="Decrease by 1"
                                disabled={stockVal === 0}
                              >
                                <Minus size={12} />
                              </button>
                              
                              <input 
                                type="number" 
                                className="stock-inline-input"
                                value={stockVal}
                                onChange={(e) => handleUpdateStock(p.id, e.target.value)}
                              />
                              
                              <button 
                                className="stock-btn increment"
                                onClick={() => handleIncrementStock(p, 1)}
                                title="Increase by 1"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Security Settings</h2>
                <p>Modify accounts, credentials, passwords, and logs</p>
              </div>

              <div className="glass-card form-layout-card" style={{ maxWidth: '600px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>Change Account Password</h3>
                
                <form onSubmit={handlePasswordChangeSubmit} className="security-settings-form">
                  <div className="form-group flex-full">
                    <label htmlFor="currpass">Current Password</label>
                    <div className="password-input-icon-wrapper" style={{ position: 'relative' }}>
                      <Lock size={16} className="pass-input-icon" />
                      <input 
                        id="currpass"
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group flex-full">
                    <label htmlFor="newpass">New Password</label>
                    <div className="password-input-icon-wrapper" style={{ position: 'relative' }}>
                      <Key size={16} className="pass-input-icon" />
                      <input 
                        id="newpass"
                        type="password" 
                        placeholder="At least 6 characters" 
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group flex-full" style={{ marginBottom: '24px' }}>
                    <label htmlFor="confpass">Confirm New Password</label>
                    <div className="password-input-icon-wrapper" style={{ position: 'relative' }}>
                      <Key size={16} className="pass-input-icon" />
                      <input 
                        id="confpass"
                        type="password" 
                        placeholder="Re-enter new password" 
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="primary-btn checkout-btn" 
                    style={{ justifyContent: 'center', padding: '12px' }}
                  >
                    <RefreshCw size={16} style={{ marginRight: '8px' }} />
                    <span>Update Account Password</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Order Management</h2>
                <p>Track customer purchases and update shipping status states</p>
              </div>

              <div className="glass-card stock-table-card" style={{ padding: '24px', overflowX: 'auto' }}>
                {vendorOrders.length > 0 ? (
                  <table className="stock-control-table">
                    <thead>
                      <tr>
                        <th style={{ width: '100px' }}>Order ID</th>
                        <th style={{ textAlign: 'left' }}>Purchased Items</th>
                        <th style={{ width: '180px' }}>Customer Info</th>
                        <th style={{ width: '110px' }}>Date</th>
                        <th style={{ width: '100px' }}>Subtotal</th>
                        <th style={{ width: '140px' }}>Status</th>
                        <th style={{ width: '220px', textAlign: 'center' }}>Modify Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorOrders.map((order) => {
                        const vendorItems = getVendorItems(order);
                        const vendorSubtotal = getVendorSubtotal(order);
                        
                        return (
                          <tr key={order.id}>
                            <td>
                              <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: '13px' }}>
                                {order.id}
                              </strong>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {vendorItems.map((item, idx) => (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.name}
                                      </span>
                                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        ${item.price} × {item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                                  {order.customerName}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                                  {order.customerEmail}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                {order.date}
                              </span>
                            </td>
                            <td>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                                ${vendorSubtotal}
                              </strong>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span className={`table-stock-badge ${
                                  order.status === 'Delivered' ? 'in' : 
                                  order.status === 'Rejected' ? 'out' : 'low'
                                }`}>
                                  {order.status}
                                </span>
                                {order.status === 'Rejected' && order.rejectionReason && (
                                  <span style={{ fontSize: '10px', color: '#ef4444', fontStyle: 'italic', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={order.rejectionReason}>
                                    Reason: {order.rejectionReason}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className="stock-inline-input"
                                  style={{ width: '120px', padding: '6px', height: 'auto', fontWeight: '600' }}
                                  disabled={order.status === 'Rejected' || order.status === 'Cancelled'}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Packed">Packed</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled" disabled>Cancelled</option>
                                  <option value="Rejected" disabled>Rejected</option>
                                </select>
                                
                                {order.status !== 'Rejected' && order.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => setRejectingOrder(order)}
                                    className="primary-btn"
                                    style={{ 
                                      padding: '6px 10px', 
                                      fontSize: '11px', 
                                      background: 'rgba(239, 68, 68, 0.15)', 
                                      border: '1px solid rgba(239, 68, 68, 0.3)', 
                                      color: '#ef4444' 
                                    }}
                                    title="Reject Order"
                                  >
                                    Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="glass-card empty-state" style={{ padding: '60px 24px' }}>
                    <ShoppingBag size={48} style={{ color: 'var(--text-muted)' }} />
                    <h3>No orders registered</h3>
                    <p>There are no customer orders listed for your products currently.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Boutique Shop Profile Details</h2>
                <p>Manage your merchant profile details, category, GSTIN codes, and addresses</p>
              </div>

              <div className="profile-grid-layout">
                {/* Left Panel: Logo & Quick Stats */}
                <div className="profile-avatar-card glass-card">
                  <div className="profile-avatar-circle" style={{ background: 'linear-gradient(135deg, #c084fc, #6366f1)' }}>
                    {profileForm.shopName ? profileForm.shopName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'AT'}
                  </div>
                  <h3 className="profile-avatar-title">{profileForm.shopName}</h3>
                  <span className="profile-avatar-role">Boutique Merchant</span>
                  
                  <div style={{ marginTop: '24px', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Status</span>
                      <span style={{ color: '#10b981', fontWeight: '700' }}>Verified Vendor</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Category</span>
                      <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{profileForm.category}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Merchant Since</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{profileForm.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Form Fields */}
                <form onSubmit={handleProfileSave} className="profile-form-card glass-card">
                  
                  {/* Shop Details Section */}
                  <div className="profile-form-section">
                    <h4 className="profile-section-title">Boutique Shop Records</h4>
                    <div className="profile-input-grid">
                      <div className="payment-input-group">
                        <label>Boutique Shop Name</label>
                        <input 
                          type="text" 
                          value={profileForm.shopName} 
                          onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })} 
                          placeholder="Apex Tech Supplies"
                          required
                        />
                      </div>
                      <div className="payment-input-group">
                        <label>Business Category</label>
                        <select 
                          value={profileForm.category} 
                          onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                          style={{ width: '100%' }}
                        >
                          <option value="electronics">Electronics</option>
                          <option value="fashion">Fashion</option>
                          <option value="home">Home & living</option>
                          <option value="fitness">Fitness & Outdoors</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Owner Records Section */}
                  <div className="profile-form-section" style={{ marginTop: '20px' }}>
                    <h4 className="profile-section-title">Owner Information</h4>
                    <div className="profile-input-grid">
                      <div className="payment-input-group">
                        <label>Owner Full Name</label>
                        <input 
                          type="text" 
                          value={profileForm.ownerName} 
                          onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })} 
                          placeholder="Sarah Jenkins"
                          required
                        />
                      </div>
                      <div className="payment-input-group">
                        <label>Contact Email Address</label>
                        <input 
                          type="email" 
                          value={profileForm.email} 
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} 
                          placeholder="vendor@apextech.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="profile-input-grid" style={{ marginTop: '12px' }}>
                      <div className="payment-input-group">
                        <label>Contact Phone Number</label>
                        <input 
                          type="text" 
                          value={profileForm.phone} 
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} 
                          placeholder="+1 555-901-2294"
                        />
                      </div>
                      <div className="payment-input-group">
                        <label>GSTIN / Tax ID Number</label>
                        <input 
                          type="text" 
                          value={profileForm.gstin} 
                          onChange={(e) => setProfileForm({ ...profileForm, gstin: e.target.value })} 
                          placeholder="22ABCDE1234F1Z5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shop Address Section */}
                  <div className="profile-form-section" style={{ marginTop: '20px' }}>
                    <h4 className="profile-section-title">Boutique Shop Address</h4>
                    <div className="payment-input-group">
                      <label>Store Warehouse Address</label>
                      <input 
                        type="text" 
                        value={profileForm.address} 
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} 
                        placeholder="94 Innovation Drive, Warehouse C"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="primary-btn checkout-btn" 
                    style={{ justifyContent: 'center', padding: '12px', marginTop: '20px' }}
                  >
                    <span>Save Profile Settings</span>
                  </button>

                </form>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* Rejection Reason Modal */}
      {rejectingOrder && (
        <div 
          className="glass-modal-overlay open"
          onClick={() => setRejectingOrder(null)}
        >
          <div className="glass-modal" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setRejectingOrder(null)}>
              <X size={18} />
            </button>
            <div style={{ padding: '28px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                Reject Order {rejectingOrder.id}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                Please specify the reason for rejecting this order. A rejection reason is **compulsory** and will be logged.
              </p>
              
              <form onSubmit={handleRejectOrderSubmit}>
                <div className="form-group flex-full" style={{ marginBottom: '24px' }}>
                  <label htmlFor="rejreason">Rejection Reason</label>
                  <textarea 
                    id="rejreason"
                    rows="3"
                    placeholder="e.g. Size out of stock / Discontinued product line..."
                    value={rejectionReasonText}
                    onChange={(e) => setRejectionReasonText(e.target.value)}
                    required
                    style={{ marginTop: '6px' }}
                  ></textarea>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="secondary-btn" 
                    onClick={() => {
                      setRejectingOrder(null);
                      setRejectionReasonText('');
                    }}
                    style={{ padding: '10px 16px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="primary-btn" 
                    style={{ padding: '10px 20px', fontSize: '13px', background: '#ef4444', color: '#fff' }}
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal for Deletion */}
      {deleteConfirmProduct && (
        <div 
          className="glass-modal-overlay open"
          style={{ zIndex: 4000 }}
          onClick={() => setDeleteConfirmProduct(null)}
        >
          <div className="glass-modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDeleteConfirmProduct(null)}>
              <X size={18} />
            </button>
            <div style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'rgba(239, 68, 68, 0.15)', 
                color: '#ef4444', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 16px auto'
              }}>
                <Trash2 size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 10px 0', textAlign: 'center' }}>
                Delete Listing?
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 24px 0', textAlign: 'center' }}>
                Are you sure you want to permanently delete **"{deleteConfirmProduct.name}"**? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="secondary-btn" 
                  style={{ flex: 1, padding: '10px 14px', justifyContent: 'center' }} 
                  onClick={() => setDeleteConfirmProduct(null)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-btn" 
                  style={{ flex: 1, padding: '10px 14px', justifyContent: 'center', background: '#ef4444', color: '#fff' }} 
                  onClick={() => {
                    const updated = products.filter((p) => p.id !== deleteConfirmProduct.id);
                    onUpdateProducts(updated);
                    addToast(`Successfully deleted "${deleteConfirmProduct.name}"`, 'success');
                    setDeleteConfirmProduct(null);
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <div 
        className={`glass-modal-overlay ${detailProduct ? 'open' : ''}`}
        onClick={() => setDetailProduct(null)}
      >
        {detailProduct && (
          <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDetailProduct(null)}>
              <X size={18} />
            </button>
            <div className="quickview-layout">
              
              {/* Product Gallery View with up to 5 images */}
              <div className="quickview-image-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: 'auto' }}>
                <div style={{ height: '280px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'var(--input-bg)' }}>
                  <img 
                    src={detailProduct.images && detailProduct.images[detailActiveImgIdx] ? detailProduct.images[detailActiveImgIdx] : detailProduct.image} 
                    alt={detailProduct.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {detailProduct.images && detailProduct.images.length > 1 && (
                  <div className="quickview-thumbnails" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {detailProduct.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '8px',
                          border: `2px solid ${detailActiveImgIdx === idx ? 'var(--accent)' : 'var(--glass-border)'}`,
                          padding: 0,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          background: 'none',
                          flexShrink: 0,
                          transition: 'var(--transition-smooth)'
                        }}
                        onClick={() => setDetailActiveImgIdx(idx)}
                      >
                        <img src={imgUrl} alt={`thumbnail-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Panel */}
              <div className="quickview-details">
                <span className="product-vendor" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                  {detailProduct.vendor}
                </span>
                
                <h3 className="quickview-title">{detailProduct.name}</h3>
                
                <div className="quickview-meta" style={{ marginBottom: '12px' }}>
                  <span className="product-rating">
                    <Star size={16} fill="#fb3" color="#fb3" />
                    <strong style={{ marginLeft: '4px' }}>{detailProduct.rating || 4.5}</strong>
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    ({detailProduct.reviews || 0} customer reviews)
                  </span>
                </div>

                {/* Stock Level Badge */}
                <div style={{ marginBottom: '16px' }}>
                  <span className={`table-stock-badge ${(detailProduct.stock || 15) === 0 ? 'out' : (detailProduct.stock || 15) < 5 ? 'low' : 'in'}`}>
                    {(detailProduct.stock || 15) === 0 ? 'Out of Stock' : (detailProduct.stock || 15) < 5 ? `Low Stock: Only ${detailProduct.stock} left` : `In Stock: ${detailProduct.stock} units`}
                  </span>
                </div>

                <p className="quickview-desc" style={{ fontSize: '13.5px', marginBottom: '20px' }}>
                  {detailProduct.description}
                </p>

                <div className="quickview-price-action" style={{ paddingTops: '12px' }}>
                  <div className="quickview-price">${detailProduct.price}</div>
                  <button className="primary-btn" onClick={() => setDetailProduct(null)}>
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
