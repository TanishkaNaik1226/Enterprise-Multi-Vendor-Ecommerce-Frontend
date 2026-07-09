function AuthInfo() {
  const features = [
    {
      title: "Secure Authentication",
      description: "Enterprise-grade login and account protection for customers, vendors, and administrators.",
      icon: "🔐",
    },
    {
      title: "Multi-Vendor Marketplace",
      description: "Manage multiple vendors, products, and customers from one centralized platform.",
      icon: "🛒",
    },
    {
      title: "Vendor Verification",
      description: "Seamless onboarding with document verification for trusted sellers.",
      icon: "📄",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-center">

      {/* Badge */}
      <div className="inline-flex w-fit items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200">
        Enterprise Marketplace Platform
      </div>

      {/* Heading */}
      <h1 className="mt-8 text-5xl font-bold leading-tight text-white">
        Welcome to
        <span className="block bg-linear-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
          ShopStack
        </span>
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
        A modern enterprise marketplace that connects customers,
        vendors and administrators through one secure,
        scalable and intelligent commerce platform.
      </p>

      {/* Feature Cards */}
      <div className="mt-12 grid gap-5">

        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:border-violet-400/40 hover:bg-white/10"
          >
            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-blue-500 text-xl shadow-lg">
                {feature.icon}
              </div>

              <div>

                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* Footer Quote */}
      <div className="mt-12 border-t border-white/10 pt-8">

        <p className="text-sm italic leading-7 text-slate-400">
          "Connecting businesses, empowering vendors, and delivering
          seamless shopping experiences through one intelligent
          marketplace."
        </p>

      </div>

    </div>
  );
}

export default AuthInfo;