import { useState } from "react";
import { Link } from "react-router-dom";

import AuthContainer from "../../components/layout/AuthContainer";
import AuthHeader from "../../components/layout/AuthHeader";
import InputField from "../../components/forms/InputField";
import PrimaryButton from "../../components/forms/PrimaryButton";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
  };

  return (
    <AuthContainer maxWidth="max-w-lg">

        <div className="flex items-center justify-center py-8">
          <div className="w-full max-w-md">

            <AuthHeader
              title="Forgot Password?"
              subtitle="Enter your email address to receive a password reset link."
            />

            <form className="mt-8" onSubmit={handleSubmit}>

              <InputField
                label="Email Address"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="mt-8">
                <PrimaryButton
                  text="Send Reset Link"
                  type="submit"
                />
              </div>

              <div className="mt-8 border-t border-white/10 pt-6 text-center">
                <Link
                  to="/login"
                  className="font-medium text-violet-300 transition hover:text-violet-200"
                >
                  ← Back to Login
                </Link>
              </div>

            </form>

          </div>
        </div>

      
    </AuthContainer>
  );
}

export default ForgotPassword;
