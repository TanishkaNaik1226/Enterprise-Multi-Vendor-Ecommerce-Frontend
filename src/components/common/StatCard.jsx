import { FiArrowUpRight } from "react-icons/fi";

function StatCard({
  title,
  value,
  icon,
  change = "+0%",
  color = "from-violet-500 to-blue-500",
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-white/10">

      {/* Glow */}

      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-linear-to-r ${color} opacity-20 blur-3xl transition-all duration-300 group-hover:opacity-40`}
      />

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h2>

          <div className="mt-5 flex items-center gap-2 text-sm text-emerald-400">

            <FiArrowUpRight />

            <span>{change}</span>

            <span className="text-slate-500">
              this month
            </span>

          </div>

        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r ${color} text-2xl text-white shadow-lg`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;