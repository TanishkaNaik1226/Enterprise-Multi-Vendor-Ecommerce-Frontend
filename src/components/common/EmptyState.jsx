import { FiInbox } from "react-icons/fi";

function EmptyState({
  title = "Nothing Here",
  subtitle = "No data available.",
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 py-20">

      <div className="mb-6 rounded-full bg-violet-600/20 p-6">
        <FiInbox
          size={40}
          className="text-violet-400"
        />
      </div>

      <h2 className="text-2xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-center text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}

export default EmptyState;