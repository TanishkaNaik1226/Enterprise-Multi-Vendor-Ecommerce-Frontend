import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";
import { useState } from "react";
function BusinessDetails() {
    const [message, setMessage] = useState("");
    const handleSave = () => {
        setMessage("✅ Business details updated successfully!");
        setTimeout(() => {
            setMessage("");
        }, 3000);
    };
  return (
    <DashboardLayout role="vendor">

      <PageHeader
        title="Business Details"
        subtitle="Manage your business information."
      />

      <SectionCard title="Business Information">

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Business Name
            </label>

            <input
              defaultValue="Tech World Pvt Ltd"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Business Email
            </label>

            <input
              defaultValue="business@shopstack.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Business Phone
            </label>

            <input
              defaultValue="+91 9876543210"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              GST Number
            </label>

            <input
              defaultValue="22ABCDE1234F1Z5"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
            />
          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm text-slate-300">
              Business Description
            </label>

            <textarea
              rows="5"
              defaultValue="Premium electronics and accessories supplier."
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
            />

          </div>

        </div>

        <button
  onClick={handleSave}
  className="mt-8 rounded-xl bg-violet-600 px-6 py-3 text-white hover:bg-violet-700"
>
  Save Business Details
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

export default BusinessDetails;