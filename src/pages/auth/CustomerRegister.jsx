import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContainer from "../../components/layout/AuthContainer";
import AuthHeader from "../../components/layout/AuthHeader";
import AuthInfo from "../../components/layout/AuthInfo";

import InputField from "../../components/forms/InputField";
import PasswordField from "../../components/forms/PasswordField";
import PrimaryButton from "../../components/forms/PrimaryButton";

import { registerCustomer } from "../../services/authService";

function CustomerRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await registerCustomer(formData);

      console.log("Customer Registered Successfully");
      console.log(response.data);

      navigate("/customer/dashboard");

    } catch (error) {

      console.log("Backend not connected.");
      console.log(error);

      // Temporary demo navigation
      navigate("/customer/dashboard");
    }
  };

  return (
    <AuthContainer>
      <div className="grid w-full lg:grid-cols-2 gap-16 p-8 md:p-12 lg:p-16">

        <div className="flex items-center">
          <div className="w-full max-w-md">

            <AuthHeader
              title="Create Customer Account"
              subtitle="Register to start shopping with ShopStack"
            />

            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit}
            >

              <div>
                <InputField
                  label="Full Name"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <InputField
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />

                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <PasswordField
                  label="Password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />

                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <PrimaryButton
                text="Create Customer Account"
                type="submit"
              />

              <div className="mt-8 border-t border-white/10 pt-6 text-center">

                <p className="text-slate-400">
                  Already have an account?
                </p>

                <Link
                  to="/login"
                  className="mt-3 inline-block font-medium text-violet-300 hover:text-violet-200"
                >
                  Login
                </Link>

              </div>

            </form>

          </div>
        </div>

        <div className="hidden lg:flex items-center">
          <AuthInfo />
        </div>

      </div>
    </AuthContainer>
  );
}

export default CustomerRegister;