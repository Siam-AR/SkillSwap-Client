import { getServerSession } from "@/lib/session";
import { getFreelancerEarnings } from "@/lib/dashboard-freelancer-earnings";
import EarningsClientView from "./EarningsClientView";

export default async function FreelancerEarningsPage() {
  const session = await getServerSession();
  const freelancerEmail = session?.user?.email || "";
  const earnings = freelancerEmail ? await getFreelancerEarnings(freelancerEmail) : [];

  const totalEarnings = earnings.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const completedProjects = earnings.length;

  return (
    <div className="space-y-6">
      {/* 1. Modern Borderless Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            FREELANCER WORKSPACE • FINANCIALS & PAYOUTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Earnings & Payouts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your net earnings, pending milestone releases, and completed payment history.
          </p>
        </div>
      </div>
      
      <EarningsClientView 
        initialEarnings={earnings}
        totalEarnings={totalEarnings}
        completedTasks={completedProjects}
      />
    </div>
  );
}
