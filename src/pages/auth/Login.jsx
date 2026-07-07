import { useState } from 'react';
import { 
  Layers, 
  User, 
  Warehouse, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle
} from 'lucide-react';
import './Auth.css';

export default function Login({ onNavigate, onLoginSuccess, theme }) {
  const [role, setRole] = useState('customer'); // 'customer' or 'vendor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError(''); // clear error when role changes
  };

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API authorization response latency (1.5 seconds)
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulated credentials or roles logic
      const mockUser = {
        name: role === 'customer' ? 'Sarah Jenkins' : 'Apex Tech Supplies',
        email: email,
        role: role,
        avatar: role === 'customer' ? 'SJ' : 'AT'
      };

      onLoginSuccess(mockUser);
    }, 1500);
  };

  return (
    <div className={`auth-page-container ${theme === 'light' ? 'light-theme' : ''}`}>
      
      {/* Background blobs matching main site */}
      <div className="bg-blobs">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      <div className="auth-card glass-card">
        
        {/* Back Link */}
        <a 
          href="#" 
          className="back-to-home-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('landing');
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Marketplace</span>
        </a>

        {/* Auth Page Header */}
        <div className="auth-header" style={{ marginTop: '16px' }}>
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Layers size={24} color="#fff" />
            </div>
            <span>Shop<span className="text-gradient">Stack</span></span>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage your marketplace experience</p>
        </div>

        {/* Role Selector Cards */}
        <div className="role-selector-container">
          <span className="role-selector-label">Select Your Role</span>
          <div className="role-cards-grid">
            
            {/* Customer Role Card */}
            <div 
              className={`role-card ${role === 'customer' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('customer')}
            >
              <div className="role-card-icon">
                <User size={20} />
              </div>
              <h3 className="role-card-title">Customer</h3>
              <p className="role-card-desc">Browse catalogs, buy goods, and track order histories.</p>
              <div className="role-card-badge">
                {role === 'customer' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}></span>}
              </div>
            </div>

            {/* Vendor Role Card */}
            <div 
              className={`role-card ${role === 'vendor' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('vendor')}
            >
              <div className="role-card-icon">
                <Warehouse size={20} />
              </div>
              <h3 className="role-card-title">Vendor</h3>
              <p className="role-card-desc">List products, fulfill orders, and monitor sales analytics.</p>
              <div className="role-card-badge">
                {role === 'vendor' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}></span>}
              </div>
            </div>

          </div>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="auth-error-banner" style={{ marginBottom: '20px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="auth-input-group">
            <label htmlFor="email">
              {role === 'vendor' ? 'Business Email Address' : 'Email Address'}
            </label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input 
                id="email"
                type="email"
                className="auth-input"
                placeholder={role === 'vendor' ? 'seller@company.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span>Remember me</span>
            </label>
            <a 
              href="#" 
              className="forgot-password-link"
              onClick={(e) => {
                e.preventDefault();
                setError('Password reset instructions sent to your email.');
              }}
            >
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In as {role === 'customer' ? 'Customer' : 'Vendor'}</span>
            )}
          </button>

        </form>

        {/* Social Dividers & Mock Buttons */}
        <div className="social-divider">or continue with</div>

        <div className="social-btn-container">
          <button 
            className="social-auth-btn" 
            title="Google Sign In"
            onClick={() => {
              setEmail('simulated.user@gmail.com');
              setPassword('password123');
              setError('');
            }}
          >
            {/* Simple colored dots simulating Google logo */}
            <span style={{ display: 'inline-flex', gap: '3px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ea4335' }}></span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4285f4' }}></span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbc05' }}></span>
            </span>
          </button>
          <button 
            className="social-auth-btn" 
            title="Apple Sign In"
            onClick={() => {
              setEmail('simulated.apple@icloud.com');
              setPassword('passwordApple');
              setError('');
            }}
          >
            {/* Stylized placeholder for Apple */}
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>A</span>
          </button>
          <button 
            className="social-auth-btn" 
            title="GitHub Sign In"
            onClick={() => {
              setEmail('simulated.github@github.com');
              setPassword('githubSecure8');
              setError('');
            }}
          >
            {/* Stylized placeholder for GitHub */}
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>G</span>
          </button>
        </div>

        {/* Switch Link */}
        <div className="auth-footer">
          <span>Don't have an account? </span>
          <a 
            href="#" 
            className="auth-switch-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('register');
            }}
          >
            Sign Up
          </a>
        </div>

      </div>
    </div>
  );
}
