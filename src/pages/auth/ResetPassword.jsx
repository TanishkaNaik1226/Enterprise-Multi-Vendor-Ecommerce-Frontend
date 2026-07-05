import { useState } from "react";
import AuthHeader from "../../components/layout/AuthHeader";
import PasswordField from "../../components/forms/PasswordFields";
import PrimaryButton from "../../components/forms/PrimaryButton";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        <AuthHeader
          title="Reset Password"
          subtitle="Create a new password for your account"
        />

        <form className="mt-8" onSubmit={handleSubmit}>

          <div className="mb-5">
            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <PasswordField
              label="Confirm Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <PrimaryButton
            text="Reset Password"
            type="submit"
          />

        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;