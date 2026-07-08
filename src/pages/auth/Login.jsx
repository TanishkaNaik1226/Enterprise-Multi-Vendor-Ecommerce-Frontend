import AuthHeader from "../../components/layout/AuthHeader";
import InputField from "../../components/forms/InputField";
import PrimaryButton from "../../components/forms/PrimaryButton";
import PasswordField from "../../components/forms/PasswordField";

import { Link ,useNavigate} from "react-router-dom";
import { useState } from "react";

import { loginUser } from "../../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

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
      newErrors.password =
        "Password must be at least 8 characters long";
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

      // Temporary frontend demo

  if (email.toLowerCase().includes("vendor")) {
    navigate("/vendor/dashboard");
  } else {
    navigate("/customer/dashboard");
  }

    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#312e81,transparent_35%),radial-gradient(circle_at_bottom_right,#1d4ed8,transparent_35%),linear-gradient(to_bottom_right,#030712,#111827,#020617)] flex items-center justify-center px-6 py-10">

      {/* Background Blur */}
      <div className="absolute -top-40 left-10 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-112 w-md rounded-full bg-blue-600/20 blur-3xl"></div>

      <div className="relative w-full max-w-7xl rounded-4xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">

        <div className="grid lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="p-10 md:p-14 flex flex-col justify-center">

            <AuthHeader
              title="Welcome Back!"
              subtitle="Login to continue to your account"
            />

            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit}
            >
              <div>
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <PasswordField
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-violet-300 hover:text-violet-200 transition"
                >
                  Forgot Password?
                </Link>
              </div>

              <PrimaryButton
                text="Login"
                type="submit"
              />

              <div className="pt-4 text-center">
                <p className="text-gray-300">
                  Don't have an account?
                </p>

                <div className="mt-4 flex justify-center gap-6">
                  <Link
                    to="/register/customer"
                    className="font-medium text-violet-300 hover:text-white transition"
                  >
                    Customer Register
                  </Link>

                  <Link
                    to="/register/vendor"
                    className="font-medium text-blue-300 hover:text-white transition"
                  >
                    Vendor Register
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex flex-col justify-center bg-white/5 border-l border-white/10 p-14">

            <span className="inline-flex w-fit rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
              Enterprise Multi-Vendor Marketplace
            </span>

            <h2 className="mt-8 text-5xl font-bold leading-tight text-white">
              Build, Manage &
              <span className="block bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Scale Commerce
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-300">
              ShopStack provides a secure enterprise marketplace
              where customers, vendors and administrators work
              together through modern authentication, vendor
              onboarding and powerful management tools.
            </p>

            <div className="mt-12 space-y-5">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">
                  Secure Authentication
                </h3>
                <p className="mt-2 text-gray-400">
                  Role-based login with enterprise security.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">
                  Multi-Vendor Platform
                </h3>
                <p className="mt-2 text-gray-400">
                  Manage thousands of vendors and customers.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">
                  Vendor Verification
                </h3>
                <p className="mt-2 text-gray-400">
                  Secure onboarding with document verification.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;