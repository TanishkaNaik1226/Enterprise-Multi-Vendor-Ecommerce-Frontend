import { FiBell, FiSearch, FiChevronDown } from "react-icons/fi";

function TopNavbar({ role = "Customer" }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">

      <div className="flex items-center justify-between px-8 py-5">

        {/* Left */}

        <div>

          <h2 className="text-2xl font-bold text-white">
            Welcome Back 👋
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your {role.toLowerCase()} account from one place.
          </p>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          {/* Search */}

          <div className="relative hidden lg:block">

            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search..."
              className="w-72 rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-violet-500"
            />

          </div>

          {/* Notification */}

          <button className="relative rounded-xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-violet-600">

            <FiBell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

          </button>

          {/* User */}

          <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-violet-500 to-blue-500 font-semibold text-white">
                {role.charAt(0)}
            </div>

            <div className="hidden text-left md:block">

              <p className="text-xs text-slate-400">
                {role}
              </p>

            </div>

            <FiChevronDown className="text-slate-400" />

          </button>

        </div>

      </div>

    </header>
  );
}

export default TopNavbar;