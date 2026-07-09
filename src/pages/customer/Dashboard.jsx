import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import SectionCard from "../../components/common/SectionCard";
import StatusBadge from "../../components/common/StatusBadge";

import {
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const stats = [
  {
    title: "Total Orders",
    value: "24",
    icon: <FiShoppingBag />,
    change: "+12%",
    color: "from-violet-500 to-indigo-500",
    path: "/customer/orders",
  },
  {
    title: "Wishlist",
    value: "18",
    icon: <FiHeart />,
    change: "+5%",
    color: "from-pink-500 to-rose-500",
    path: "/customer/wishlist",
  },
  {
    title: "Addresses",
    value: "3",
    icon: <FiMapPin />,
    change: "+1",
    color: "from-blue-500 to-cyan-500",
    path: "/customer/addresses",
  },
  {
    title: "Profile",
    value: "100%",
    icon: <FiUser />,
    change: "Complete",
    color: "from-emerald-500 to-green-500",
    path: "/customer/profile",
  },
];

  const navigate = useNavigate();
  return (
    <DashboardLayout role="customer">
      <PageHeader
        title="Customer Dashboard"
        subtitle="Welcome back! Here's an overview of your account."
      />

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
    key={item.title}
    onClick={() => navigate(item.path)}
    className="cursor-pointer transition hover:scale-[1.02]"
  >
    <StatCard
      title={item.title}
      value={item.value}
      icon={item.icon}
      change={item.change}
      color={item.color}
    />
  </div>
        ))}
      </div>

      {/* Bottom Section */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* Recent Orders */}

        <SectionCard title="Recent Orders">

          <div className="space-y-4">

            <div onClick={() => navigate("/customer/orders")} className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/10 cursor-pointer">

              <div>

                <h4 className="font-semibold text-white">
                  Order #ORD1025
                </h4>

                <p className="text-sm text-slate-400">
                  Wireless Headphones
                </p>

              </div>

              <StatusBadge status="Approved" />

            </div>

            <div onClick={() => navigate("/customer/orders")} className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/10 cursor-pointer">

              <div>

                <h4 className="font-semibold text-white">
                  Order #ORD1026
                </h4>

                <p className="text-sm text-slate-400">
                  Smart Watch
                </p>

              </div>

              <StatusBadge status="Pending" />

            </div>

            <div onClick={() => navigate("/customer/orders")} className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/10 cursor-pointer">

              <div>

                <h4 className="font-semibold text-white">
                  Order #ORD1027
                </h4>

                <p className="text-sm text-slate-400">
                  Gaming Mouse
                </p>

              </div>

              <StatusBadge status="Approved" />

            </div>

          </div>

        </SectionCard>

        {/* Saved Addresses */}

        <SectionCard title="Saved Addresses">

          <div className="space-y-4">

            <div onClick={() => navigate("/customer/addresses")} className="rounded-xl bg-white/5 p-4 transition hover:bg-white/10 cursor-pointer">

              <h4 className="font-semibold text-white">
                Home
              </h4>

              <p className="mt-2 text-sm text-slate-400">
                MG Road,
                Panaji,
                Goa - 403001
              </p>

            </div>

            <div onClick={() => navigate("/customer/addresses")} className="rounded-xl bg-white/5 p-4 transition hover:bg-white/10 cursor-pointer">

              <h4 className="font-semibold text-white">
                Office
              </h4>

              <p className="mt-2 text-sm text-slate-400">
                Verna Industrial Estate,
                Goa - 403722
              </p>

            </div>

          </div>

        </SectionCard>

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;