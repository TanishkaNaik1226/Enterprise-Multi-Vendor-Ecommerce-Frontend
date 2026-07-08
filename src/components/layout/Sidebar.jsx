import {
  FiGrid,
  FiUser,
  FiMapPin,
  FiShoppingBag,
  FiHeart,
  FiBriefcase,
  FiCreditCard,
  FiFileText,
  FiCheckCircle,
  FiLogOut,
} from "react-icons/fi";

import { NavLink,useNavigate } from "react-router-dom";

function Sidebar({ role = "customer" }) {
  const navigate = useNavigate();
  const customerLinks = [
    {
      name: "Dashboard",
      path: "/customer/dashboard",
      icon: <FiGrid />,
    },
    {
      name: "Profile",
      path: "/customer/profile",
      icon: <FiUser />,
    },
    {
      name: "Addresses",
      path: "/customer/addresses",
      icon: <FiMapPin />,
    },
    {
      name: "Orders",
      path: "/customer/orders",
      icon: <FiShoppingBag />,
    },
    {
      name: "Wishlist",
      path: "/customer/wishlist",
      icon: <FiHeart />,
    },
  ];

  const vendorLinks = [
    {
      name: "Dashboard",
      path: "/vendor/dashboard",
      icon: <FiGrid />,
    },
    {
      name: "Business",
      path: "/vendor/business",
      icon: <FiBriefcase />,
    },
    {
      name: "Profile",
      path: "/vendor/profile",
      icon: <FiUser />,
    },
    {
      name: "Addresses",
      path: "/vendor/addresses",
      icon: <FiMapPin />,
    },
    {
      name: "Bank Details",
      path: "/vendor/bank",
      icon: <FiCreditCard />,
    },
    {
      name: "Documents",
      path: "/vendor/documents",
      icon: <FiFileText />,
    },
    {
      name: "Approval Status",
      path: "/vendor/approval",
      icon: <FiCheckCircle />,
    },
  ];

  const links = role === "vendor" ? vendorLinks : customerLinks;

  return (
    <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">

      {/* Logo */}

      <div className="p-8 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white">
          Shop<span className="text-violet-400">Stack</span>
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Enterprise Marketplace
        </p>
      </div>

      {/* Menu */}

      <nav className="flex-1 px-5 py-8">

        <p className="mb-5 px-3 text-xs uppercase tracking-widest text-slate-500">
          Navigation
        </p>

        <div className="space-y-2">
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>

              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}

      <div className="border-t border-white/10 p-5">

        <button onClick={() => {
          // Handle logout logic here
          navigate("/login");
        }}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-red-500 hover:text-white"
        >
          <FiLogOut />

          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;