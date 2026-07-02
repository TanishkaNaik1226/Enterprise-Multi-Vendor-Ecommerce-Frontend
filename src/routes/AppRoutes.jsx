import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import CustomerRegister from "../pages/auth/CustomerRegister";
import VendorRegister from "../pages/auth/VendorRegister";

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
      </Routes>
    </BrowserRouter>
  );
}