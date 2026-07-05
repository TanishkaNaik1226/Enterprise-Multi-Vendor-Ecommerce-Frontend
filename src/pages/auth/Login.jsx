import AuthHeader from "../../components/layout/AuthHeader";
import InputField from "../../components/forms/InputField";
import PrimaryButton from "../../components/forms/PrimaryButton";
import PasswordField from "../../components/forms/PasswordFields";

import { Link } from "react-router-dom";
import { useState } from "react";

import { loginUser } from "../../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

 if (!email.trim()) {
  newErrors.email = "Email is required";
} else if (!/\S+@\S+\.\S+/.test(email)) {
  newErrors.email = "Enter a valid email address";
}
  if (!password.trim()) {
    newErrors.password = "Password is required";
  } else if (password.length < 8) {
    newErrors.password = "Password must be at least 8 characters long";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return;
  }

  try {
  const response = await loginUser({
    email,
    password,
  });

  console.log("Login Successful");
  console.log(response.data);

} catch (error) {
  console.log("Login Failed");
  console.log(error);
}
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <AuthHeader
    title="Welcome Back!"
    subtitle="Login to continue to your account"
/>

          {/* Login Form */}
<form className="mt-8" onSubmit={handleSubmit}>

  {/* Email */}
  <div className="mb-5">
    <InputField
    label="Email"
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}  
/>
    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
  </div>

  {/* Password */}
  <div className="mb-3">
    <PasswordField
    label="Password"
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
/>
    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
    <div className="mt-2 flex justify-end mb-8">
      <Link
  to="/forgot-password"
  className="text-sm text-blue-600 hover:underline"
>
  Forgot Password?
</Link>
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