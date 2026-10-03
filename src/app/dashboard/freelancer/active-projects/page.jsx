import { getServerSession } from "@/lib/session";
import { getFreelancerActiveProjects } from "@/lib/dashboard-freelancer-active-projects";
import FreelancerActiveProjectsPanel from "@/components/dashboard/FreelancerActiveProjectsPanel";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function FreelancerActiveProjectsPage() {
  const session = await getServerSession();
  const freelancerEmail = session?.user?.email || "";
  const projects = freelancerEmail ? await getFreelancerActiveProjects(freelancerEmail) : [];

  return (
    <div className="space-y-6">
      {/* Modern Open Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            FREELANCER WORKSPACE • CONTRACTS & PROJECTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Active Projects
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track ongoing contracts, submit project deliverables, and review client milestones.
          </p>
        </div>

        {/* Clean Action & Queue Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-[#009689] border border-teal-200/70">
            <span className="w-2 h-2 rounded-full bg-[#009689]" />
            <span>{projects.length || 0} In Queue</span>
          </div>

          <Link className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-teal-900/15 transition-all" href="/browse-tasks">
            <Search className="w-4 h-4"/>
            <span>Find Tasks</span>
          </Link>
        </div>
      </div>

      <FreelancerActiveProjectsPanel initialProjects={projects} freelancerEmail={freelancerEmail} />
    </div>
  );
}
