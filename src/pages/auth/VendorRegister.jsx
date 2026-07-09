import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContainer from "../../components/layout/AuthContainer";
import AuthHeader from "../../components/layout/AuthHeader";
import AuthInfo from "../../components/layout/AuthInfo";

import InputField from "../../components/forms/InputField";
import PasswordField from "../../components/forms/PasswordField";
import PrimaryButton from "../../components/forms/PrimaryButton";

import { registerVendor } from "../../services/authService";

function VendorRegister() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    documentType: "",
    document: null,
    accepted: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {

    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const newErrors = {};

    if (!formData.businessName.trim())
      newErrors.businessName = "Business Name is required";

    if (!formData.ownerName.trim())
      newErrors.ownerName = "Owner Name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter valid email";

    if (!formData.phone.trim())
      newErrors.phone = "Phone Number is required";

    if (!formData.password.trim())
      newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password =
        "Password must be at least 8 characters";

    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword =
        "Passwords do not match";

    if (!formData.documentType)
      newErrors.documentType =
        "Select document type";

    if (!formData.document)
      newErrors.document =
        "Please upload a document";

    if (!formData.accepted)
      newErrors.accepted =
        "Accept declaration";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0)
      return;

    try {

      const payload = {
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        documentType: formData.documentType,
      };

      const response = await registerVendor(payload);

      console.log(response.data);

      navigate("/vendor/dashboard");

    } catch (error) {

      console.log(error);

      // Demo navigation

      navigate("/vendor/dashboard");

    }

  };

  return (

    <AuthContainer>

      <div className="grid w-full lg:grid-cols-2 gap-16 p-8 md:p-12 lg:p-16">

        <div className="flex items-center">

          <div className="w-full max-w-md">

            <AuthHeader
              title="Create Vendor Account"
              subtitle="Register to start selling on ShopStack"
            />

            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit}
            >

              <div>

                <InputField
                  label="Business Name"
                  name="businessName"
                  type="text"
                  placeholder="Enter Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                />

                {errors.businessName && (
                  <p className="text-sm text-red-400">
                    {errors.businessName}
                  </p>
                )}

              </div>

              <div>

                <InputField
                  label="Owner Name"
                  name="ownerName"
                  type="text"
                  placeholder="Enter Owner Name"
                  value={formData.ownerName}
                  onChange={handleChange}
                />

                {errors.ownerName && (
                  <p className="text-sm text-red-400">
                    {errors.ownerName}
                  </p>
                )}

              </div>

              <div>

                <InputField
                  label="Business Email"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <p className="text-sm text-red-400">
                    {errors.email}
                  </p>
                )}

              </div>

              <div>

                <InputField
                  label="Business Phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter Phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                {errors.phone && (
                  <p className="text-sm text-red-400">
                    {errors.phone}
                  </p>
                )}

              </div>

              <div>

                <PasswordField
                  label="Password"
                  name="password"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={handleChange}
                />

                {errors.password && (
                  <p className="text-sm text-red-400">
                    {errors.password}
                  </p>
                )}

              </div>

              <div>

                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}

              </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <h3 className="mb-5 text-xl font-semibold text-white">
                  Document Verification
                </h3>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Document Type
                </label>

                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="mb-2 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
                >
                  <option value="" className="bg-slate-900">
                    Select Document
                  </option>

                  <option value="PAN Card" className="bg-slate-900">
                    PAN Card
                  </option>

                  <option value="GST Certificate" className="bg-slate-900">
                    GST Certificate
                  </option>

                  <option value="Aadhaar Card" className="bg-slate-900">
                    Aadhaar Card
                  </option>

                  <option value="Business License" className="bg-slate-900">
                    Business License
                  </option>

                </select>

                {errors.documentType && (
                  <p className="mb-4 text-sm text-red-400">
                    {errors.documentType}
                  </p>
                )}

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Upload Document
                </label>

                <input
                  type="file"
                  name="document"
                  onChange={handleChange}
                  className="mb-2 w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-5 py-4 text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-white hover:file:bg-violet-700"
                />

                {formData.document && (
                  <p className="mb-2 text-sm text-green-400">
                    Selected: {formData.document.name}
                  </p>
                )}

                {errors.document && (
                  <p className="mb-4 text-sm text-red-400">
                    {errors.document}
                  </p>
                )}

                <label className="mt-4 flex items-start gap-3 text-sm text-slate-300">

                  <input
                    type="checkbox"
                    name="accepted"
                    checked={formData.accepted}
                    onChange={handleChange}
                    className="mt-1 accent-violet-600"
                  />

                  <span>
                    I confirm that the uploaded document is genuine and belongs
                    to my business.
                  </span>

                </label>

                {errors.accepted && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.accepted}
                  </p>
                )}

              </div>

              <div className="mt-8">

                <PrimaryButton
                  text="Create Vendor Account"
                  type="submit"
                />

              </div>

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

export default VendorRegister;