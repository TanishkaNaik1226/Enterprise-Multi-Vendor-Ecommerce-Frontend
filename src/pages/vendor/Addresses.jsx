import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiMapPin,
} from "react-icons/fi";

function Addresses() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Warehouse",
      address: "Verna Industrial Estate, Goa",
    },
    {
      id: 2,
      type: "Billing",
      address: "Panaji, Goa",
    },
    {
      id: 3,
      type: "Pickup",
      address: "Margao, Goa",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");

  const handleAdd = () => {
    if (!type.trim() || !address.trim()) return;

    setAddresses([
      ...addresses,
      {
        id: Date.now(),
        type,
        address,
      },
    ]);

    setType("");
    setAddress("");
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setType(item.type);
    setAddress(item.address);
  };

  const handleSave = () => {
    setAddresses(
      addresses.map((item) =>
        item.id === editingId
          ? {
              ...item,
              type,
              address,
            }
          : item
      )
    );

    setEditingId(null);
    setType("");
    setAddress("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setType("");
    setAddress("");
  };

  return (
    <DashboardLayout role="vendor">
      <PageHeader
        title="Business Addresses"
        subtitle="Manage your warehouse and pickup locations."
      />

      <SectionCard title="Add New Address">

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Address Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
          />

          <textarea
            rows="3"
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
          />

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-white hover:bg-violet-700"
          >
            <FiPlus />
            Add Address
          </button>

        </div>

      </SectionCard>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {addresses.map((item) => (

          <SectionCard
            key={item.id}
            title={editingId === item.id ? "Edit Address" : item.type}
          >

            {editingId === item.id ? (

              <>

                <input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
                />

                <textarea
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
                />

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Save
                  </button>

                  <button
                    onClick={handleCancel}
                    className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </button>

                </div>

              </>

            ) : (

              <div className="flex items-start gap-4">

                <FiMapPin
                  className="mt-1 text-violet-400"
                  size={22}
                />

                <div className="flex-1">

                  <p className="text-slate-300">
                    {item.address}
                  </p>

                  <div className="mt-5 flex gap-3">

                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      <FiEdit2 />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      <FiTrash2 />
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            )}

          </SectionCard>

        ))}

      </div>

    </DashboardLayout>
  );
}

export default Addresses;