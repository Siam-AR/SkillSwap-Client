"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, FolderOpen, Clock, CheckCircle2, Search, RefreshCw, 
  Trash2, ExternalLink, User, AlertTriangle, X, FileText
} from "lucide-react";
import { deleteAdminTask, fetchAdminTasks } from "@/lib/api";

const normalizeStatus = (status) => {
  const value = String(status || "open").trim().toLowerCase();
  if (value.includes("complete")) return "completed";
  if (value.includes("paid")) return "completed"; 
  if (value.includes("cancel")) return "cancelled";
  if (value.includes("close")) return "closed";
  if (value.includes("progress")) return "in_progress";
  if (value.includes("review")) return "in_progress";
  return "open";
};

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export default function AdminManageTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingIds, setSavingIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", type: "info" });
  
  // Filtering & Search
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAdminTasks({ status: "all" });
      setTasks(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      const message = err?.message || "Unable to load tasks.";
      setError(message);
      setNotification({ open: true, message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadTasks();
    };
    void load();
  }, []);

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const task = taskToDelete;
    if (!task) return;

    setConfirmOpen(false);
    setSavingIds((current) => [...current, task.id]);
    setError(null);

    try {
      await deleteAdminTask(task.id);
      setTasks((current) => current.filter((currentTask) => currentTask.id !== task.id));
      setNotification({ open: true, message: `Task "${task.title || "Untitled task"}" deleted successfully.`, type: "success" });
    } catch (err) {
      const message = err?.message || "Unable to delete task.";
      setError(message);
      setNotification({ open: true, message, type: "error" });
    } finally {
      setSavingIds((current) => current.filter((id) => id !== task.id));
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setTaskToDelete(null);
  };

  // Metrics
  const totalTasks = tasks.length;
  const openTasksCount = tasks.filter((t) => normalizeStatus(t.status) === "open").length;
  const inProgressCount = tasks.filter((t) => normalizeStatus(t.status) === "in_progress").length;
  const completedCount = tasks.filter((t) => normalizeStatus(t.status) === "completed").length;

  // Filter & Search Logic
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedTab !== "all") {
      filtered = filtered.filter(t => normalizeStatus(t.status) === selectedTab);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title?.toLowerCase().includes(query) || 
        t.clientEmail?.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [tasks, selectedTab, searchQuery]);

  const closeNotification = () => {
    setNotification((current) => ({ ...current, open: false }));
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notification.open && (
        <div className={`fixed right-4 top-4 z-50 max-w-sm rounded-2xl border p-4 shadow-xl ${
          notification.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : notification.type === "warning"
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-rose-200 bg-rose-50 text-rose-800"
        }`}>
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium">{notification.message}</p>
            <button type="button" onClick={closeNotification} className="text-slate-500 hover:text-slate-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Modern Borderless Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            ADMIN CONSOLE • TASK MODERATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Manage Platform Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Inspect published jobs, audit deliverable statuses, and moderate inappropriate submissions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadTasks}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#009689] ${loading ? "animate-spin text-slate-500" : ""}`} />
            <span>Refresh Tasks</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {/* 2. High-Level Task Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-teal-50 text-[#009689] p-3 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Published</p>
            <p className="text-xl font-bold text-slate-900">{totalTasks}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-sky-50 text-sky-600 p-3 rounded-xl">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Open for Bids</p>
            <p className="text-xl font-bold text-slate-900">{openTasksCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">In Progress / Review</p>
            <p className="text-xl font-bold text-slate-900">{inProgressCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Completed</p>
            <p className="text-xl font-bold text-slate-900">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* 3. Integrated Filter Tabs & Live Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100/70 rounded-xl">
          {[
            { id: "all", label: "All Tasks", count: totalTasks },
            { id: "open", label: "Open", count: openTasksCount },
            { id: "in_progress", label: "In Progress", count: inProgressCount },
            { id: "completed", label: "Completed", count: completedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                selectedTab === tab.id ? "bg-slate-100 text-slate-700" : "bg-slate-200/70 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          <input
            type="text"
            placeholder="Search by task title, client, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 4. Elevated Light Table & Balanced Moderation Actions */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-slate-100 text-left text-sm text-slate-800">
            <colgroup>
              <col style={{ width: '32%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '14%' }} />
            </colgroup>
            <thead className="bg-slate-50/50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Task Details</th>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Client</th>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Budget</th>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Posted</th>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#009689] mb-3" />
                      <p className="font-medium">Loading tasks...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="font-medium">No tasks found.</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const normalizedStatus = normalizeStatus(task.status);
                  const isSaving = savingIds.includes(task.id);
                  const clientEmailSnippet = task.clientEmail ? task.clientEmail.split('@')[0] : "Unknown";

                  return (
                    <tr key={task.id} className="bg-white hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-1 min-w-0">
                          <Link href={`/tasks/${task.id}`} className="font-bold text-slate-900 text-sm hover:text-[#009689] transition-colors line-clamp-1 block">
                            {task.title || "Untitled task"}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-slate-400">ID: {task.id.slice(-6)}</span>
                            <span className="bg-teal-50 text-teal-700 border border-teal-200/60 uppercase tracking-wider text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                              {task.category || "General"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600 truncate">
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-100 p-1 rounded-full text-slate-400">
                            <User className="w-3 h-3" />
                          </div>
                          <span className="truncate">{task.clientEmail || task.clientId || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-bold text-[#009689]">
                        ${Number(task.budget ?? task.amount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 capitalize">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          normalizedStatus === "open"
                            ? "bg-sky-50 text-sky-700 border-sky-200/60"
                            : normalizedStatus === "in_progress"
                            ? "bg-amber-50 text-amber-700 border-amber-200/60"
                            : normalizedStatus === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : "bg-slate-50 text-slate-700 border-slate-200/60"
                        }`}>
                          {normalizedStatus.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(task.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/tasks/${task.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-500 hover:text-slate-700 transition-all shadow-sm"
                            title="Inspect Task"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task)}
                            disabled={isSaving}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border transition-all shadow-sm ${
                              isSaving
                                ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                                : "border-rose-200 bg-rose-50/60 hover:bg-rose-600 hover:text-white text-rose-700"
                            }`}
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Custom Deletion & Moderation Modal */}
      {confirmOpen && taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">Delete Task: {taskToDelete.title}?</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                This action permanently deletes this project from the database, cancels any pending freelancer proposals, and refunds associated escrow funds if applicable.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200/50 transition-colors"
                disabled={savingIds.includes(taskToDelete.id)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm transition-colors"
                disabled={savingIds.includes(taskToDelete.id)}
              >
                {savingIds.includes(taskToDelete.id) ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirm Deletion</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
