import { useState } from "react";
import { Link } from "react-router-dom";

import AuthContainer from "../../components/layout/AuthContainer";
import AuthHeader from "../../components/layout/AuthHeader";
import PasswordField from "../../components/forms/PasswordField";
import PrimaryButton from "../../components/forms/PrimaryButton";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Password Reset Successful");
  };

  return (
    <AuthContainer maxWidth="max-w-lg">
      
        {/* Left Section */}
        <div className="flex items-center justify-center py-8">
          <div className="w-full max-w-md">

            <AuthHeader
              title="Reset Password"
              subtitle="Create a new secure password for your ShopStack account."
            />

            <form className="mt-8" onSubmit={handleSubmit}>

              <PasswordField
                label="New Password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <PasswordField
                label="Confirm Password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="mt-8">
                <PrimaryButton
                  text="Reset Password"
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

export default ResetPassword;
