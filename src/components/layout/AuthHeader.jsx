function AuthHeader({ title, subtitle }) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-blue-600">
        ShopStack
      </h1>

      <p className="text-gray-500 mt-2">
        Enterprise Multi-Vendor Marketplace Platform
      </p>

      <h2 className="text-2xl font-semibold mt-8">
        {title}
      </h2>

      <p className="text-gray-500 mt-2">
        {subtitle}
      </p>
    </div>
  );
}

export default AuthHeader;