import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { getFreelancerOverviewStats } from "@/lib/dashboard-freelancer-overview";
import { getFreelancerProposals } from "@/lib/dashboard-freelancer-proposals";
import { Search, Send, Clock, CheckCircle2, Wallet, User as UserIcon, TrendingUp } from "lucide-react";
import { getAuthDb } from "@/lib/server-auth-db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return Number.isNaN(amount) ? "$0.00" : `$${amount.toFixed(2)}`;
};

const calculateProfileCompleteness = (user) => {
  if (!user) return 0;
  let score = 0;
  
  if (user.name) score += 15;
  if (user.email) score += 15;
  if (user.image || user.avatar) score += 10;
  if (user.designation || user.headline) score += 15;
  if (user.skills && user.skills.length > 0) score += 15;
  if (user.bio) score += 15;
  if (user.hourlyRate != null) score += 15;
  
  return Math.min(score, 100);
};

export default async function FreelancerDashboardOverviewPage() {
  const session = await getServerSession();
  const user = session?.user || null;
  const userEmail = user?.email;
  
  const db = await getAuthDb();
  const usersCollection = db.collection("user");
  const freshUser = await usersCollection.findOne({ email: userEmail });

  // Fetch overview stats and recent proposals in parallel
  const [stats, allProposals] = await Promise.all([
    getFreelancerOverviewStats(userEmail),
    getFreelancerProposals(userEmail)
  ]);
  
  const recentProposals = allProposals.slice(0, 5);

  // Determine dynamic user status from fresh database query
  const userStatus = String(freshUser?.availabilityStatus || freshUser?.status || user?.availabilityStatus || user?.status || 'available').toLowerCase();
  let statusBadge = {
    indicator: "bg-emerald-500 ring-emerald-500/20",
    textClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
    label: "Available for work"
  };

  if (userStatus === 'busy') {
    statusBadge = {
      indicator: "bg-amber-500 ring-amber-500/20",
      textClass: "text-amber-700 bg-amber-50 border-amber-200",
      label: "Busy on active projects"
    };
  } else if (userStatus === 'unavailable') {
    statusBadge = {
      indicator: "bg-rose-500 ring-rose-500/20",
      textClass: "text-rose-700 bg-rose-50 border-rose-200",
      label: "Unavailable for work"
    };
  }

  const profileCompleteness = calculateProfileCompleteness(freshUser || user);

  return (
    <>
      {/* A. Top Welcome Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2">
            FREELANCER WORKSPACE <span className="mx-1">•</span> OVERVIEW
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="text-[#009689]">{user?.name || "Freelancer"}</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 font-medium">
            Track your proposals, active contracts, and project earnings in real time.
          </p>
        </div>
        
        <Link 
          href="/browse-tasks" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-semibold shadow-sm shadow-teal-900/15 transition-all shrink-0"
        >
          <Search className="w-4 h-4" /> 
          Explore Open Tasks
        </Link>
      </div>

      {/* B. 4-Column Live Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Total Proposals
            </span>
            <div className="bg-teal-50 text-[#009689] p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900">{stats?.totalProposals || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Pending Proposals
            </span>
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900">{stats?.pendingProposals || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Accepted / Active
            </span>
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900">{stats?.acceptedProposals || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Net Earnings
            </span>
            <div className="bg-teal-50 text-[#009689] p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(stats?.totalEarnings)}</p>
          </div>
        </div>
      </div>

      {/* C. Split Two-Column Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Proposals Activity (Span 8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Submitted Proposals</h3>
            {recentProposals.length > 0 && (
              <Link href="/dashboard/freelancer/my-proposals" className="text-sm font-semibold text-[#009689] hover:text-[#238B81]">
                View All
              </Link>
            )}
          </div>
          
          {recentProposals.length > 0 ? (
            <div className="mt-6 flex flex-col gap-3">
              {recentProposals.map((proposal) => {
                const statusColor = 
                  proposal.status === "accepted" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  proposal.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-200" :
                  "bg-amber-50 text-amber-700 border-amber-200";

                return (
                  <div key={proposal.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex flex-col min-w-0 pr-4">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {proposal.taskTitle || "Untitled Task"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <p className="text-sm font-bold text-slate-900">${proposal.proposedBudget}</p>
                      <span className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                        {proposal.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <div className="bg-teal-50 p-4 rounded-full text-[#009689] mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">No proposals yet</h4>
              <p className="text-sm text-slate-500 max-w-sm mb-6">
                You haven't submitted any proposals recently. Browse open tasks and start sending proposals to land your next job.
              </p>
              <Link 
                href="/browse-tasks" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
              >
                Browse Open Tasks
              </Link>
            </div>
          )}
        </div>

        {/* Quick Account / Performance Summary (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900">Account Status</h3>
            
            <div className={`flex items-center justify-between p-3 rounded-xl border ${statusBadge.textClass}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ring-4 ${statusBadge.indicator}`}></div>
                <span className="text-sm font-semibold">{statusBadge.label}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Profile Completeness</span>
                <span className="text-sm font-bold text-[#009689]">{profileCompleteness}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                <div className="bg-[#009689] h-2 rounded-full" style={{ width: `${profileCompleteness}%` }}></div>
              </div>
              <Link href="/profile" className="text-xs font-semibold text-slate-500 hover:text-[#009689] flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> Update Profile
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100/60 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-[#009689]">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-base font-bold">Pro Tips</h3>
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Tailor your proposals to each client's specific needs. A personalized proposal increases your chances of getting hired by up to 40%.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}