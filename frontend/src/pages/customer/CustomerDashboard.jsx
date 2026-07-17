import useFilteredProducts from '../../hooks/useFilteredProducts';
import ProductImage from '../../components/ProductImage';
import EmptyState from '../../components/EmptyState';
import NotificationPanel from '../../components/NotificationPanel';
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
  Lock as LockIcon, 
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
  user,
  products = [],
  categories = [],
  selectedCategory,
  searchKeyword = '',
  onSearchKeywordChange,
  priceMin = '',
  priceMax = '',
  onPriceMinChange,
  onPriceMaxChange,
  loading = false,
  cart = [],
  setCart,
  addToast,
  customerProfile,
  addresses = [],
  showAddressForm,
  onShowAddressForm,
  addressLine1 = '',
  addressLine2 = '',
  city = '',
  stateName = '',
  postalCode = '',
  country = '',
  onAddressLine1Change,
  onAddressLine2Change,
  onCityChange,
  onStateNameChange,
  onPostalCodeChange,
  onCountryChange,
  selectedProduct,
  reviews = [],
  newRating = 5,
  newComment = '',
  reviewLoading = false,
  onNewRatingChange,
  onNewCommentChange,
  onHandleSearch,
  onHandleCategoryClick,
  onHandleAddToCart,
  onViewProductDetails,
  onSubmitReview,
  onDeleteReview,
  onHandleAddAddress,
  onSetSelectedProduct,
  wishlist = [],
  setWishlist,
}) {
  const filteredProducts = useFilteredProducts(products, { priceMin, priceMax, selectedCategory, searchKeyword });

  return (
    <div style={{ padding: '2rem' }}>
      <NotificationPanel />
      {/* Search and Filters */}
      <div style={{ marginBottom: '2rem' }}>
        <form onSubmit={onHandleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchKeyword}
            onChange={(e) => onSearchKeywordChange && onSearchKeywordChange(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <input
            type="number"
            placeholder="Min Price"
            value={priceMin}
            onChange={(e) => onPriceMinChange && onPriceMinChange(e.target.value)}
            style={{ width: '110px', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={priceMax}
            onChange={(e) => onPriceMaxChange && onPriceMaxChange(e.target.value)}
            style={{ width: '110px', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
            <Search size={16} style={{ marginRight: '6px' }} />
            Search
          </button>
        </form>
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onHandleCategoryClick && onHandleCategoryClick(cat.id)}
              className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
            >
              {cat.categoryName || cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
            <div
            key={product.id}
            className="glass-card product-card"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => onViewProductDetails && onViewProductDetails(product)}
          >
            {/* Wishlist Icon */}
            <div style={{ alignSelf: 'flex-end' }}>
              <button
                className="wishlist-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  const inWish = wishlist.includes(product.id);
                  setWishlist && setWishlist(inWish ? wishlist.filter(id => id !== product.id) : [...new Set([...wishlist, product.id])]);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                title={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={18}
                  fill={wishlist.includes(product.id) ? '#e91e63' : 'none'}
                  color={wishlist.includes(product.id) ? '#e91e63' : 'var(--text-muted)'}
                />
              </button>
            </div>
            {product.image && (
              <ProductImage
                src={product.image}
                alt={product.productName || product.name}
                className="product-image"
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
              />
            )}
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {product.productName || product.name}
              </h3>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {product.description}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--secondary)', whiteSpace: 'nowrap' }}>${product.price}</span>
              <button
                className="btn btn-primary"
                style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                onClick={(e) => { e.stopPropagation(); onHandleAddToCart && onHandleAddToCart(product, e); }}
                disabled={product.stockQuantity === 0}
              >
                <ShoppingBag size={14} style={{ marginRight: '4px' }} />
                Add to Cart
              </button>
            </div>
          </div>
          ))
          ) : (
            <EmptyState message="No products found. Try a different search or category." />
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => onSetSelectedProduct && onSetSelectedProduct(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', textAlign: 'left' }}
          >
            <button className="modal-close" onClick={() => onSetSelectedProduct && onSetSelectedProduct(null)}>×</button>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.5rem' }}>
              {selectedProduct.productName || selectedProduct.name}
            </h3>
            <p style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              ${selectedProduct.price}
            </p>
            {selectedProduct.description && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{selectedProduct.description}</p>
            )}
            <button
              className="btn btn-primary"
              style={{ marginBottom: '1.5rem' }}
              onClick={(e) => {
                onHandleAddToCart && onHandleAddToCart(selectedProduct, e);
                onSetSelectedProduct && onSetSelectedProduct(null);
              }}
            >
              <ShoppingBag size={16} style={{ marginRight: '6px' }} />
              Add to Cart
            </button>

            {/* Reviews Section */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Customer Reviews</h4>
              {reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {reviews.map((review) => (
                    <div key={review.id} style={{ padding: '0.75rem', background: 'var(--input-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {Array.from({ length: review.rating || 5 }).map((_, i) => (
                            <Star key={i} size={12} fill="#fb3" color="#fb3" />
                          ))}
                        </span>
                        {user && (
                          <button
                            onClick={() => onDeleteReview && onDeleteReview(review.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                            title="Delete review"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>No reviews yet. Be the first!</p>
              )}

              {/* Submit Review Form */}
              {user && (
                <form onSubmit={onSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h5 style={{ margin: 0 }}>Write a Review</h5>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rating:</label>
                    <select
                      value={newRating}
                      onChange={(e) => onNewRatingChange && onNewRatingChange(Number(e.target.value))}
                      style={{ padding: '0.25rem 0.5rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                    >
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <textarea
                    placeholder="Share your experience..."
                    value={newComment}
                    onChange={(e) => onNewCommentChange && onNewCommentChange(e.target.value)}
                    rows={3}
                    style={{ padding: '0.5rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', resize: 'vertical' }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={reviewLoading}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Profile Section */}
      {customerProfile && (
        <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '1rem' }}>My Profile</h2>
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p><strong>Name:</strong> {customerProfile.firstName} {customerProfile.lastName}</p>
            <p><strong>Email:</strong> {customerProfile.email}</p>
            {customerProfile.phone && <p><strong>Phone:</strong> {customerProfile.phone}</p>}
          </div>

          {/* Addresses */}
          <h3 style={{ marginBottom: '1rem' }}>Saved Addresses</h3>
          {addresses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {addresses.map((addr) => (
                <div key={addr.id} className="glass-card" style={{ padding: '1rem' }}>
                  <p style={{ margin: 0 }}>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                  </p>
                  {addr.isDefault && <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Default</span>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No addresses saved yet.</p>
          )}

          {/* Add Address Form */}
          <button
            className="btn btn-secondary"
            style={{ marginBottom: '1rem' }}
            onClick={() => onShowAddressForm && onShowAddressForm(!showAddressForm)}
          >
            {showAddressForm ? 'Cancel' : '+ Add New Address'}
          </button>

          {showAddressForm && (
            <form onSubmit={onHandleAddAddress} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>New Address</h4>
              <input type="text" placeholder="Address Line 1 *" value={addressLine1} onChange={(e) => onAddressLine1Change && onAddressLine1Change(e.target.value)} required style={{ padding: '0.5rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              <input type="text" placeholder="Address Line 2" value={addressLine2} onChange={(e) => onAddressLine2Change && onAddressLine2Change(e.target.value)} style={{ padding: '0.5rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input type="text" placeholder="City *" value={city} onChange={(e) => onCityChange && onCityChange(e.target.value)} required style={{ padding: '0.5rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <input type="text" placeholder="State *" value={stateName} onChange={(e) => onStateNameChange && onStateNameChange(e.target.value)} required style={{ padding: '0.5rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <input type="text" placeholder="Postal Code *" value={postalCode} onChange={(e) => onPostalCodeChange && onPostalCodeChange(e.target.value)} required style={{ padding: '0.5rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <input type="text" placeholder="Country *" value={country} onChange={(e) => onCountryChange && onCountryChange(e.target.value)} required style={{ padding: '0.5rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Address</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
