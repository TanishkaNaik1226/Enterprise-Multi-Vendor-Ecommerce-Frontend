import React, { useState, useEffect } from 'react';
import { api } from '../api';
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import { PRODUCTS_DATA } from '../data/products';


export default function CustomerPortal({ user, cart, setCart, addToast, fallbackProducts = [], wishlist = [], setWishlist }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [loading, setLoading] = useState(false);

  // Profile states
  const [customerProfile, setCustomerProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // Product detail modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    loadShopData();
    if (user && user.role === 'CUSTOMER') {
      loadProfileData();
    }
  }, [user, fallbackProducts]);

  const getFallbackProducts = () => (fallbackProducts.length > 0 ? fallbackProducts : PRODUCTS_DATA);

  const loadShopData = async () => {
    setLoading(true);
    try {
      const activeProds = await api.products.browseActive();
      if (activeProds && activeProds.length > 0) {
        setProducts(activeProds.map((product) => ({ ...product, image: product.image || product.imageUrl })));
      } else {
        setProducts(getFallbackProducts());
      }
      const allCats = await api.categories.listAll();
      const categoryValues = (allCats || []).map((category) => ({
        ...category,
        id: String(category.categoryName || category.name || '').toLowerCase(),
      })).filter((category) => category.id);
      setCategories(categoryValues.length > 0 ? categoryValues : [...new Set(getFallbackProducts().map((product) => product.category))].map((category) => ({ id: category, name: category })));
    } catch (err) {
      // API unavailable — fall back to static catalog
      setProducts(getFallbackProducts());
      setCategories([...new Set(getFallbackProducts().map((product) => product.category))].map((category) => ({ id: category, name: category })));
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async () => {
    try {
      const profileResponse = await api.customer.getProfile();
      const profile = profileResponse.data || profileResponse;
      setCustomerProfile(profile);

      if (profile && profile.id) {
        const addressResponse = await api.customer.getAddresses(profile.id);
        setAddresses(addressResponse.data || addressResponse || []);
      }
    } catch (err) {
      console.error('Could not load customer profile', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory((currentCategory) => currentCategory === category ? null : category);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!customerProfile) return;
    try {
      const newAddress = {
        addressLine1,
        addressLine2,
        city,
        state: stateName,
        postalCode,
        country,
        isDefault: addresses.length === 0
      };
      await api.customer.addAddress(customerProfile.id, newAddress);
      addToast('Address added successfully!', 'success');
      setShowAddressForm(false);
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setStateName('');
      setPostalCode('');
      setCountry('');
      loadProfileData();
    } catch (err) {
      addToast(err.message || 'Failed to add address', 'error');
    }
  };

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    addToast(`${product.productName || product.name} added to cart!`, 'success');
  };

  const viewProductDetails = async (product) => {
    setSelectedProduct(product);
    try {
      const prodReviews = await api.reviews.getByProduct(product.id);
      setReviews(prodReviews || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to add a review', 'warning');
      return;
    }
    setReviewLoading(true);
    try {
      await api.reviews.create(selectedProduct.id, {
        rating: newRating,
        comment: newComment
      });
      addToast('Review submitted!', 'success');
      setNewComment('');
      setNewRating(5);
      const prodReviews = await api.reviews.getByProduct(selectedProduct.id);
      setReviews(prodReviews || []);
    } catch (err) {
      addToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.reviews.delete(reviewId);
      addToast('Review deleted', 'success');
      const prodReviews = await api.reviews.getByProduct(selectedProduct.id);
      setReviews(prodReviews || []);
    } catch (err) {
      addToast(err.message || 'Could not delete review', 'error');
    }
  };

  const deleteAddress = async (id) => {
    await api.address.delete(id);
    loadAddresses();
};

  return (
    <CustomerDashboard
    onDeleteAddress={deleteAddress}
      user={user}
      products={products}
      categories={categories}
      selectedCategory={selectedCategory}
      searchKeyword={searchKeyword}
      onSearchKeywordChange={setSearchKeyword}
      priceMin={priceMin}
      priceMax={priceMax}
      onPriceMinChange={setPriceMin}
      onPriceMaxChange={setPriceMax}
      loading={loading}
      cart={cart}
      setCart={setCart}
      addToast={addToast}
      customerProfile={customerProfile}
      addresses={addresses}
      showAddressForm={showAddressForm}
      onShowAddressForm={setShowAddressForm}
      addressLine1={addressLine1}
      addressLine2={addressLine2}
      city={city}
      stateName={stateName}
      postalCode={postalCode}
      country={country}
      onAddressLine1Change={setAddressLine1}
      onAddressLine2Change={setAddressLine2}
      onCityChange={setCity}
      onStateNameChange={setStateName}
      onPostalCodeChange={setPostalCode}
      onCountryChange={setCountry}
      selectedProduct={selectedProduct}
      reviews={reviews}
      newRating={newRating}
      newComment={newComment}
      reviewLoading={reviewLoading}
      onNewRatingChange={setNewRating}
      onNewCommentChange={setNewComment}
      onHandleSearch={handleSearch}
      onHandleCategoryClick={handleCategoryClick}
      onHandleAddToCart={handleAddToCart}
      onViewProductDetails={viewProductDetails}
      onSubmitReview={submitReview}
      onDeleteReview={handleDeleteReview}
      onHandleAddAddress={handleAddAddress}
      onSetSelectedProduct={setSelectedProduct}
      wishlist={wishlist}
      setWishlist={setWishlist}
      
    />
  );
}
