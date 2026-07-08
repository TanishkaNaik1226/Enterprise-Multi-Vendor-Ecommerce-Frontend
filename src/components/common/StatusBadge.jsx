function StatusBadge({
  status = "Active",
}) {
  const styles = {
    Active: "bg-green-500/20 text-green-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Approved: "bg-green-500/20 text-green-400",
    Rejected: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-xs font-semibold ${
        styles[status] || "bg-slate-600 text-white"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;