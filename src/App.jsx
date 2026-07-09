import { useState, useEffect } from 'react';
import LandingPage from './pages/customer/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import WishlistPage from './pages/customer/WishlistPage';
import VendorDashboard from './pages/vendor/VendorDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import { PRODUCTS_DATA } from './data/products';
import PaymentGatewayModal from './components/common/PaymentGatewayModal';

const DEFAULT_MOCK_ORDERS = [
  {
    id: 'ORD-5481',
    customerName: 'Marcus Aurelius',
    customerEmail: 'marcus@rome.gov',
    date: '2026-07-06',
    total: 749.98,
    status: 'Pending',
    rejectionReason: '',
    items: [
      {
        productId: 'e1',
        name: 'ShopStack Pro VR Headset',
        price: 599.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&auto=format&fit=crop&q=60',
        vendor: 'ElectroLux Systems'
      },
      {
        productId: 'e2',
        name: 'AuraSound Noise Cancelling Earbuds',
        price: 149.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60',
        vendor: 'WaveAudio Lab'
      }
    ]
  },
  {
    id: 'ORD-3294',
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor@vance.io',
    date: '2026-07-05',
    total: 339.98,
    status: 'Processing',
    rejectionReason: '',
    items: [
      {
        productId: 'e3',
        name: 'Quantum Chrono Watch Series X',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=60',
        vendor: 'ChronosTech'
      },
      {
        productId: 'f4',
        name: 'FlexFit Breathable Knit Tee',
        price: 39.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
        vendor: 'UrbanVibe Apparel'
      }
    ]
  },
  {
    id: 'ORD-1192',
    customerName: 'Diana Prince',
    customerEmail: 'diana@themyscira.org',
    date: '2026-07-04',
    total: 199.99,
    status: 'Delivered',
    rejectionReason: '',
    items: [
      {
        productId: 'f1',
        name: 'ThermoSkin Smart Parka Jacket',
        price: 199.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60',
        vendor: 'UrbanVibe Apparel'
      }
    ]
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [checkoutCart, setCheckoutCart] = useState(null);
  
  // Lazily initialize user and theme from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shopstack_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('shopstack_theme');
    return savedTheme || 'dark';
  });

  // Global Cart and Wishlist States
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopstack_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('shopstack_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('shopstack_products');
    return savedProducts ? JSON.parse(savedProducts) : PRODUCTS_DATA;
  });

  const handleUpdateProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('shopstack_products', JSON.stringify(newProducts));
  };

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('shopstack_orders');
    const loaded = savedOrders ? JSON.parse(savedOrders) : DEFAULT_MOCK_ORDERS;
    return loaded.filter(o => 
      o.customerName?.toLowerCase() !== 'shruti jain' &&
      !o.customerEmail?.toLowerCase().includes('shruti')
    );
  });

  const handleUpdateOrders = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem('shopstack_orders', JSON.stringify(newOrders));
  };

  const [notifications, setNotifications] = useState(() => {
    const savedNotifs = localStorage.getItem('shopstack_notifications');
    return savedNotifs ? JSON.parse(savedNotifs) : [];
  });

  const handleUpdateNotifications = (newNotifs) => {
    setNotifications(newNotifs);
    localStorage.setItem('shopstack_notifications', JSON.stringify(newNotifs));
  };

  const handleUpdateOrderStatus = (orderId, newStatus, rejectionReason = '') => {
    const oldOrder = orders.find(o => o.id === orderId);
    const oldStatus = oldOrder ? oldOrder.status : '';
    
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus, rejectionReason: rejectionReason || o.rejectionReason };
      }
      return o;
    });
    
    const filtered = updated.filter(o => 
      o.customerName?.toLowerCase() !== 'shruti jain' &&
      !o.customerEmail?.toLowerCase().includes('shruti')
    );
    
    setOrders(filtered);
    localStorage.setItem('shopstack_orders', JSON.stringify(filtered));
    
    if (oldStatus && oldStatus !== newStatus) {
      const notifMessage = newStatus === 'Rejected'
        ? `Your order ${orderId} has been rejected by the vendor. Reason: "${rejectionReason || 'No reason provided'}"`
        : `Your order ${orderId} status has changed from ${oldStatus} to ${newStatus}.`;
        
      const newNotif = {
        id: `notif-${Date.now()}`,
        orderId,
        customerEmail: oldOrder ? oldOrder.customerEmail : '',
        message: notifMessage,
        date: new Date().toISOString().split('T')[0],
        read: false
      };
      
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem('shopstack_notifications', JSON.stringify(updatedNotifs));
    }
  };

  const handleCheckout = (cartItems) => {
    if (!cartItems || cartItems.length === 0) return;
    setCheckoutCart(cartItems);
  };

  const handlePaymentSuccess = () => {
    if (!checkoutCart || checkoutCart.length === 0) return;
    
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderDate = new Date().toISOString().split('T')[0];
    
    const items = checkoutCart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      vendor: item.product.vendor
    }));
    
    const total = checkoutCart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const tax = total * 0.08;
    const shipping = total > 300 ? 0 : 15.00;
    const finalTotal = total + tax + shipping;

    const newOrder = {
      id: orderId,
      customerName: user ? user.name : 'Sarah Jenkins',
      customerEmail: user ? user.email : 'sarah@jenkins.com',
      date: orderDate,
      total: parseFloat(finalTotal.toFixed(2)),
      status: 'Pending',
      rejectionReason: '',
      items: items
    };
    
    const updatedOrders = [newOrder, ...orders].filter(o => 
      o.customerName?.toLowerCase() !== 'shruti jain' &&
      !o.customerEmail?.toLowerCase().includes('shruti')
    );
    setOrders(updatedOrders);
    localStorage.setItem('shopstack_orders', JSON.stringify(updatedOrders));
    
    handleSaveCart([]);
    setCheckoutCart(null);
    setCurrentPage('customer-dashboard');
  };

  const handleUpdateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('shopstack_user', JSON.stringify(updatedUserData));
  };

  // Keep body class in sync with the theme state
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('shopstack_user', JSON.stringify(userData));
    if (userData && userData.role === 'vendor') {
      setCurrentPage('vendor-dashboard');
    } else {
      setCurrentPage('customer-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shopstack_user');
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('shopstack_theme', nextTheme);
  };

  const handleSaveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('shopstack_cart', JSON.stringify(newCart));
  };

  const handleSaveWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('shopstack_wishlist', JSON.stringify(newWishlist));
  };

  let content;
  
  if (currentPage === 'login') {
    content = (
      <Login 
        onNavigate={setCurrentPage} 
        onLoginSuccess={handleLoginSuccess} 
        theme={theme} 
      />
    );
  } else if (currentPage === 'register') {
    content = (
      <Register 
        onNavigate={setCurrentPage} 
        onRegisterSuccess={handleLoginSuccess} 
        theme={theme} 
      />
    );
  } else if (currentPage === 'wishlist') {
    content = (
      <WishlistPage 
        onNavigate={setCurrentPage}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        cart={cart}
        onSaveCart={handleSaveCart}
        wishlist={wishlist}
        onSaveWishlist={handleSaveWishlist}
        products={products}
        notifications={notifications}
        onCheckout={handleCheckout}
      />
    );
  } else if (currentPage === 'vendor-dashboard') {
    content = (
      <VendorDashboard
        onNavigate={setCurrentPage}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        products={products}
        onUpdateProducts={handleUpdateProducts}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateUser={handleUpdateUser}
      />
    );
  } else if (currentPage === 'customer-dashboard') {
    content = (
      <CustomerDashboard
        onNavigate={setCurrentPage}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        products={products}
        wishlist={wishlist}
        onSaveWishlist={handleSaveWishlist}
        cart={cart}
        onSaveCart={handleSaveCart}
        orders={orders}
        notifications={notifications}
        onUpdateNotifications={handleUpdateNotifications}
        onUpdateOrders={handleUpdateOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateUser={handleUpdateUser}
      />
    );
  } else {
    content = (
      <LandingPage 
        onNavigate={setCurrentPage} 
        user={user} 
        onLogout={handleLogout}
        appTheme={theme}
        onToggleAppTheme={handleToggleTheme}
        cart={cart}
        onSaveCart={handleSaveCart}
        wishlist={wishlist}
        onSaveWishlist={handleSaveWishlist}
        products={products}
        onUpdateProducts={handleUpdateProducts}
        onLoginSuccess={handleLoginSuccess}
        onCheckout={handleCheckout}
        notifications={notifications}
      />
    );
  }

  return (
    <>
      {content}
      {checkoutCart && (
        <PaymentGatewayModal
          cartItems={checkoutCart}
          user={user}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setCheckoutCart(null)}
          theme={theme}
        />
      )}
    </>
  );
}

export default App;