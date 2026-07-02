import AuthHeader from "../../components/layout/AuthHeader";
import InputField from "../../components/forms/InputField";
import PrimaryButton from "../../components/forms/PrimaryButton";
import PasswordField from "../../components/forms/PasswordFields";
import { Link } from "react-router-dom";
function VendorRegister() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <AuthHeader
    title="Create Vendor Account"
    subtitle="Register to start selling your products"
/>

        {/* Registration Form */}
        <form className="mt-8">

          {/* Business Name */}
          <div className="mb-5">
            <InputField
    label="Business Name"
    type="text"
    placeholder="Enter your business name"
/>
          </div>

          {/* Owner Name */}
          <div className="mb-5">
            <InputField
    label="Owner Name"
    type="text"
    placeholder="Enter owner name"
/>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <PasswordField
  label="Password"
  placeholder="Create a password"
/>

          {/* Confirm Password */}
          <PasswordField
  label="Confirm Password"
  placeholder="Confirm your password"
/>

        <PrimaryButton
    text="Register"
    type="submit"
/>

          <div className="text-center mt-6">
  <p className="text-gray-600">
    Already have an account?
  </p>

  <Link
    to="/login"
    className="text-blue-600 font-medium hover:underline mt-2 inline-block"
  >
    Login
  </Link>
</div>

        </form>

      </div>
    </div>
  );
}

export default VendorRegister;