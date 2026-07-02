import AuthHeader from "../../components/layout/AuthHeader";
import InputField from "../../components/forms/InputField";
import PasswordField from "../../components/forms/PasswordFields";
import PrimaryButton from "../../components/forms/PrimaryButton";
import { Link } from "react-router-dom";
function CustomerRegister() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        
       <AuthHeader
    title="Create Customer Account"
    subtitle="Register to start shopping"
/>

        {/* Registration Form */}
        <form className="mt-8">

          {/* Full Name */}
          <div className="mb-5">
            <InputField
    label="Full Name"
    type="text"
    placeholder="Enter your full name"
/>
          </div>

          {/* Email */}
          <div className="mb-5">
            <InputField
    label="Email"
    type="email"
    placeholder="Enter your email"
/>
          </div>

          {/* Phone Number */}
          <div className="mb-5">
            <InputField
    label="Phone Number"
    type="tel"
    placeholder="Enter your phone number"
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

          {/* Register Button */}
          <PrimaryButton
    text="Register"
    type="submit"
/>

          {/* Login Link */}
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

export default CustomerRegister;