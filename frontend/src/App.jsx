import React, { useState, useEffect } from 'react';
import { api, tokenStorage } from './api';
import AuthPortal from './components/AuthPortal';
import CustomerPortal from './components/CustomerPortal';
import VendorPortal from './components/VendorPortal';
import AdminPortal from './components/AdminPortal';
import CheckoutPortal from './components/CheckoutPortal';

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('shop'); // 'shop', 'auth', 'vendor', 'admin'
  const [toasts, setToasts] = useState([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  // Load user session on startup
  useEffect(() => {
    const initSession = async () => {
      const token = tokenStorage.getToken();
      if (token) {
        try {
          const fetchedUser = await api.auth.me();
          setUser(fetchedUser);
          // Send user to appropriate view by default
          if (fetchedUser.role === 'ADMIN') {
            setCurrentView('admin');
          } else if (fetchedUser.role === 'VENDOR') {
            setCurrentView('vendor');
          } else {
            setCurrentView('shop');
          }
        } catch (err) {
          console.error('Session restoration failed', err);
          tokenStorage.clearToken();
          setUser(null);
        }
      }
      setAppLoading(false);
    };
    initSession();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('shopstack_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('shopstack_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast notifications helper
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSignOut = () => {
    tokenStorage.clearToken();
    setUser(null);
    setCart([]);
    setCurrentView('shop');
    addToast('Signed out successfully!', 'info');
  };

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'ADMIN') {
      setCurrentView('admin');
    } else if (loggedInUser.role === 'VENDOR') {
      setCurrentView('vendor');
    } else {
      setCurrentView('shop');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCurrentView('checkout');
    setShowCartDrawer(false);
  };

  const updateCartQty = (id, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  if (appLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-main)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Dynamic Navigation Header */}
      <header className="app-header">
        <div className="logo-container" onClick={() => setCurrentView('shop')}>
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">ShopStack</span>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-link ${currentView === 'shop' ? 'active' : ''}`}
            onClick={() => setCurrentView('shop')}
            style={{ background: 'transparent', border: 'none', font: 'inherit' }}
          >
            Shop
          </button>
          
          {user && user.role === 'VENDOR' && (
            <button 
              className={`nav-link ${currentView === 'vendor' ? 'active' : ''}`}
              onClick={() => setCurrentView('vendor')}
              style={{ background: 'transparent', border: 'none', font: 'inherit' }}
            >
              Merchant Panel
            </button>
          )}

          {user && user.role === 'ADMIN' && (
            <button 
              className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentView('admin')}
              style={{ background: 'transparent', border: 'none', font: 'inherit' }}
            >
              Admin Dashboard
            </button>
          )}
        </nav>

        <div className="nav-actions">
          {/* Cart Trigger */}
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', position: 'relative' }}
            onClick={() => setShowCartDrawer(true)}
          >
            🛒 Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
          </button>

          {/* User Signin / Info */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  {user.role}
                </div>
              </div>
              <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }} onClick={() => setCurrentView('auth')}>
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Portals Router Content */}
      <main style={{ minHeight: 'calc(100vh - 72px)', background: 'var(--bg-main)' }}>
        {currentView === 'shop' && (
          <div className="main-content">
            <CustomerPortal user={user} cart={cart} setCart={setCart} addToast={addToast} />
          </div>
        )}

        {currentView === 'checkout' && (
          <div className="main-content">
            <CheckoutPortal user={user} cart={cart} setCart={setCart} addToast={addToast} onComplete={() => setCurrentView('shop')} />
          </div>
        )}

        {currentView === 'auth' && (
          <AuthPortal onAuthSuccess={handleAuthSuccess} addToast={addToast} />
        )}

        {currentView === 'vendor' && user && user.role === 'VENDOR' && (
          <div className="main-content">
            <VendorPortal user={user} addToast={addToast} />
          </div>
        )}

        {currentView === 'admin' && user && user.role === 'ADMIN' && (
          <AdminPortal user={user} addToast={addToast} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--bg-main)' }}>
        <p>© 2026 ShopStack Enterprise Multi-Vendor Platform. Built with high fidelity design.</p>
      </footer>

      {/* SHOPPING CART DRAWER MODAL */}
      {showCartDrawer && (
        <div className="modal-overlay" onClick={() => setShowCartDrawer(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'fixed', right: 0, top: 0, bottom: 0, height: '100vh', width: '380px', borderRadius: 0, maxWidth: '100%', textAlign: 'left', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <button className="modal-close" onClick={() => setShowCartDrawer(false)}>×</button>
            
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '1.5rem' }}>Shopping Bag</h3>

            {cart.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</span>
                <p>Your shopping bag is empty.</p>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingRight: '0.5rem' }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                      <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        📦
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.productName || item.name}</h4>
                        <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.9rem' }}>${item.price}</span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}
                            onClick={() => updateCartQty(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}
                            onClick={() => updateCartQty(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>
                    <span>Estimated Total:</span>
                    <span style={{ color: 'var(--secondary)' }}>${calculateTotal()}</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
                    Process Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TOAST SYSTEM ALERTS */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'info' && 'ℹ️'}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
