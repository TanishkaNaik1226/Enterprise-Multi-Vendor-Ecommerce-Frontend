import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import SectionCard from "../../components/common/SectionCard";
import StatusBadge from "../../components/common/StatusBadge";

import {
  FiPackage,
  FiDollarSign,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Products",
      value: "120",
      icon: <FiPackage />,
      change: "+12%",
      color: "from-violet-500 to-indigo-500",
      path: "/vendor/business",
    },
    {
      title: "Revenue",
      value: "₹2.4L",
      icon: <FiDollarSign />,
      change: "+18%",
      color: "from-emerald-500 to-green-500",
      path: "/vendor/bank",
    },
    {
      title: "Orders",
      value: "348",
      icon: <FiShoppingCart />,
      change: "+9%",
      color: "from-blue-500 to-cyan-500",
      path: "/vendor/addresses",
    },
    {
      title: "Rating",
      value: "4.8",
      icon: <FiStar />,
      change: "+0.2",
      color: "from-yellow-500 to-orange-500",
      path: "/vendor/approval",
    },
  ];

  return (
    <DashboardLayout role="vendor">

      <PageHeader
        title="Vendor Dashboard"
        subtitle="Overview of your business performance."
      />

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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <SectionCard title="Recent Orders">

          <div className="space-y-4">

            <div onClick={() => navigate("/vendor/orders")} className="flex justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/10 cursor-pointer">
              <div>
                <h4 className="font-semibold text-white">
                  ORD-3025
                </h4>
                <p className="text-sm text-slate-400">
                  MacBook Air M3
                </p>
              </div>

              <StatusBadge status="Approved" />
            </div>

            <div onClick={() => navigate("/vendor/orders")} className="flex justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/10 cursor-pointer">
              <div>
                <h4 className="font-semibold text-white">
                  ORD-3026
                </h4>
                <p className="text-sm text-slate-400">
                  Logitech MX Master
                </p>
              </div>

              <StatusBadge status="Pending" />
            </div>

          </div>

        </SectionCard>

        <SectionCard title="Business Status">

          <div className="space-y-5">

            <div
  onClick={() => navigate("/vendor/business")}
  className="flex cursor-pointer justify-between rounded-lg p-2 transition hover:bg-white/5"
>
              <span className="text-slate-400">Store Status</span>
              <StatusBadge status="Approved" />
            </div>

            <div
  onClick={() => navigate("/vendor/business")}
  className="flex cursor-pointer justify-between rounded-lg p-2 transition hover:bg-white/5"
>
              <span className="text-slate-400">GST Verified</span>
              <StatusBadge status="Approved" />
            </div>

            <div
  onClick={() => navigate("/vendor/business")}
  className="flex cursor-pointer justify-between rounded-lg p-2 transition hover:bg-white/5"
>
              <span className="text-slate-400">KYC</span>
              <StatusBadge status="Pending" />
            </div>

          </div>

        </SectionCard>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;