import { useState, useEffect } from 'react';
import LandingPage from './pages/customer/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import WishlistPage from './pages/customer/WishlistPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  
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

  // Keep body class in sync with the theme state
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('shopstack_user', JSON.stringify(userData));
    setCurrentPage('landing');
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

  if (currentPage === 'login') {
    return (
      <Login 
        onNavigate={setCurrentPage} 
        onLoginSuccess={handleLoginSuccess} 
        theme={theme} 
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <Register 
        onNavigate={setCurrentPage} 
        onRegisterSuccess={handleLoginSuccess} 
        theme={theme} 
      />
    );
  }

  if (currentPage === 'wishlist') {
    return (
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
      />
    );
  }

  return (
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
    />
  );
}

export default App;