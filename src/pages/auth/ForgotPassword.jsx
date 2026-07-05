import AuthHeader from "../../components/layout/AuthHeader";
import InputField from "../../components/forms/InputField";
import PrimaryButton from "../../components/forms/PrimaryButton";
import { Link } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Reset link sent to:", email);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        <AuthHeader
          title="Forgot Password?"
          subtitle="Enter your email to receive a reset link"
        />

        <form className="mt-8" onSubmit={handleSubmit}>

          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mt-8">
            <PrimaryButton
              text="Send Reset Link"
              type="submit"
            />
          </div>

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

export default ForgotPassword;