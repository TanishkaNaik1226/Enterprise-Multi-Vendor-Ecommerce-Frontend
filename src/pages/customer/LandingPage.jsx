import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Star, 
  ArrowRight, 
  ChevronRight, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Check, 
  Activity, 
  Layers, 
  Shield, 
  DollarSign, 
  Truck, 
  Sun, 
  Moon, 
  Menu, 
  Clock, 
  Compass, 
  Gift, 
  BarChart2, 
  Tag, 
  Warehouse, 
  Bell, 
  Briefcase 
} from 'lucide-react';
import './LandingPage.css';

// Product Catalog Database
const PRODUCTS_DATA = [
  // Electronics
  {
    id: 'e1',
    name: 'ShopStack Pro VR Headset',
    category: 'electronics',
    price: 599.99,
    rating: 4.8,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&auto=format&fit=crop&q=60',
    description: 'Immersive next-generation spatial computing headset with high-fidelity tracking, ergonomic weight distribution, and high-refresh dual displays. Ideal for developers and gamers.',
    vendor: 'ElectroLux Systems'
  },
  {
    id: 'e2',
    name: 'AuraSound Noise Cancelling Earbuds',
    category: 'electronics',
    price: 149.99,
    rating: 4.6,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60',
    description: 'Active hybrid noise-cancelling wireless earbuds with custom-tuned acoustic drivers, 36-hour battery life, and crystal-clear voice microphone pickup.',
    vendor: 'WaveAudio Lab'
  },
  {
    id: 'e3',
    name: 'Quantum Chrono Watch Series X',
    category: 'electronics',
    price: 299.99,
    rating: 4.7,
    reviews: 85,
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=60',
    description: 'State-of-the-art smartwatch containing health telemetry, built-in dual GPS, sapphire screen protection, and seamless multi-device notification pairing.',
    vendor: 'ChronosTech'
  },
  {
    id: 'e4',
    name: 'NeoCore Stylus Tablet Pro',
    category: 'electronics',
    price: 449.99,
    rating: 4.5,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60',
    description: 'Ultrathin drawing and productivity tablet with high pressure-sensitive digital stylus, vibrant 120Hz display, and robust octacore processor.',
    vendor: 'NeoCore Devices'
  },
  // Fashion
  {
    id: 'f1',
    name: 'ThermoSkin Smart Parka Jacket',
    category: 'fashion',
    price: 199.99,
    rating: 4.7,
    reviews: 140,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60',
    description: 'Windproof and waterproof winter parka integrated with premium thermal insulation, smart heat distribution lining, and hidden magnetic quick-release pockets.',
    vendor: 'UrbanVibe Apparel'
  },
  {
    id: 'f2',
    name: 'AeroPace Cushioned Runners',
    category: 'fashion',
    price: 129.99,
    rating: 4.9,
    reviews: 410,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    description: 'Ultra-lightweight athletic running shoes featuring dual-density cushion midsole foam, breathable knit exterior, and durable high-grip carbon rubber sole.',
    vendor: 'PaceAthletics'
  },
  {
    id: 'f3',
    name: 'Horizon Polarized Sunglasses',
    category: 'fashion',
    price: 89.99,
    rating: 4.4,
    reviews: 75,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60',
    description: 'Classic tortoiseshell sunglasses with 100% UVA/UVB polarized protective lenses and robust hand-polished acetate frames.',
    vendor: 'HorizonOptics'
  },
  {
    id: 'f4',
    name: 'FlexFit Breathable Knit Tee',
    category: 'fashion',
    price: 39.99,
    rating: 4.5,
    reviews: 180,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
    description: 'Pre-shrunk premium cotton athletic tee designed with ventilation channels for high moisture wicking during heavy daily workout routines.',
    vendor: 'UrbanVibe Apparel'
  },
  // Home & Living
  {
    id: 'h1',
    name: 'Lumina Smart Ambient Lamp',
    category: 'home',
    price: 79.99,
    rating: 4.6,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60',
    description: 'App-controlled customizable smart lamp producing 16 million colors, automated circadian sleep scheduling, and built-in white noise soundscape speaker.',
    vendor: 'LuminaDecors'
  },
  {
    id: 'h2',
    name: 'ErgoPosture Adjustable Office Chair',
    category: 'home',
    price: 249.99,
    rating: 4.8,
    reviews: 150,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=60',
    description: 'High-back ergonomic office chair built with fully adjustable lumbar support padding, 3D rotating armrests, and high-tension breathable cooling mesh back.',
    vendor: 'ComfortCo Furniture'
  },
  {
    id: 'h3',
    name: 'HydroPure Cold Press Juicer',
    category: 'home',
    price: 119.99,
    rating: 4.5,
    reviews: 90,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60',
    description: 'Low-speed masticating cold press juicer engineered to maximize juice yield and retain high nutritional value without causing high friction heat.',
    vendor: 'PureLiving Appliances'
  },
  {
    id: 'h4',
    name: 'SleepSoft Bamboo Bed Sheet Set',
    category: 'home',
    price: 69.99,
    rating: 4.7,
    reviews: 340,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop&q=60',
    description: 'Hypoallergenic and highly cooling 4-piece bed sheets manufactured using 100% organic, silky-soft bamboo fibers with deep double-stitched corner pockets.',
    vendor: 'ComfortCo Furniture'
  },
  // Beauty & Health
  {
    id: 'b1',
    name: 'Rejuvenate Vitamin C Glow Serum',
    category: 'beauty',
    price: 45.99,
    rating: 4.8,
    reviews: 620,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60',
    description: 'Brightening vitamin C face serum enriched with organic hyaluronic acid, ferulic acid, and orange fruit extracts. Formulated to correct hyperpigmentation.',
    vendor: 'GlowBotanics Co.'
  },
  {
    id: 'b2',
    name: 'HydroGlow Hyaluronic Hydration Cream',
    category: 'beauty',
    price: 38.99,
    rating: 4.7,
    reviews: 430,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60',
    description: 'Deep moisture-lock face cream infused with multi-molecular weight hyaluronic acid and botanical squalane to replenish skin texture overnight.',
    vendor: 'SkinScience Labs'
  },
  {
    id: 'b3',
    name: 'Lavender Essence Organic Calming Oil',
    category: 'beauty',
    price: 22.99,
    rating: 4.6,
    reviews: 190,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=60',
    description: '100% therapeutic grade pure cold-distilled organic lavender essential oil. Perfect for ambient diffusers, calming baths, and soothing body massages.',
    vendor: 'GlowBotanics Co.'
  },
  {
    id: 'b4',
    name: 'SonicGlow Facial Cleansing Brush',
    category: 'beauty',
    price: 85.99,
    rating: 4.5,
    reviews: 80,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60',
    description: 'Ultra-hygienic sonic silicone facial brush delivering 8,000 pulsations per minute. Designed to gently unclog pores and remove makeup residue.',
    vendor: 'SkinScience Labs'
  }
];

// Developer Roadmap Timeline (based on the PDF Milestones)
const MILESTONES = [
  {
    title: 'Project Initialization & Core Setup',
    week: 'Weeks 1 & 2',
    color: '#aa3bff',
    tasks: [
      'Define marketplace architecture & database entity schemas (PostgreSQL)',
      'Setup React (Vite) frontend + Spring Boot Maven backend',
      'Implement JWT & OAuth2 login routes with Role-Based Access Control',
      'Initialize Customer, Vendor, and Admin management structures'
    ],
    outcome: 'Basic working environment with authentication and database connections established.'
  },
  {
    title: 'Inventory, Pricing & Order Processing',
    week: 'Weeks 3 & 4',
    color: '#3b82f6',
    tasks: [
      'Build product catalog module (category listings & multi-vendor metadata)',
      'Develop real-time inventory tracking and low-stock notification alerts',
      'Create interactive shopping cart management & secure checkout integration',
      'Configure payment gateways (Stripe, Razorpay, and PayPal)'
    ],
    outcome: 'Fully operational checkout sequence, with inventory updates and payment verifications.'
  },
  {
    title: 'Admin Dashboards, Coupons & Logistics',
    week: 'Weeks 5 & 6',
    color: '#ec4899',
    tasks: [
      'Develop comprehensive coupon engine & automated discount promotional workflows',
      'Implement warehouse allocation system & package pick-and-pack routing',
      'Build Admin Dashboard for vendor approval reviews & platform commission management',
      'Configure real-time delivery status notifications and shipment tracking'
    ],
    outcome: 'Enterprise logistics workflows, platform fee collection, and promotional campaigns.'
  },
  {
    title: 'Testing, Deployment & Documentation',
    week: 'Weeks 7 & 8',
    color: '#10b981',
    tasks: [
      'Perform system integration tests using JUnit, Mockito, and React Testing Library',
      'Optimize API response times, query performance, and Redis cache hit ratios',
      'Deploy application containers using Docker Compose, Nginx, and cloud instances',
      'Compile final API documentation (Postman collection) and user manuals'
    ],
    outcome: 'Polished, containerized, and production-ready enterprise multi-vendor e-commerce site.'
  }
];

export default function LandingPage() {
  const [theme, setTheme] = useState('dark');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart & Wishlist States
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Open/Close Drawers & Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(0);
  
  // Toast Alerts State
  const [toasts, setToasts] = useState([]);
  
  // Vendor Registration State
  const [vendorForm, setVendorForm] = useState({
    name: '',
    email: '',
    shopName: '',
    category: 'electronics'
  });

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopstack_cart');
    const savedWishlist = localStorage.getItem('shopstack_wishlist');
    const savedTheme = localStorage.getItem('shopstack_theme');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme === 'light' ? 'light-theme' : '';
    }
  }, []);

  // Save changes to local storage
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('shopstack_cart', JSON.stringify(newCart));
  };

  const saveWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('shopstack_wishlist', JSON.stringify(newWishlist));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('shopstack_theme', nextTheme);
    document.body.className = nextTheme === 'light' ? 'light-theme' : '';
    addToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // Toast Helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Cart operations
  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      const updated = cart.map((item) => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(updated);
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }
    addToast(`Added "${product.name}" to cart!`);
  };

  const handleRemoveFromCart = (productId) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    saveCart(updated);
    addToast('Item removed from cart.', 'info');
  };

  const handleUpdateQuantity = (productId, delta) => {
    const updated = cart.map((item) => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  // Wishlist operations
  const handleToggleWishlist = (product) => {
    const isWishlisted = wishlist.includes(product.id);
    let updated;
    if (isWishlisted) {
      updated = wishlist.filter((id) => id !== product.id);
      addToast('Removed from wishlist.', 'info');
    } else {
      updated = [...wishlist, product.id];
      addToast(`Added "${product.name}" to wishlist!`);
    }
    saveWishlist(updated);
  };

  // Vendor Form Onboarding On-Submit
  const handleVendorSubmit = (e) => {
    e.preventDefault();
    if (!vendorForm.name || !vendorForm.shopName || !vendorForm.email) {
      addToast('Please fill out all fields.', 'info');
      return;
    }
    addToast(`Successfully registered "${vendorForm.shopName}"! Welcome to ShopStack.`, 'success');
    setVendorForm({ name: '', email: '', shopName: '', category: 'electronics' });
  };

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Cart totals
  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2);
  }, [cart]);

  return (
    <div className={`landing-page-container ${theme === 'light' ? 'light-theme' : ''}`}>
      
      {/* Visual background blurred gradients */}
      <div className="bg-blobs">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      {/* Frosted Navbar */}
      <header className="glass-navbar glass-element">
        <div className="section-width navbar-content">
          <a href="#" className="brand">
            <div className="brand-icon-wrapper" style={{ background: 'var(--button-primary)' }}>
              <Layers size={22} color="#fff" />
            </div>
            <span>Shop<span className="text-gradient">Stack</span></span>
          </a>

          <nav>
            <ul className="nav-links">
              <li><a href="#" className="active">Home</a></li>
              <li><a href="#browse-section">Browse Shop</a></li>
              <li><a href="#become-vendor-section">Sellers Portal</a></li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setDevModalOpen(true);
                  }}
                  style={{ color: 'var(--primary-glow)', fontWeight: '600' }}
                >
                  Developer Map
                </a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            {/* Dark Mode toggle button */}
            <button className="icon-btn" onClick={toggleTheme} title="Toggle dark/light mode">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wishlist toggle */}
            <button className="icon-btn" onClick={() => setWishlistOpen(true)} title="View wishlist">
              <Heart size={18} />
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </button>

            {/* Cart toggle */}
            <button className="icon-btn" onClick={() => setCartOpen(true)} title="View cart">
              <ShoppingBag size={18} />
              {totalCartCount > 0 && <span className="badge">{totalCartCount}</span>}
            </button>

            <button 
              className="primary-btn" 
              onClick={() => addToast('Authentication flows (OAuth2/JWT) are simulated under the "Developer Map".', 'info')}
            >
              <User size={16} />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-width hero-section">
        <div className="hero-badge">
          <Gift size={14} />
          <span>ShopStack Multi-Vendor Architecture 1.0</span>
        </div>
        <h1 className="hero-title">
          The Centralized <br />
          <span className="text-gradient">Enterprise Marketplace</span>
        </h1>
        <p className="hero-subtitle">
          Onboard multiple vendors, deploy customized catalogs, process secure global payments, 
          and track smart automated logistics through our unified glassmorphic commerce hub.
        </p>

        {/* Hero Search Box */}
        <div className="search-bar-hero glass-card">
          <Search size={22} style={{ color: 'var(--text-muted)', margin: 'auto 8px auto 16px' }} />
          <input 
            type="text" 
            placeholder="Search products, brands, or specific vendor shops..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="primary-btn" onClick={() => {
            document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <span>Search</span>
          </button>
        </div>

        {/* Quick Marketplace Stats */}
        <div className="stats-container">
          <div className="stat-item glass-card">
            <div className="stat-number">10k+</div>
            <div className="stat-label">Products Active</div>
          </div>
          <div className="stat-item glass-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Verified Sellers</div>
          </div>
          <div className="stat-item glass-card">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Payment Success</div>
          </div>
          <div className="stat-item glass-card">
            <div className="stat-number">&lt; 2s</div>
            <div className="stat-label">API Response Time</div>
          </div>
        </div>
      </section>

      {/* Feature Showcase (15 Modules from specification) */}
      <section className="section-width" style={{ marginBottom: '80px' }}>
        <div className="section-header">
          <span className="section-tag">Key Workflows</span>
          <h2 className="section-title">Architected for Scalability</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper" style={{ background: '#aa3bff' }}>
              <Shield size={20} />
            </div>
            <h3 className="feature-title">Role Access (JWT)</h3>
            <p className="feature-desc">Secure microservice auth defining Customers, Vendors, Admins, and Warehouse staff access rules.</p>
            <div className="feature-link" onClick={() => { setActiveMilestone(0); setDevModalOpen(true); }}>
              <span>View specs</span> <ArrowRight size={14} />
            </div>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper" style={{ background: '#3b82f6' }}>
              <DollarSign size={20} />
            </div>
            <h3 className="feature-title">Smart Checkouts</h3>
            <p className="feature-desc">Transactional integrity integrations linking Stripe, Razorpay, and PayPal multi-currency gateway settlements.</p>
            <div className="feature-link" onClick={() => { setActiveMilestone(1); setDevModalOpen(true); }}>
              <span>View specs</span> <ArrowRight size={14} />
            </div>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper" style={{ background: '#ec4899' }}>
              <Warehouse size={20} />
            </div>
            <h3 className="feature-title">Warehouse Allocation</h3>
            <p className="feature-desc">Automated inventory synchronization, localized stock movement routing, and courier pick-and-pack logic.</p>
            <div className="feature-link" onClick={() => { setActiveMilestone(2); setDevModalOpen(true); }}>
              <span>View specs</span> <ArrowRight size={14} />
            </div>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper" style={{ background: '#10b981' }}>
              <BarChart2 size={20} />
            </div>
            <h3 className="feature-title">Seller Analytics</h3>
            <p className="feature-desc">Real-time charts depicting revenue margins, system commission fees, customer conversion rates, and CSV exporting.</p>
            <div className="feature-link" onClick={() => { setActiveMilestone(3); setDevModalOpen(true); }}>
              <span>View specs</span> <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* Browse Catalog Section */}
      <section className="section-width products-showcase" id="browse-section">
        <div className="section-header">
          <span className="section-tag">Explore ShopStack</span>
          <h2 className="section-title">Featured Multi-Vendor Catalogs</h2>
        </div>

        {/* Category Tabs */}
        <div className="category-filter-nav">
          <button 
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <Compass size={16} />
            <span>All Categories</span>
          </button>
          <button 
            className={`category-tab ${activeCategory === 'electronics' ? 'active' : ''}`}
            onClick={() => setActiveCategory('electronics')}
          >
            <Layers size={16} />
            <span>Electronics</span>
          </button>
          <button 
            className={`category-tab ${activeCategory === 'fashion' ? 'active' : ''}`}
            onClick={() => setActiveCategory('fashion')}
          >
            <Tag size={16} />
            <span>Fashion</span>
          </button>
          <button 
            className={`category-tab ${activeCategory === 'home' ? 'active' : ''}`}
            onClick={() => setActiveCategory('home')}
          >
            <Warehouse size={16} />
            <span>Home & Living</span>
          </button>
          <button 
            className={`category-tab ${activeCategory === 'beauty' ? 'active' : ''}`}
            onClick={() => setActiveCategory('beauty')}
          >
            <Heart size={16} />
            <span>Beauty & Wellness</span>
          </button>
        </div>

        {/* Search Results Count info */}
        {searchQuery && (
          <div style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '15px' }}>
            Found {filteredProducts.length} items matching "{searchQuery}"
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div className="product-card glass-card" key={product.id}>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <span className="product-badge">${product.price}</span>
                    
                    <button 
                      className={`product-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
                      onClick={() => handleToggleWishlist(product)}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart size={16} fill={isWishlisted ? "#fff" : "none"} />
                    </button>
                  </div>

                  <div className="product-meta">
                    <span className="product-vendor">{product.vendor}</span>
                    <span className="product-rating">
                      <Star size={14} fill="#fb3" color="#fb3" />
                      <span>{product.rating}</span>
                    </span>
                  </div>

                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>

                  <div className="product-footer">
                    <button 
                      className="secondary-btn" 
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                      onClick={() => setSelectedProduct(product)}
                    >
                      Quick View
                    </button>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      title="Add to cart"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card empty-state">
            <Search size={40} style={{ color: 'var(--text-muted)' }} />
            <h3>No products found</h3>
            <p>Try searching for other terms or resetting your category filter.</p>
            <button className="primary-btn" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Become a Vendor Call to Action */}
      <section className="section-width" id="become-vendor-section">
        <div className="vendor-cta-banner glass-card">
          <div className="vendor-cta-content text-left">
            <h2>Expand Your Enterprise. <br /><span className="text-gradient">Sell on ShopStack.</span></h2>
            <p>
              Join hundreds of high-volume suppliers. Access custom catalog modules, real-time 
              pricing models, automated inventory dashboards, and rapid settlement workflows.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="#10b981" />
                <span>Low 2% Commission Fee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="#10b981" />
                <span>Instant Bank Settlements</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="#10b981" />
                <span>API ERP Integrations</span>
              </div>
            </div>
          </div>

          <form className="vendor-cta-form glass-element" onSubmit={handleVendorSubmit}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '0', marginBottom: '16px' }}>Request Vendor Onboarding</h3>
            <div className="form-group">
              <label>Contact Name</label>
              <input 
                type="text" 
                placeholder="Jane Doe" 
                value={vendorForm.name} 
                onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Work Email</label>
              <input 
                type="email" 
                placeholder="jane@company.com" 
                value={vendorForm.email}
                onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Shop / Business Name</label>
              <input 
                type="text" 
                placeholder="TechStore Premium" 
                value={vendorForm.shopName}
                onChange={(e) => setVendorForm({ ...vendorForm, shopName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Primary Category</label>
              <select 
                value={vendorForm.category}
                onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
              >
                <option value="electronics">Electronics & Gadgets</option>
                <option value="fashion">Fashion & Runners</option>
                <option value="home">Home & Furniture</option>
                <option value="beauty">Beauty & Wellness</option>
              </select>
            </div>
            <button className="primary-btn checkout-btn" type="submit" style={{ marginTop: '10px' }}>
              <span>Submit Registration</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* Sliding Shopping Cart Drawer */}
      <div className={`glass-drawer-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)}>
        <div className="glass-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h3 className="drawer-title">
              <ShoppingBag size={20} />
              <span>Shopping Cart ({totalCartCount})</span>
            </h3>
            <button className="drawer-close" onClick={() => setCartOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="drawer-body">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div className="drawer-item" key={item.product.id}>
                  <img src={item.product.image} alt={item.product.name} className="drawer-item-img" />
                  <div className="drawer-item-details">
                    <h4 className="drawer-item-name">{item.product.name}</h4>
                    <span className="drawer-item-vendor">Sold by: {item.product.vendor}</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="drawer-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                      <div className="drawer-item-actions">
                        <div className="quantity-controls">
                          <button className="qty-btn" onClick={() => handleUpdateQuantity(item.product.id, -1)}>
                            <Minus size={12} />
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => handleUpdateQuantity(item.product.id, 1)}>
                            <Plus size={12} />
                          </button>
                        </div>
                        <button className="item-delete-btn" onClick={() => handleRemoveFromCart(item.product.id)} title="Remove item">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                <h4>Your cart is empty</h4>
                <p>Browse our catalog and add items you want to purchase.</p>
                <button className="primary-btn" onClick={() => { setCartOpen(false); document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="drawer-footer">
              <div className="cart-summary">
                <span>Subtotal</span>
                <span>${totalCartPrice}</span>
              </div>
              <button 
                className="primary-btn checkout-btn" 
                onClick={() => {
                  saveCart([]);
                  setCartOpen(false);
                  addToast('Checkout simulated! Orders generated and sent to Warehouse modules.', 'success');
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sliding Wishlist Drawer */}
      <div className={`glass-drawer-overlay ${wishlistOpen ? 'open' : ''}`} onClick={() => setWishlistOpen(false)}>
        <div className="glass-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h3 className="drawer-title">
              <Heart size={20} />
              <span>Wishlist ({wishlist.length})</span>
            </h3>
            <button className="drawer-close" onClick={() => setWishlistOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="drawer-body">
            {wishlist.length > 0 ? (
              PRODUCTS_DATA.filter((p) => wishlist.includes(p.id)).map((product) => (
                <div className="drawer-item" key={product.id}>
                  <img src={product.image} alt={product.name} className="drawer-item-img" />
                  <div className="drawer-item-details">
                    <h4 className="drawer-item-name">{product.name}</h4>
                    <span className="drawer-item-vendor">Sold by: {product.vendor}</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span className="drawer-item-price">${product.price}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="primary-btn" 
                          style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '12px' }}
                          onClick={() => {
                            handleAddToCart(product);
                            handleToggleWishlist(product);
                          }}
                        >
                          <Plus size={12} /> Add
                        </button>
                        <button className="item-delete-btn" onClick={() => handleToggleWishlist(product)} title="Remove item">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                <h4>Your wishlist is empty</h4>
                <p>Save items you like to buy them later.</p>
                <button className="primary-btn" onClick={() => { setWishlistOpen(false); document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Explore Items
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Product Modal */}
      <div className={`glass-modal-overlay ${selectedProduct ? 'open' : ''}`} onClick={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={18} />
            </button>
            <div className="quickview-layout">
              <div className="quickview-image-panel">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
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
                    ({selectedProduct.reviews} validated customer reviews)
                  </span>
                </div>

                <p className="quickview-desc">{selectedProduct.description}</p>
                
                <div style={{ marginBottom: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Truck size={14} color="var(--secondary-glow)" />
                    <span>Free shipping from warehouse in 2 business days.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={14} color="var(--primary-glow)" />
                    <span>Includes 1 year merchant vendor warranty.</span>
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

      {/* Developer Project Flow Simulator Map Modal */}
      <div className={`glass-modal-overlay ${devModalOpen ? 'open' : ''}`} onClick={() => setDevModalOpen(false)}>
        <div className="glass-modal" style={{ width: '900px' }} onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setDevModalOpen(false)}>
            <X size={18} />
          </button>
          
          <div className="walkthrough-layout">
            <div className="walkthrough-header">
              <h2>ShopStack Integration Roadmap</h2>
              <p>This panel shows how pages and backend services interlink based on the multi-developer milestones.</p>
            </div>

            {/* Interactive Timeline Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
              {MILESTONES.map((milestone, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveMilestone(idx)}
                  className="secondary-btn"
                  style={{
                    borderColor: activeMilestone === idx ? milestone.color : 'var(--glass-border)',
                    background: activeMilestone === idx ? `${milestone.color}15` : 'transparent',
                    fontWeight: activeMilestone === idx ? '700' : '500',
                    fontSize: '13px'
                  }}
                >
                  Milestone {idx + 1}
                </button>
              ))}
            </div>

            {/* Highlighted Roadmap Milestone Details */}
            <div className="roadmap-card active-milestone" style={{ borderColor: MILESTONES[activeMilestone].color }}>
              <div 
                className="milestone-badge" 
                style={{ background: MILESTONES[activeMilestone].color }}
              >
                {MILESTONES[activeMilestone].week}
              </div>
              <h3 className="milestone-title">{MILESTONES[activeMilestone].title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: '500' }}>
                Outcome: {MILESTONES[activeMilestone].outcome}
              </p>
              
              <h4 style={{ fontSize: '12px', margin: '0 0 8px 0', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Tasks Underway:</h4>
              <ul className="milestone-tasks">
                {MILESTONES[activeMilestone].tasks.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </div>

            {/* Simulated 15 Modules grid */}
            <div className="modules-showcase">
              <h3>Simulated Microservice Architecture & Sub-Modules</h3>
              <div className="modules-list">
                <div className="module-pill glass-element">
                  <div className="module-icon-pill" style={{ background: 'rgba(170, 59, 255, 0.15)', color: '#aa3bff' }}>
                    <Shield size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px' }}>Auth service (JWT)</div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>OAuth2, Role claims</span>
                  </div>
                </div>

                <div className="module-pill glass-element">
                  <div className="module-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                    <Layers size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px' }}>Catalog module</div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Elasticsearch, Categories</span>
                  </div>
                </div>

                <div className="module-pill glass-element">
                  <div className="module-icon-pill" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
                    <Warehouse size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px' }}>Warehouse dispatch</div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Pick-pack, sync stocks</span>
                  </div>
                </div>

                <div className="module-pill glass-element">
                  <div className="module-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px' }}>Coupon & Promos</div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Discount calculations</span>
                  </div>
                </div>

                <div className="module-pill glass-element">
                  <div className="module-icon-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                    <Truck size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px' }}>Shipping tracking</div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Courier API updates</span>
                  </div>
                </div>

                <div className="module-pill glass-element">
                  <div className="module-icon-pill" style={{ background: 'rgba(107, 114, 128, 0.15)', color: 'var(--text-secondary)' }}>
                    <Bell size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px' }}>Notification service</div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SMS, Email, Push</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="primary-btn" 
              style={{ margin: '30px auto 0 auto' }}
              onClick={() => setDevModalOpen(false)}
            >
              Close Integration Panel
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="glass-footer">
        <div className="section-width footer-grid">
          <div className="footer-logo-side">
            <h3>Shop<span className="text-gradient">Stack</span></h3>
            <p>
              An enterprise-level multi-vendor marketplace platform built on a scalable React 19 
              frontend and Java Spring Boot microservice cloud backend.
            </p>
            <div className="social-links">
              <span className="icon-btn" style={{ padding: '6px' }}><Activity size={16} /></span>
              <span className="icon-btn" style={{ padding: '6px' }}><Shield size={16} /></span>
              <span className="icon-btn" style={{ padding: '6px' }}><Layers size={16} /></span>
            </div>
          </div>

          <div className="footer-col">
            <h4>For Customers</h4>
            <ul className="footer-links">
              <li><a href="#browse-section">Browse Stores</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCartOpen(true); }}>View Cart</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setWishlistOpen(true); }}>Your Wishlist</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); addToast('Security terms are simulated under the Developer Map.', 'info'); }}>Buyer Protections</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>For Vendors</h4>
            <ul className="footer-links">
              <li><a href="#become-vendor-section">Become a Seller</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setDevModalOpen(true); }}>Vendor Guidelines</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setDevModalOpen(true); }}>Commission Fees</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); addToast('Vendor APIs are simulated in the background.', 'info'); }}>API Documentation</a></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Subscribe to receive system status alerts, promotional coupon campaign news, and vendor updates.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="enter your email..." />
              <button 
                className="primary-btn" 
                onClick={() => addToast('Subscribed to ShopStack Newsletter!', 'success')}
                style={{ padding: '10px 14px' }}
              >
                <span>Join</span>
              </button>
            </div>
          </div>
        </div>

        <div className="section-width footer-bottom">
          <span>&copy; {new Date().getFullYear()} ShopStack Platform. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setDevModalOpen(true); }}>Developer Roadmap</a>
          </div>
        </div>
      </footer>

      {/* Toast Alert Popups wrapper */}
      <div className="glass-toast-container">
        {toasts.map((t) => (
          <div className={`glass-toast ${t.type}`} key={t.id}>
            {t.type === 'success' ? <Check size={16} /> : <Compass size={16} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
