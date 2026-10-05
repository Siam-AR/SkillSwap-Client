"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Briefcase, FolderOpen, Clock, Wallet, Search, CheckCircle } from "lucide-react";
import { getClientDashboardOverview } from "@/lib/dashboard-client-overview";
import { useSession } from "@/lib/auth-client";

export default function ClientDashboardHomePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [overview, setOverview] = useState({
    totalTasks: 0,
    openTasks: 0,
    inProgressTasks: 0,
    totalSpent: 0,
    taskError: null,
    transactionError: null,
    recentTasks: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadOverview = async () => {
      try {
        const data = await getClientDashboardOverview();
        if (!mounted) return;

        setOverview({
          totalTasks: data.totalTasks || 0,
          openTasks: data.openTasks || 0,
          inProgressTasks: data.inProgressTasks || 0,
          totalSpent: data.totalSpent || 0,
          taskError: data.taskError || null,
          transactionError: data.transactionError || null,
          recentTasks: data.recentTasks || [],
        });

        const combinedError = [data.taskError, data.transactionError].filter(Boolean).join(" • ");
        if (combinedError) {
          setError(combinedError);
        }
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError?.message || "Unable to load dashboard overview.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    loadOverview();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            CLIENT WORKSPACE • OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, <span className="text-[#009689]">{user?.name || "Client"}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your posted tasks, review incoming freelancer proposals, and track project spend.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-teal-900/15 transition-all" href="/dashboard/client/post-task">
            <PlusCircle className="w-4 h-4"/>
            <span>Post a New Task</span>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-[1.5rem] mt-6 border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
          {error}
        </div>
      ) : null}

      {/* 4-Column Live Financial & Project Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {/* Card 1: Total Tasks */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal-50 text-[#009689] p-2.5 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">TOTAL TASKS</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{overview.totalTasks}</h3>
            <p className="text-xs text-slate-500 mt-1">All projects created</p>
          </div>
        </div>

        {/* Card 2: Open Tasks */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-sky-50 text-sky-600 p-2.5 rounded-xl">
              <FolderOpen className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">OPEN TASKS</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{overview.openTasks}</h3>
            <p className="text-xs text-slate-500 mt-1">Actively receiving bids</p>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">ACTIVE CONTRACTS</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{overview.inProgressTasks}</h3>
            <p className="text-xs text-slate-500 mt-1">Underway with freelancers</p>
          </div>
        </div>

        {/* Card 4: Total Spent */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">TOTAL INVESTMENT</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">${overview.totalSpent.toFixed(2)}</h3>
            <p className="text-xs text-slate-500 mt-1">Cleared project funds</p>
          </div>
        </div>
      </div>

      {/* Split Activity & Quick Control Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        
        {/* Main Feed: Span 8 */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Active & Recent Tasks</h2>
            <Link href="/dashboard/client/my-tasks" className="text-[#009689] text-sm font-semibold hover:underline">
              View All Tasks
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {overview.recentTasks && overview.recentTasks.length > 0 ? (
              <div className="space-y-3 mt-4">
                {overview.recentTasks.map(task => (
                   <div key={task._id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold tracking-wider text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md uppercase">{task.category || "General"}</span>
                          <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase ${task.status === "open" ? "bg-sky-100 text-sky-700" : task.status === "in_progress" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {task.status.replace("_", " ")}
                          </span>
                       </div>
                       <h4 className="font-semibold text-slate-900">{task.title}</h4>
                     </div>
                     <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="text-slate-600">${task.budget}</span>
                        <Link href={`/dashboard/client/my-tasks/${task._id}`} className="text-[#009689] hover:underline">View</Link>
                     </div>
                   </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <FolderOpen className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold mb-2">No active tasks</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6">
                  You haven't posted any tasks yet. Create your first project to start receiving bids from top freelancers.
                </p>
                <Link href="/dashboard/client/post-task" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-semibold shadow-sm shadow-teal-900/15 transition-all">
                  <PlusCircle className="w-4 h-4"/>
                  <span>Post Your First Task</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions: Span 4 */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Client Quick Actions</h2>
          
          <div className="grid gap-3">
            <Link href="/freelancers" className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-[#009689] hover:border-[#009689] transition-all flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-xl group-hover:text-[#009689] shadow-sm">
                <Search className="w-5 h-5 text-slate-600 group-hover:text-[#009689]" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-white transition-colors">Browse Freelancers</h4>
                <p className="text-xs text-slate-500 mt-0.5 group-hover:text-teal-100 transition-colors">Find and invite top talent directly.</p>
              </div>
            </Link>

            <Link href="/dashboard/client/proposals" className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-[#009689] hover:border-[#009689] transition-all flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-xl group-hover:text-[#009689] shadow-sm">
                <CheckCircle className="w-5 h-5 text-slate-600 group-hover:text-[#009689]" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-white transition-colors">Manage Proposals</h4>
                <p className="text-xs text-slate-500 mt-0.5 group-hover:text-teal-100 transition-colors">Review and accept pending bids.</p>
              </div>
            </Link>

            <Link href="/dashboard/client/payments" className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-[#009689] hover:border-[#009689] transition-all flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-xl group-hover:text-[#009689] shadow-sm">
                <Wallet className="w-5 h-5 text-slate-600 group-hover:text-[#009689]" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-white transition-colors">Payment Receipts</h4>
                <p className="text-xs text-slate-500 mt-0.5 group-hover:text-teal-100 transition-colors">Access transaction records & invoices.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}