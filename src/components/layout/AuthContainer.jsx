function AuthContainer({ children, maxWidth = "max-w-7xl" }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#4338ca_0%,transparent_28%),radial-gradient(circle_at_bottom_right,#2563eb_0%,transparent_30%),linear-gradient(to_bottom_right,#020617,#0f172a,#111827)] flex items-center justify-center px-6 py-10">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 h-128 w-lg rounded-full bg-violet-600/20 blur-[140px]" />

      <div className="absolute -bottom-40 -right-40 h-128 w-lg rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="absolute top-1/2 left-1/2 h-88 w-88 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-[120px]" />

      {/* Glass Card */}
      <div className={`relative w-full ${maxWidth} overflow-hidden rounded-4xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]`}>

        {children}

      </div>

    </div>
  );
}

export default AuthContainer;