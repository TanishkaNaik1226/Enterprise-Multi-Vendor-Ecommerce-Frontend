import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";

function Profile() {
  const [profile, setProfile] = useState({
    firstName: "Customer",
    lastName: "1234",
    email: "customer@gmail.com",
    phone: "+91 9876543210",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setMessage("✅ Profile updated successfully!");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <DashboardLayout role="customer">

      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information."
      />

      <SectionCard title="Personal Information">

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              First Name
            </label>

            <input
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Last Name
            </label>

            <input
              name="lastName"
              value={profile.lastName}
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
              value={profile.email}
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
              value={profile.phone}
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
          <p className="mt-4 text-green-400 font-medium">
            {message}
          </p>
        )}

      </SectionCard>

    </DashboardLayout>
  );
}

export default Profile;