"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusCircle, Briefcase, FolderOpen, Clock, CheckCircle2, Search, FolderSearch, X, Edit3, Calendar, DollarSign, Users } from "lucide-react";
import EditTaskForm from "@/components/dashboard/EditTaskForm";
import ReviewDeliverablesModal from "@/components/dashboard/ReviewDeliverablesModal";
import { fetchMyTasks } from "@/lib/api";

const getStatusCount = (tasks, statusMatcher) =>
  tasks.filter((task) => statusMatcher(String(task.status || "").toLowerCase())).length;

export default function ClientMyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const [updateSuccessTask, setUpdateSuccessTask] = useState(null);
  const [reviewingTask, setReviewingTask] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadTasks = async () => {
      try {
        const response = await fetchMyTasks();
        if (!mounted) return;
        const taskItems = Array.isArray(response?.data) ? response.data : [];
        setTasks(taskItems);
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError?.message || "Unable to load your tasks. Please try again.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    loadTasks();
    return () => {
      mounted = false;
    };
  }, []);

  const totalTasks = tasks.length;
  const openTasks = getStatusCount(tasks, (status) => status === "open");
  const inProgressTasks = getStatusCount(tasks, (status) => status.includes("progress"));
  const underReviewTasks = getStatusCount(tasks, (status) => status.includes("review") || status === "submitted");
  const completedTasks = getStatusCount(tasks, (status) => status.includes("complete"));

  const filteredTasks = tasks.filter((task) => {
    // 1. Filter by Status
    const status = String(task.status || "").toLowerCase();
    let matchesStatus = true;
    if (selectedFilter === "open") matchesStatus = status === "open";
    if (selectedFilter === "progress") matchesStatus = status.includes("progress");
    if (selectedFilter === "review") matchesStatus = status.includes("review") || status === "submitted";
    if (selectedFilter === "completed") matchesStatus = status.includes("complete");

    // 2. Filter by Search Query
    const searchLower = searchQuery.toLowerCase();
    const title = String(task.title || "").toLowerCase();
    const category = String(task.category || "").toLowerCase();
    const matchesSearch = title.includes(searchLower) || category.includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const handleTaskUpdated = (updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        String(item._id ?? item.id) === String(updatedTask._id ?? updatedTask.id) ? updatedTask : item
      )
    );
    setEditingTask(null);
    setUpdateSuccessTask(updatedTask);
  };

  const getStatusColor = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "open") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s.includes("progress")) return "bg-amber-50 text-amber-600 border-amber-100";
    if (s.includes("review") || s === "submitted") return "bg-indigo-50 text-indigo-600 border-indigo-100";
    if (s.includes("revision")) return "bg-rose-50 text-rose-600 border-rose-100";
    if (s.includes("complete")) return "bg-sky-50 text-sky-600 border-sky-100";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="space-y-8">
      {/* 1. Modern Borderless Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            CLIENT WORKSPACE • TASK MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Posted Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your live project postings, manage received bids, and update active contract terms.
          </p>
        </div>

        <div className="shrink-0">
          <Link 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-teal-900/15 transition-all" 
            href="/dashboard/client/post-task"
          >
            <PlusCircle className="w-4 h-4"/>
            <span>Post a New Task</span>
          </Link>
        </div>
      </div>

      {/* 2. Elevated 4-Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-[#009689]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Posted</p>
              <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{openTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">{inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
          {error}
        </div>
      ) : null}

      {/* 3. Interactive Filter Tabs & Keyword Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100/70 rounded-xl">
          {[
            { id: "all", label: "All Tasks", count: totalTasks },
            { id: "open", label: "Open", count: openTasks },
            { id: "progress", label: "In Progress", count: inProgressTasks },
            { id: "review", label: "Under Review", count: underReviewTasks },
            { id: "completed", label: "Completed", count: completedTasks },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedFilter === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                selectedFilter === tab.id ? "bg-slate-100 text-slate-700" : "bg-slate-200/70 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-teal-500/30 border-t-[#009689] rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-semibold">Loading your tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        /* 6. Friendly Empty State */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-[#009689] flex items-center justify-center mb-4">
            <FolderSearch className="w-8 h-8" />
          </div>
          <p className="text-lg font-bold text-slate-900">No tasks found</p>
          <p className="mt-1 text-sm text-slate-500 max-w-md">
            You haven't posted any tasks matching this filter. Create a new task to receive proposals.
          </p>
          <Link href="/dashboard/client/post-task" className="mt-6 inline-flex rounded-xl bg-[#009689] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#238B81] shadow-sm shadow-teal-900/15">
            Post a New Task
          </Link>
        </div>
      ) : (
        /* 4. Elevated Modern Task Cards Grid */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <div key={String(task._id ?? task.id)} className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-teal-200/70 transition-all flex flex-col justify-between group relative h-full">
              
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                    {task.category || "General"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
                    {task.status || "Open"}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-[#009689] transition-colors">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                  {task.description}
                </p>

                {(String(task.status || "").toLowerCase().includes("review") || String(task.status || "").toLowerCase() === "submitted") && (
                  <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <p className="text-xs font-bold text-indigo-800 mb-2">Freelancer has submitted the project deliverables for your review.</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setReviewingTask(task);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Review Deliverables
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#009689] flex items-center justify-center shrink-0">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Budget</span>
                      <span className="text-xs font-bold text-[#009689]">${task.budget}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Deadline</span>
                      <span className="text-xs font-bold text-slate-700 truncate">{task.deadline ? new Date(task.deadline).toLocaleDateString() : "TBD"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>{task.proposals?.length || 0} Proposals</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {String(task.status || "").toLowerCase() === "open" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingTask(task);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                      title="Edit Task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <Link 
                    href={`/tasks/${task._id ?? task.id}`} 
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Polished Light-Themed Modals */}
      {editingTask ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Edit Task</p>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Update your open task</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <EditTaskForm task={editingTask} onCancel={() => setEditingTask(null)} onUpdated={handleTaskUpdated} />
          </div>
        </div>
      ) : null}

      {updateSuccessTask ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-sm w-full p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Task Updated Successfully</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Your task <span className="font-semibold text-slate-700">"{updateSuccessTask.title}"</span> has been saved and is now live.
            </p>
            <button
              type="button"
              onClick={() => setUpdateSuccessTask(null)}
              className="mt-6 w-full rounded-xl bg-[#009689] hover:bg-[#238B81] px-5 py-3 text-sm font-semibold text-white transition shadow-sm shadow-teal-900/15"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {reviewingTask ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <ReviewDeliverablesModal 
            task={reviewingTask} 
            onClose={() => setReviewingTask(null)} 
            onActionComplete={handleTaskUpdated} 
          />
        </div>
      ) : null}
    </div>
  );
}
