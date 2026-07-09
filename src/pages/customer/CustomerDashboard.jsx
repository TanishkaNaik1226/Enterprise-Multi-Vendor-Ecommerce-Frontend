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
  Check, 
  X, 
  Lock, 
  RefreshCw, 
  Key, 
  Info, 
  Eye, 
  ShoppingBag,
  Heart,
  Bell,
  Truck,
  TrendingUp,
  Package,
  CheckCircle2,
  AlertTriangle,
  User
} from 'lucide-react';
import './CustomerDashboard.css';

export default function CustomerDashboard({
  onNavigate,
  user,
  onLogout,
  theme,
  onToggleTheme,
  products = [],
  wishlist = [],
  onSaveWishlist,
  cart = [],
  onSaveCart,
  orders = [],
  notifications = [],
  onUpdateNotifications,
  onUpdateOrders,
  onUpdateOrderStatus,
  onUpdateUser
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, wishlist, notifications, security, profile
  const [toasts, setToasts] = useState([]);
  
  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeQuickViewImage, setActiveQuickViewImage] = useState(null);
  const [wishlistClearConfirm, setWishlistClearConfirm] = useState(false);
  const [removeItemConfirm, setRemoveItemConfirm] = useState(null);
  const [deleteOrderConfirm, setDeleteOrderConfirm] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user ? user.name || 'Sarah Jenkins' : 'Sarah Jenkins',
    email: user ? user.email || 'sarah@jenkins.com' : 'sarah@jenkins.com',
    phone: user ? user.phone || '+1 555-019-2834' : '+1 555-019-2834',
    address: user ? user.address || '128 Boutique Blvd, Floor 4' : '128 Boutique Blvd, Floor 4',
    city: user ? user.city || 'Beverly Hills' : 'Beverly Hills',
    state: user ? user.state || 'CA' : 'CA',
    zipCode: user ? user.zipCode || '90210' : '90210',
    memberSince: user ? user.memberSince || '2026-01-15' : '2026-01-15'
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '+1 555-019-2834',
        address: user.address || '128 Boutique Blvd, Floor 4',
        city: user.city || 'Beverly Hills',
        state: user.state || 'CA',
        zipCode: user.zipCode || '90210',
        memberSince: user.memberSince || '2026-01-15'
      });
    }
  }, [user]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      addToast('Name and Email are required.', 'error');
      return;
    }
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        address: profileForm.address,
        city: profileForm.city,
        state: profileForm.state,
        zipCode: profileForm.zipCode,
        memberSince: profileForm.memberSince
      });
      addToast('Profile updated successfully!', 'success');
    }
  };

  const handleConfirmCancel = () => {
    if (!cancellingOrder) return;
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(cancellingOrder.id, 'Cancelled');
      addToast(`Order ${cancellingOrder.id} has been cancelled successfully.`, 'info');
    }
    setCancellingOrder(null);
  };

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Toast notification helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Quick view image sync
  useEffect(() => {
    if (selectedProduct) {
      setActiveQuickViewImage(selectedProduct.image);
    } else {
      setActiveQuickViewImage(null);
    }
  }, [selectedProduct]);

  // Determine current customer email
  const customerEmail = useMemo(() => {
    return user ? user.email : 'sarah@jenkins.com';
  }, [user]);

  // Filter orders placed by this customer
  const customerOrders = useMemo(() => {
    return orders.filter(o => 
      o.customerEmail === customerEmail && 
      o.customerName?.toLowerCase() !== 'shruti jain' &&
      !o.customerEmail?.toLowerCase().includes('shruti')
    );
  }, [orders, customerEmail]);

  // Filter notifications for this customer
  const customerNotifications = useMemo(() => {
    return notifications.filter(n => n.customerEmail === customerEmail);
  }, [notifications, customerEmail]);

  // Unread notification count
  const unreadCount = useMemo(() => {
    return customerNotifications.filter(n => !n.read).length;
  }, [customerNotifications]);

  // Wishlist items details
  const wishlistProducts = useMemo(() => {
    return products.filter(p => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Stats Calculations
  const stats = useMemo(() => {
    const ordersCount = customerOrders.length;
    const wishlistCount = wishlist.length;
    const unreadCountVal = unreadCount;
    
    // Total Spent
    const totalSpent = customerOrders
      .filter(o => o.status !== 'Rejected')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      ordersCount,
      wishlistCount,
      unreadCountVal,
      totalSpent: totalSpent.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    };
  }, [customerOrders, wishlist, unreadCount]);

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    const updated = notifications.map(n => {
      if (n.customerEmail === customerEmail) {
        return { ...n, read: true };
      }
      return n;
    });
    onUpdateNotifications(updated);
    addToast('All notifications marked as read.');
  };

  // Clear all notifications
  const handleClearNotifications = () => {
    const updated = notifications.filter(n => n.customerEmail !== customerEmail);
    onUpdateNotifications(updated);
    addToast('Notification log cleared.', 'info');
  };

  // Add to cart helper
  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      const updated = cart.map((item) => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      onSaveCart(updated);
    } else {
      onSaveCart([...cart, { product, quantity: 1 }]);
    }
    addToast(`Added "${product.name}" to cart!`);
  };

  // Remove from wishlist helper
  const handleRemoveFromWishlist = (productId) => {
    const updated = wishlist.filter(id => id !== productId);
    onSaveWishlist(updated);
    addToast('Item removed from wishlist.', 'info');
  };

  // Delete Order History helper
  const handleDeleteOrder = (orderId) => {
    const updated = orders.filter(o => o.id !== orderId);
    onUpdateOrders(updated);
    addToast(`Order ${orderId} removed from history.`, 'info');
    setDeleteOrderConfirm(null);
  };

  // Password update form
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('Please fill in all fields.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    addToast('Password changed successfully!', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Get index for tracking stepper status bar
  const getStatusIndex = (status) => {
    const statuses = ['Pending', 'Processing', 'Packed', 'Shipped', 'Delivered'];
    return statuses.indexOf(status);
  };

  return (
    <div className={`vendor-dashboard-container ${theme === 'light' ? 'light-theme' : ''}`}>
      {/* Decorative Background Glow Blobs */}
      <div className="bg-blobs">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      {/* Header */}
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
            <span className="dashboard-badge" style={{ background: 'var(--accent-bg)', borderColor: 'var(--accent-border)', color: 'var(--accent)' }}>
              User Console
            </span>
          </div>

          <div className="nav-actions">
            {/* Theme Toggle */}
            <button className="icon-btn" onClick={onToggleTheme} title="Toggle dark/light mode">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile Avatar */}
            {user && (
              <div className="vendor-profile-chip glass-element">
                <div className="avatar-circle">{user.avatar}</div>
                <div className="vendor-info-text">
                  <span className="vendor-shop-name">{user.name}</span>
                  <span className="vendor-role-tag" style={{ color: 'var(--accent)' }}>{user.role}</span>
                </div>
              </div>
            )}

            {/* Logout */}
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

      {/* Toasts */}
      <div className="dashboard-toasts-container">
        {toasts.map((t) => (
          <div className={`toast-card glass-card ${t.type}`} key={t.id}>
            {t.type === 'success' ? <Check size={16} color="#10b981" /> : <Info size={16} color="var(--accent)" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <main className="section-width dashboard-main-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar glass-card">
          <div className="sidebar-header">
            <h3>Buyer Center</h3>
            <p>Track packages, saved lists & orders</p>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart2 size={18} />
              <span>Dashboard Overview</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Truck size={18} />
              <span>Orders & Tracking</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              <Heart size={18} />
              <span>Boutique Wishlist</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
              style={{ position: 'relative' }}
            >
              <Bell size={18} />
              <span>Alert Notifications</span>
              {unreadCount > 0 && (
                <span className="badge" style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Lock size={18} />
              <span>Boutique Security</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>My Profile Details</span>
            </button>
          </nav>

          <div className="sidebar-footer-info">
            <Shield size={14} color="var(--secondary-glow)" />
            <span>Buyer Protection Encrypted</span>
          </div>
        </aside>

        {/* Content Pane */}
        <section className="dashboard-content-panel">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Welcome Back, {user ? user.name.split(' ')[0] : 'Buyer'}!</h2>
                <p>Manage your orders, wishlist items and status notifications</p>
              </div>

              {/* Stats Grid */}
              <div className="metrics-grid">
                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#aa3bff' }}>
                    <ShoppingBag size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Total Spent</span>
                    <span className="metric-value">{stats.totalSpent}</span>
                  </div>
                </div>

                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#3b82f6' }}>
                    <Truck size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Orders Placed</span>
                    <span className="metric-value">{stats.ordersCount}</span>
                  </div>
                </div>

                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#ec4899' }}>
                    <Heart size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Wishlist Items</span>
                    <span className="metric-value">{stats.wishlistCount}</span>
                  </div>
                </div>

                <div className="metric-card glass-card">
                  <div className="metric-icon-wrapper" style={{ background: '#f59e0b' }}>
                    <Bell size={20} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Unread Alerts</span>
                    <span className="metric-value" style={{ color: stats.unreadCountVal > 0 ? '#ef4444' : 'inherit' }}>
                      {stats.unreadCountVal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="dashboard-charts-layout" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
                <div className="chart-card glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0 }}>Recent Orders</h3>
                    <button className="primary-btn" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setActiveTab('orders')}>
                      View All
                    </button>
                  </div>

                  {customerOrders.length > 0 ? (
                    <div style={{ overflowX: 'auto', flexGrow: 1 }}>
                      <table className="stock-control-table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerOrders.slice(0, 3).map((o) => (
                            <tr key={o.id}>
                              <td><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: '13px' }}>{o.id}</strong></td>
                              <td><span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{o.date}</span></td>
                              <td><strong style={{ color: 'var(--text-primary)' }}>${o.total}</strong></td>
                              <td>
                                <span className={`table-stock-badge ${o.status === 'Delivered' ? 'in' : o.status === 'Rejected' ? 'out' : 'low'}`}>
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state" style={{ padding: '24px 0' }}>
                      <ShoppingBag size={32} style={{ color: 'var(--text-muted)' }} />
                      <p style={{ fontSize: '13px' }}>No orders placed yet.</p>
                    </div>
                  )}
                </div>

                {/* Notifications Panel */}
                <div className="chart-card glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0 }}>Recent Alerts</h3>
                    <button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setActiveTab('notifications')}>
                      Inbox
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1, overflowY: 'auto', maxHeight: '180px' }}>
                    {customerNotifications.length > 0 ? (
                      customerNotifications.slice(0, 3).map((n) => (
                        <div key={n.id} style={{ display: 'flex', gap: '8px', padding: '8px 10px', background: n.read ? 'transparent' : 'var(--accent-bg)', border: `1px solid ${n.read ? 'var(--glass-border)' : 'var(--accent-border)'}`, borderRadius: '10px' }}>
                          <Bell size={14} style={{ color: n.read ? 'var(--text-muted)' : 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                            {n.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state" style={{ padding: '24px 0' }}>
                        <Bell size={32} style={{ color: 'var(--text-muted)' }} />
                        <p style={{ fontSize: '13px' }}>No notifications received.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Guidelines */}
              <div className="guidelines-card glass-card">
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="guideline-icon" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4>Secure Customer Policy</h4>
                    <p>
                      Your privacy is secured with ShopStack Buyer Protection. 
                      Never share account credentials or transaction links with external agents. 
                      All refunds are processed directly back to the checkout card details inside 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & TRACKING */}
          {activeTab === 'orders' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Orders & Shipping Tracking</h2>
                <p>Verify package tracking pathways, statuses, and vendor receipts</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {customerOrders.length > 0 ? (
                  customerOrders.map((order) => (
                    <div className="glass-card order-history-card" key={order.id} style={{ padding: '24px' }}>
                      {/* Order Header Info */}
                      <div className="order-history-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Order ID</span>
                            <h4 style={{ margin: '2px 0 0 0', fontSize: '15px', color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{order.id}</h4>
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Placed On</span>
                            <h4 style={{ margin: '2px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>{order.date}</h4>
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Total Amount</span>
                            <h4 style={{ margin: '2px 0 0 0', fontSize: '14px', color: 'var(--text-primary)' }}>${order.total}</h4>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {(order.status === 'Pending' || order.status === 'Processing') && (
                            <button 
                              className="primary-btn"
                              style={{ 
                                padding: '6px 12px', 
                                fontSize: '11.5px', 
                                background: 'rgba(239, 68, 68, 0.15)', 
                                border: '1px solid rgba(239, 68, 68, 0.3)', 
                                color: '#ef4444',
                                cursor: 'pointer',
                                height: 'fit-content'
                              }}
                              onClick={() => setCancellingOrder(order)}
                            >
                              Cancel Order
                            </button>
                          )}

                          <span className={`table-stock-badge ${order.status === 'Delivered' ? 'in' : (order.status === 'Rejected' || order.status === 'Cancelled') ? 'out' : 'low'}`} style={{ fontSize: '12px', padding: '6px 14px' }}>
                            {order.status}
                          </span>
                          
                          <button 
                            className="secondary-btn" 
                            style={{ 
                              padding: '6px 10px', 
                              background: 'rgba(239, 68, 68, 0.1)', 
                              border: '1px solid rgba(239, 68, 68, 0.25)', 
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: 'fit-content'
                            }}
                            onClick={() => setDeleteOrderConfirm(order)}
                            title="Delete Order History"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Purchased Items List */}
                      <div className="order-history-items" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: idx < order.items.length - 1 ? '1px solid rgba(255, 255, 255, 0.03)' : 'none', paddingBottom: idx < order.items.length - 1 ? '12px' : 0 }}>
                            <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} />
                            <div style={{ flexGrow: 1, textAlign: 'left' }}>
                              <h5 style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: '700' }}>{item.name}</h5>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Brand: {item.vendor}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: '700' }}>${item.price}</span>
                              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Visual Stepper / Timeline (Only show if not rejected) */}
                      {order.status !== 'Rejected' && order.status !== 'Cancelled' ? (
                        <div className="order-tracking-stepper-container" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                          <h5 style={{ margin: '0 0 16px 0', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Package Journey</h5>
                          
                          <div className="order-stepper-timeline">
                            {['Order Placed', 'Processing', 'Packed', 'In Transit (Shipped)', 'Delivered'].map((stepName, stepIdx) => {
                              const activeIdx = getStatusIndex(order.status);
                              const isDone = stepIdx <= activeIdx;
                              const isCurrent = stepIdx === activeIdx;

                              return (
                                <div key={stepIdx} className={`stepper-node ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                                  <div className="stepper-circle">
                                    {isDone && stepIdx < activeIdx ? <Check size={12} /> : <span>{stepIdx + 1}</span>}
                                  </div>
                                  <span className="stepper-label">{stepName}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : order.status === 'Cancelled' ? (
                        <div className="rejected-order-banner glass-element" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
                          <div style={{ textAlign: 'left' }}>
                            <h5 style={{ margin: '0 0 4px 0', color: '#ef4444', fontSize: '13.5px', fontWeight: '750' }}>Order Cancelled</h5>
                            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                              You cancelled this order. The refund is being processed.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="rejected-order-banner glass-element" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
                          <div style={{ textAlign: 'left' }}>
                            <h5 style={{ margin: '0 0 4px 0', color: '#ef4444', fontSize: '13.5px', fontWeight: '750' }}>Order Rejected by Merchant</h5>
                            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                              Rejection Reason: <strong>"{order.rejectionReason || 'Vendor catalog stock error'}"</strong>. Refund initiated.
                            </p>
                          </div>
                        </div>
                      )}

                    </div>
                  ))
                ) : (
                  <div className="glass-card empty-state" style={{ padding: '60px 24px' }}>
                    <ShoppingBag size={48} style={{ color: 'var(--text-muted)' }} />
                    <h3>No orders listed</h3>
                    <p>You have not placed any orders yet. Visit our shop categories to purchase items.</p>
                    <button className="primary-btn" onClick={() => onNavigate('landing')} style={{ marginTop: '12px' }}>
                      Explore Products
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Boutique Wishlist</h2>
                <p>Inspect saved listings, check stock and move items to bag</p>
              </div>

              {wishlistProducts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
                    <button 
                      className="secondary-btn" 
                      style={{ padding: '8px 16px', fontSize: '13px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                      onClick={() => setWishlistClearConfirm(true)}
                    >
                      <Trash2 size={14} style={{ marginRight: '6px' }} />
                      <span>Clear Wishlist</span>
                    </button>
                  </div>

                  <div className="dashboard-products-grid">
                    {wishlistProducts.map((p) => (
                      <div className="product-card glass-card" key={p.id} style={{ height: 'auto', padding: '16px' }}>
                        <div className="product-image-container">
                          <img src={p.image} alt={p.name} className="product-image" />
                          <span className="product-badge">${p.price}</span>
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
                            style={{ flex: 1, padding: '8px 12px', fontSize: '12px', justifyContent: 'center' }}
                            onClick={() => setSelectedProduct(p)}
                          >
                            <Eye size={14} style={{ marginRight: '4px' }} />
                            <span>Details</span>
                          </button>
                          
                          <button 
                            className="secondary-btn" 
                            style={{ padding: '8px 12px', fontSize: '12.5px', justifyContent: 'center' }}
                            onClick={() => handleAddToCart(p)}
                            title="Add to cart"
                          >
                            <ShoppingBag size={14} />
                          </button>

                          <button 
                            className="secondary-btn" 
                            style={{ padding: '8px 12px', fontSize: '12.5px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444' }}
                            onClick={() => setRemoveItemConfirm(p)}
                            title="Remove from wishlist"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="glass-card empty-state" style={{ padding: '60px 24px' }}>
                  <Heart size={48} style={{ color: 'var(--text-muted)' }} />
                  <h3>Your wishlist is empty</h3>
                  <p>Browse our catalog and save items you want to keep track of.</p>
                  <button className="primary-btn" onClick={() => onNavigate('landing')} style={{ marginTop: '12px' }}>
                    Start Saving Items
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Alert Notification Center</h2>
                <p>Read shipping warnings, status change notifications and receipts</p>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px', marginBottom: '20px' }}>
                  <button className="secondary-btn" style={{ padding: '8px 14px', fontSize: '12.5px' }} onClick={handleMarkAllRead} disabled={unreadCount === 0}>
                    Mark All as Read
                  </button>
                  <button className="secondary-btn" style={{ padding: '8px 14px', fontSize: '12.5px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }} onClick={handleClearNotifications} disabled={customerNotifications.length === 0}>
                    Clear Log
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {customerNotifications.length > 0 ? (
                    customerNotifications.map((n) => (
                      <div 
                        key={n.id} 
                        className="notification-item-row"
                        style={{ 
                          display: 'flex', 
                          gap: '16px', 
                          padding: '16px', 
                          borderRadius: '12px', 
                          border: `1px solid ${n.read ? 'var(--glass-border)' : 'var(--accent-border)'}`, 
                          background: n.read ? 'var(--input-bg)' : 'var(--accent-bg)',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          background: n.read ? 'rgba(255,255,255,0.05)' : 'var(--accent)', 
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Bell size={16} />
                        </div>

                        <div style={{ flexGrow: 1 }}>
                          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: n.read ? '500' : '700', lineHeight: '1.5' }}>
                            {n.message}
                          </p>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'inline-block' }}>
                            Alert logged on {n.date}
                          </span>
                        </div>

                        {!n.read && (
                          <button 
                            className="secondary-btn" 
                            style={{ padding: '4px 8px', fontSize: '11px', height: 'fit-content' }}
                            onClick={() => {
                              const updated = notifications.map(notif => notif.id === n.id ? { ...notif, read: true } : notif);
                              onUpdateNotifications(updated);
                              addToast('Marked as read');
                            }}
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state" style={{ padding: '40px 0' }}>
                      <Bell size={44} style={{ color: 'var(--text-muted)' }} />
                      <h3>Inbox is clean</h3>
                      <p>You have no notifications currently.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'security' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Boutique Security</h2>
                <p>Modify security credentials, logins, and passwords</p>
              </div>

              <div className="glass-card form-layout-card" style={{ maxWidth: '600px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>Change Account Password</h3>
                
                <form onSubmit={handlePasswordSubmit} className="security-settings-form">
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

          {activeTab === 'profile' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>My Personal Profile Details</h2>
                <p>Manage your account profile details, shipping, and contact records</p>
              </div>

              <div className="profile-grid-layout">
                {/* Left Panel: Avatar & Quick Info */}
                <div className="profile-avatar-card glass-card">
                  <div className="profile-avatar-circle">
                    {profileForm.name ? profileForm.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'SJ'}
                  </div>
                  <h3 className="profile-avatar-title">{profileForm.name}</h3>
                  <span className="profile-avatar-role">Boutique Buyer</span>
                  
                  <div style={{ marginTop: '24px', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Status</span>
                      <span style={{ color: '#10b981', fontWeight: '700' }}>Active Account</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Member Since</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{profileForm.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Form Fields */}
                <form onSubmit={handleProfileSave} className="profile-form-card glass-card">
                  
                  {/* Account Information Section */}
                  <div className="profile-form-section">
                    <h4 className="profile-section-title">Personal Records</h4>
                    <div className="profile-input-grid">
                      <div className="payment-input-group">
                        <label>Full Contact Name</label>
                        <input 
                          type="text" 
                          value={profileForm.name} 
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                          placeholder="Sarah Jenkins"
                          required
                        />
                      </div>
                      <div className="payment-input-group">
                        <label>Private Email Address</label>
                        <input 
                          type="email" 
                          value={profileForm.email} 
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} 
                          placeholder="sarah@jenkins.com"
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
                          placeholder="+1 555-019-2834"
                        />
                      </div>
                      <div className="payment-input-group">
                        <label>Join Timeline</label>
                        <input 
                          type="text" 
                          value={profileForm.memberSince} 
                          disabled
                          style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Addresses Section */}
                  <div className="profile-form-section" style={{ marginTop: '20px' }}>
                    <h4 className="profile-section-title">Primary Shipping Destination</h4>
                    <div className="payment-input-group">
                      <label>Street Address</label>
                      <input 
                        type="text" 
                        value={profileForm.address} 
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} 
                        placeholder="128 Boutique Blvd, Floor 4"
                      />
                    </div>
                    
                    <div className="profile-input-grid" style={{ marginTop: '12px' }}>
                      <div className="payment-input-group">
                        <label>City</label>
                        <input 
                          type="text" 
                          value={profileForm.city} 
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })} 
                          placeholder="Beverly Hills"
                        />
                      </div>
                      <div className="payment-row-grid" style={{ gap: '16px' }}>
                        <div className="payment-input-group">
                          <label>State / Region</label>
                          <input 
                            type="text" 
                            value={profileForm.state} 
                            onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })} 
                            placeholder="CA"
                          />
                        </div>
                        <div className="payment-input-group">
                          <label>ZIP / Postal</label>
                          <input 
                            type="text" 
                            value={profileForm.zipCode} 
                            onChange={(e) => setProfileForm({ ...profileForm, zipCode: e.target.value })} 
                            placeholder="90210"
                          />
                        </div>
                      </div>
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

      {/* Wishlist Clear Confirm Dialog Modal */}
      {wishlistClearConfirm && (
        <div 
          className="glass-modal-overlay open"
          style={{ zIndex: 4000 }}
          onClick={() => setWishlistClearConfirm(false)}
        >
          <div className="glass-modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setWishlistClearConfirm(false)}>
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
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 10px 0', textAlign: 'center' }}>Clear Wishlist?</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 24px 0', textAlign: 'center' }}>
                Are you sure you want to remove all saved items from your wishlist? This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="secondary-btn" 
                  style={{ flex: 1, padding: '10px 14px', justifyContent: 'center' }} 
                  onClick={() => setWishlistClearConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-btn" 
                  style={{ flex: 1, padding: '10px 14px', justifyContent: 'center', background: '#ef4444', color: '#fff' }} 
                  onClick={() => {
                    onSaveWishlist([]);
                    addToast('Wishlist cleared.', 'info');
                    setWishlistClearConfirm(false);
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Single Item from Wishlist Confirm Dialog Modal */}
      {removeItemConfirm && (
        <div 
          className="glass-modal-overlay open"
          style={{ zIndex: 4000 }}
          onClick={() => setRemoveItemConfirm(null)}
        >
          <div className="glass-modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setRemoveItemConfirm(null)}>
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
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 10px 0', textAlign: 'center' }}>Remove Item?</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 24px 0', textAlign: 'center' }}>
                Are you sure you want to remove **"{removeItemConfirm.name}"** from your wishlist?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="secondary-btn" 
                  style={{ flex: 1, padding: '10px 14px', justifyContent: 'center' }} 
                  onClick={() => setRemoveItemConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-btn" 
                  style={{ flex: 1, padding: '10px 14px', justifyContent: 'center', background: '#ef4444', color: '#fff' }} 
                  onClick={() => {
                    handleRemoveFromWishlist(removeItemConfirm.id);
                    setRemoveItemConfirm(null);
                  }}
                >
                  Confirm Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Single Order History Confirm Dialog Modal */}
      {deleteOrderConfirm && (
        <div 
          className="glass-modal-overlay open"
          style={{ zIndex: 4000 }}
          onClick={() => setDeleteOrderConfirm(null)}
        >
          <div className="glass-modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDeleteOrderConfirm(null)}>
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
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 10px 0', textAlign: 'center' }}>Delete Order?</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 24px 0', textAlign: 'center' }}>
                Are you sure you want to remove **"{deleteOrderConfirm.id}"** from your saved tracking history?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="secondary-btn" 
                  style={{ flex: 1, padding: '10px 14px', justifyContent: 'center' }} 
                  onClick={() => setDeleteOrderConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="primary-btn" 
                  style={{ flex: 1, padding: '10px 14px', justifyContent: 'center', background: '#ef4444', color: '#fff' }} 
                  onClick={() => {
                    handleDeleteOrder(deleteOrderConfirm.id);
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Product Modal */}
      <div className={`glass-modal-overlay ${selectedProduct ? 'open' : ''}`} onClick={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={18} />
            </button>
            <div className="quickview-layout">
              <div className="quickview-image-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: 'auto' }}>
                <div style={{ height: '280px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'var(--input-bg)' }}>
                  <img 
                    src={activeQuickViewImage || selectedProduct.image} 
                    alt={selectedProduct.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="quickview-thumbnails" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {selectedProduct.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '8px',
                          border: `2px solid ${(activeQuickViewImage || selectedProduct.image) === imgUrl ? 'var(--accent)' : 'var(--glass-border)'}`,
                          padding: 0,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          background: 'none',
                          flexShrink: 0,
                          transition: 'var(--transition-smooth)'
                        }}
                        onClick={() => setActiveQuickViewImage(imgUrl)}
                      >
                        <img src={imgUrl} alt={`thumbnail-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="quickview-details">
                <span className="product-vendor" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                  {selectedProduct.vendor}
                </span>
                <h3 className="quickview-title">{selectedProduct.name}</h3>
                
                <div className="quickview-meta">
                  <span className="product-rating">
                    <Star size={16} fill="#fb3" color="#fb3" />
                    <strong style={{ marginLeft: '4px' }}>{selectedProduct.rating}</strong>
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    ({selectedProduct.reviews} customer reviews)
                  </span>
                </div>

                <p className="quickview-desc">{selectedProduct.description}</p>
                
                <div style={{ marginBottom: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Truck size={14} color="var(--secondary-glow)" />
                    <span>Free shipping in 2 business days.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={14} color="var(--primary-glow)" />
                    <span>Includes 1 year merchant warranty.</span>
                  </div>
                </div>

                <div className="quickview-price-action">
                  <div className="quickview-price">${selectedProduct.price}</div>
                  <button className="primary-btn" onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}>
                    <ShoppingBag size={16} />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Order Confirm Dialog Modal */}
      {cancellingOrder && (
        <div 
          className="glass-modal-overlay open"
          style={{ zIndex: 4000 }}
          onClick={() => setCancellingOrder(null)}
        >
          <div className="glass-modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCancellingOrder(null)}>
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
                <AlertTriangle size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 10px 0', textAlign: 'center' }}>Cancel Order?</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 24px 0', textAlign: 'center' }}>
                Are you sure you want to cancel order **"{cancellingOrder.id}"**? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="secondary-btn" 
                  style={{ flex: 1, padding: '10px 14px', justifyContent: 'center' }} 
                  onClick={() => setCancellingOrder(null)}
                >
                  Go Back
                </button>
                <button 
                  className="primary-btn" 
                  style={{ flex: 1, padding: '10px 14px', justifyContent: 'center', background: '#ef4444', color: '#fff' }} 
                  onClick={handleConfirmCancel}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
