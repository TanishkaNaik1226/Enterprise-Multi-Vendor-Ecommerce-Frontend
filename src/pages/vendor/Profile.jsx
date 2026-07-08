import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";

function Profile() {

  const [vendor, setVendor] = useState({
    ownerName: "Vendor 1234",
    email: "vendor@shopstack.com",
    phone: "+91 9876543210",
    gst: "22ABCDE1234F1Z5",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setVendor({
      ...vendor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setMessage("✅ Vendor profile updated successfully!");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <DashboardLayout role="vendor">

      <PageHeader
        title="Vendor Profile"
        subtitle="Manage your vendor profile."
      />

      <SectionCard title="Vendor Information">

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm text-slate-300">
              Owner Name
            </label>

            <input
              name="ownerName"
              value={vendor.ownerName}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-slate-300">
              Email
            </label>

            <input
              name="email"
              value={vendor.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-slate-300">
              Phone
            </label>

            <input
              name="phone"
              value={vendor.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-slate-300">
              GST Number
            </label>

            <input
              name="gst"
              value={vendor.gst}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none"
            />

          </div>

        </div>

        <button
          onClick={handleSave}
          className="mt-8 rounded-xl bg-violet-600 px-6 py-3 text-white hover:bg-violet-700"
        >
          Save Changes
        </button>

        {message && (
          <p className="mt-4 font-medium text-green-400">
            {message}
          </p>
        )}

      </SectionCard>

    </DashboardLayout>
  );
}

export default Profile;