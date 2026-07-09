function AuthHeader({ title, subtitle }) {
  return (
    <div className="mb-10">

      {/* Badge */}
      <div className="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">

        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          Enterprise Marketplace
        </span>

      </div>

      {/* Logo */}
      <h1 className="mt-6 text-4xl font-bold tracking-tight">

        <span className="bg-linear-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
          ShopStack
        </span>

      </h1>

      {/* Platform Description */}
      <p className="mt-3 text-sm leading-6 text-slate-400">
        Enterprise Multi-Vendor Marketplace Platform
      </p>

      {/* Page Title */}
      <h2 className="mt-8 text-3xl font-bold text-white">
        {title}
      </h2>

      {/* Subtitle */}
      <p className="mt-3 text-base leading-7 text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}

export default AuthHeader;