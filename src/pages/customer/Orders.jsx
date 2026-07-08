import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";

function Orders() {
  const orders = [
    {
      id: "ORD-1001",
      product: "Wireless Mouse",
      amount: "₹999",
      date: "01 Jul 2026",
      status: "Approved",
    },
    {
      id: "ORD-1002",
      product: "Mechanical Keyboard",
      amount: "₹3,499",
      date: "03 Jul 2026",
      status: "Pending",
    },
    {
      id: "ORD-1003",
      product: "Gaming Headset",
      amount: "₹2,499",
      date: "05 Jul 2026",
      status: "Approved",
    },
    {
      id: "ORD-1004",
      product: "Laptop Stand",
      amount: "₹1,299",
      date: "06 Jul 2026",
      status: "Rejected",
    },
  ];

  return (
    <DashboardLayout role="customer">
      <PageHeader
        title="My Orders"
        subtitle="View all your recent orders."
      />

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="w-full">

          <thead className="border-b border-white/10 bg-white/5">
            <tr>

              <th className="px-6 py-4 text-left text-slate-300">
                Order ID
              </th>

              <th className="px-6 py-4 text-left text-slate-300">
                Product
              </th>

              <th className="px-6 py-4 text-left text-slate-300">
                Date
              </th>

              <th className="px-6 py-4 text-left text-slate-300">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-slate-300">
                Status
              </th>

            </tr>
          </thead>

          <tbody>

            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-white/5 transition hover:bg-white/5"
              >

                <td className="px-6 py-5 text-white">
                  {order.id}
                </td>

                <td className="px-6 py-5 text-slate-300">
                  {order.product}
                </td>

                <td className="px-6 py-5 text-slate-300">
                  {order.date}
                </td>

                <td className="px-6 py-5 font-semibold text-white">
                  {order.amount}
                </td>

                <td className="px-6 py-5">
                  <StatusBadge status={order.status} />
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </DashboardLayout>
  );
}

export default Orders;