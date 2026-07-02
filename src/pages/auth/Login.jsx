import AuthHeader from "../../components/layout/AuthHeader";
import InputField from "../../components/forms/InputField";
import PrimaryButton from "../../components/forms/PrimaryButton";
import PasswordField from "../../components/forms/PasswordFields";
import { Link } from "react-router-dom";
function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <AuthHeader
    title="Welcome Back!"
    subtitle="Login to continue to your account"
/>

          {/* Login Form */}
<form className="mt-8">

  {/* Email */}
  <div className="mb-5">
    <InputField
    label="Email"
    type="email"
    placeholder="Enter your email"
/>
  </div>

  {/* Password */}
  <div className="mb-3">
    <PasswordField
    label="Password"
    placeholder="Enter your password"
/>
    <div className="mt-2 flex justify-end mb-8">
  <a href="#" className="text-sm text-blue-600 hover:underline">
    Forgot Password?
  </a>
</div>

<PrimaryButton
    text="Login"
    type="submit"
/>
<div className="text-center mt-6">
  <p className="text-gray-600">
    Don't have an account?
  </p>

  <div className="flex justify-center gap-4 mt-3">
    <Link
      to="/register/customer"
      className="text-blue-600 font-medium hover:underline"
    >
      Customer Register
    </Link>

    <Link
      to="/register/vendor"
      className="text-green-600 font-medium hover:underline"
    >
      Vendor Register
    </Link>
  </div>
</div>
  </div>

</form>

        </div>

      </div>
    
  );
}

export default Login;