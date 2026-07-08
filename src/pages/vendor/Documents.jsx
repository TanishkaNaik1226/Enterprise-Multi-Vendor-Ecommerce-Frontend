import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";
import { FiUploadCloud, FiCheckCircle } from "react-icons/fi";
import { useState } from "react";

function Documents() {
    const [uploadedFiles, setUploadedFiles] = useState({});
    const handleUpload = (title, file) => {
        if(!file) return;
        setUploadedFiles((prev) => ({
            ...prev,
            [title]: file.name,
        }));
    }
  const documents = [
    {
      title: "GST Certificate",
      status: "Verified",
    },
    {
      title: "PAN Card",
      status: "Pending",
    },
    {
      title: "Business License",
      status: "Pending",
    },
  ];

  return (
    <DashboardLayout role="vendor">
      <PageHeader
        title="Vendor Documents"
        subtitle="Upload and manage your verification documents."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <SectionCard key={doc.title} title={doc.title}>
            <div className="flex flex-col items-center">

              <div className="rounded-full bg-violet-500/20 p-5">
                <FiUploadCloud
                  size={35}
                  className="text-violet-400"
                />
              </div>

              <p className="mt-5 text-center text-slate-400">
                Upload PDF / JPG / PNG
              </p>

              <label className="mt-5 cursor-pointer rounded-xl bg-violet-600 px-6 py-2 text-white hover:bg-violet-700">

  Upload

  <input
    type="file"
    hidden
    onChange={(e) =>
      handleUpload(doc.title, e.target.files[0])
    }
  />

</label>
{uploadedFiles[doc.title] && (
  <p className="mt-3 text-sm text-green-400">
    ✓ {uploadedFiles[doc.title]}
  </p>
)}

              <div className="mt-6 flex items-center gap-2 text-green-400">

                <FiCheckCircle />

                {doc.status}

              </div>

            </div>
          </SectionCard>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Documents;