import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

function DashboardLayout({
  children,
  role = "customer",
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#4338ca_0%,transparent_28%),radial-gradient(circle_at_bottom_right,#2563eb_0%,transparent_30%),linear-gradient(to_bottom_right,#020617,#0f172a,#111827)]">

      {/* Background Glow */}

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[140px]" />

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-[120px]" />

      {/* Main Container */}

      <div className="relative flex min-h-screen">

        {/* Sidebar */}

        <Sidebar role={role} />

        {/* Right Side */}

        <div className="flex flex-1 flex-col">

          <TopNavbar
            role={
              role === "vendor"
                ? "Vendor"
                : "Customer"
            }
          />

          {/* Content */}

          <main className="flex-1 overflow-y-auto p-8">

            {children}

          </main>

        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;