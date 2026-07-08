import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";
import StatusBadge from "../../components/common/StatusBadge";

function ApprovalStatus() {
  return (
    <DashboardLayout role="vendor">

      <PageHeader
        title="Approval Status"
        subtitle="Track your vendor verification progress."
      />

      <SectionCard title="Current Status">

        <div className="flex items-center justify-between rounded-xl bg-white/5 p-6">

          <div>

            <h2 className="text-xl font-semibold text-white">
              Vendor Verification
            </h2>

            <p className="mt-2 text-slate-400">
              Your account is currently under review.
            </p>

          </div>

          <StatusBadge status="Pending" />

        </div>

      </SectionCard>

      <SectionCard title="Approval Timeline">

        <div className="mt-4 space-y-6">

          <div className="flex gap-5">

            <div className="mt-2 h-3 w-3 rounded-full bg-green-500"></div>

            <div>

              <h3 className="font-semibold text-white">
                Registration Submitted
              </h3>

              <p className="text-slate-400">
                01 July 2026
              </p>

            </div>

          </div>

          <div className="flex gap-5">

            <div className="mt-2 h-3 w-3 rounded-full bg-yellow-500"></div>

            <div>

              <h3 className="font-semibold text-white">
                Document Verification
              </h3>

              <p className="text-slate-400">
                In Progress
              </p>

            </div>

          </div>

          <div className="flex gap-5">

            <div className="mt-2 h-3 w-3 rounded-full bg-slate-600"></div>

            <div>

              <h3 className="font-semibold text-white">
                Final Approval
              </h3>

              <p className="text-slate-500">
                Waiting
              </p>

            </div>

          </div>

        </div>

      </SectionCard>

    </DashboardLayout>
  );
}

export default ApprovalStatus;