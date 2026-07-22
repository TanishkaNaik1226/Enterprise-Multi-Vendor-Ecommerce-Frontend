import "./AvailabilityBadge.css";

// Derives status from stock quantity — no backend field needed.
// Thresholds are placeholders; tune LOW_STOCK_THRESHOLD to your product's needs.
const LOW_STOCK_THRESHOLD = 10;

function getStatus(stockQty) {
  if (stockQty <= 0) return { label: "Out of Stock", className: "badge-out" };
  if (stockQty <= LOW_STOCK_THRESHOLD) return { label: "Low Stock", className: "badge-low" };
  return { label: "In Stock", className: "badge-in" };
}

export default function AvailabilityBadge({ stockQty }) {
  const { label, className } = getStatus(stockQty);
  return <span className={`badge ${className}`}>{label}</span>;
}
