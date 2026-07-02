function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600">
            ShopStack
          </h1>

          <p className="text-gray-500 mt-2">
            Enterprise Multi-Vendor Marketplace Platform
          </p>

          <h2 className="text-2xl font-semibold mt-8">
            Welcome Back !
          </h2>

          <p className="text-gray-500 mt-2">
            Login to continue to your account
          </p>

          {/* Login Form */}
<form className="mt-8">

  {/* Email */}
  <div className="mb-5">
    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Email</label>
    <input type="email" placeholder="Enter your email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
  </div>

  {/* Password */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Password</label>
    <input type="password" placeholder="Enter your password" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    <div className="mt-2 flex justify-end mb-8">
  <a
    href="#"
    className="text-sm text-blue-600 hover:underline"
  >
    Forgot Password?
  </a>
</div>

<button
  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200"
>
  Login
</button>
<div className="mt-8 text-center">
  <p className="text-gray-600">
    Don't have an account?
  </p>

  <div className="flex justify-center gap-4 mt-4">
    <button className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
      Customer
    </button>

    <button className="px-5 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
      Vendor
    </button>
  </div>
</div>
  </div>

</form>

        </div>

      </div>
    </div>
  );
}

export default Login;