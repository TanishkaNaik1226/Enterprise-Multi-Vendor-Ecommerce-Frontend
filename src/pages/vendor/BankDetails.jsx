import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";
import { useState } from "react";
function BankDetails() {
    const [message, setMessage] = useState("");
    const handleSave = () => {
        setMessage("✅ Bank details updated successfully!");
        setTimeout(() => {
            setMessage("");
        }, 3000);
    };

  return (

    <DashboardLayout role="vendor">

      <PageHeader
        title="Bank Details"
        subtitle="Manage your settlement account."
      />

      <SectionCard title="Bank Information">

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm text-slate-300">
              Account Holder
            </label>

            <input
              defaultValue="Tech World Pvt Ltd"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-slate-300">
              Bank Name
            </label>

            <input
              defaultValue="State Bank of India"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-slate-300">
              Account Number
            </label>

            <input
              defaultValue="XXXX XXXX XXXX 1234"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-slate-300">
              IFSC Code
            </label>

            <input
              defaultValue="SBIN0001234"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
            />

          </div>

        </div>

        <button
          onClick={handleSave}
          className="mt-8 rounded-xl bg-violet-600 px-6 py-3 text-white hover:bg-violet-700"
        >
          Save Bank Details
        </button>

        {message && (
          <p className="mt-4 text-green-400 font-medium">
            {message}
          </p>
        )}

      </SectionCard>

    </DashboardLayout>

  );

}

export default BankDetails;