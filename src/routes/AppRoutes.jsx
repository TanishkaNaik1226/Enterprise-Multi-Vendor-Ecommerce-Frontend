import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Login from "../pages/auth/Login";
import CustomerRegister from "../pages/auth/CustomerRegister";
import VendorRegister from "../pages/auth/VendorRegister";

import CustomerDashboard from "../pages/customer/Dashboard";
import CustomerProfile from "../pages/customer/Profile";
import CustomerAddresses from "../pages/customer/Addresses";
import CustomerOrders from "../pages/customer/Orders";
import CustomerWishlist from "../pages/customer/Wishlist";

import VendorDashboard from "../pages/vendor/Dashboard";
import VendorProfile from "../pages/vendor/Profile";
import BusinessDetails from "../pages/vendor/BusinessDetails";
import VendorAddresses from "../pages/vendor/Addresses";
import BankDetails from "../pages/vendor/BankDetails";
import Documents from "../pages/vendor/Documents";
import ApprovalStatus from "../pages/vendor/ApprovalStatus";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route
          path="/register/customer"
          element={<CustomerRegister />}
        />
        <Route
          path="/register/vendor"
          element={<VendorRegister />}
        />
        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
<Route
  path="/reset-password"
  element={<ResetPassword />}
/>
<Route
  path="/customer/dashboard"
  element={<CustomerDashboard />}
/>
<Route
    path="/customer/profile"
    element={<CustomerProfile />}
/>
<Route
  path="/customer/addresses"
  element={<CustomerAddresses />}
/>

<Route
  path="/customer/orders"
  element={<CustomerOrders />}
/>
<Route
    path="/customer/wishlist"
    element={<CustomerWishlist />}
/>
<Route
  path="/vendor/dashboard"
  element={<VendorDashboard />}
/>

<Route
  path="/vendor/profile"
  element={<VendorProfile />}
/>
<Route
  path="/vendor/business"
  element={<BusinessDetails />}
/>

<Route
  path="/vendor/addresses"
  element={<VendorAddresses />}
/>

<Route
  path="/vendor/bank"
  element={<BankDetails />}
/>
<Route
  path="/vendor/documents"
  element={<Documents />}
/>

<Route
  path="/vendor/approval"
  element={<ApprovalStatus />}
/>
      </Routes>
    </BrowserRouter>
  );
}