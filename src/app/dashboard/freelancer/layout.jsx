import { requireRole, getServerSession } from "@/lib/session";
import FreelancerSidebar from "@/components/dashboard/FreelancerSidebar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Freelancer Dashboard | Taskify",
};

const FreelancerDashboardLayout = async ({ children }) => {
  await requireRole("freelancer");
  const session = await getServerSession();
  const user = session?.user || null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50/70 text-slate-800">
      <FreelancerSidebar user={user} />
      <main className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 w-full">
        <div className="flex items-center justify-between lg:hidden pb-4 mb-4 border-b border-slate-200/80">
          <Link className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900" href="/">
            <ArrowLeft className="w-4 h-4"/>
            <span>Back to Taskify</span>
          </Link>
          <span className="text-xs font-bold text-[#009689]">Workspace</span>
        </div>
        {children}
      </main>
    </div>
  );
};

export default FreelancerDashboardLayout;