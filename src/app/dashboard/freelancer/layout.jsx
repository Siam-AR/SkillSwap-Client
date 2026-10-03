import { requireRole, getServerSession } from "@/lib/session";
import FreelancerSidebar from "@/components/dashboard/FreelancerSidebar";

export const metadata = {
  title: "Freelancer Dashboard | Taskify",
};

const FreelancerDashboardLayout = async ({ children }) => {
  await requireRole("freelancer");
  const session = await getServerSession();
  const user = session?.user || null;

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 lg:flex">
      <FreelancerSidebar user={user} />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 w-full">
        {children}
      </main>
    </div>
  );
};

export default FreelancerDashboardLayout;