"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, CheckCircle2, Clock, Search, FolderKanban, 
  Sparkles, ExternalLink, MessageSquare, Link as LinkIcon, 
  Github, Code, Loader2, FileText 
} from "lucide-react";
import { getSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return Number.isNaN(amount) ? "$0.00" : `$${amount.toFixed(2)}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") return "Completed";
  if (normalized === "in progress") return "In Progress";
  if (normalized === "in review" || normalized === "under review") return "Under Review";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export default function FreelancerActiveProjectsPanel({ initialProjects = [], freelancerEmail = "" }) {
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal State
  const [selectedProject, setSelectedProject] = useState(null);
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats
  const stats = useMemo(() => {
    return projects.reduce((acc, curr) => {
      const status = String(curr.taskStatus || "").toLowerCase();
      if (status === "in progress") acc.inProgress++;
      else if (status === "completed") acc.completed++;
      else if (status === "in review" || status === "under review") acc.underReview++;
      return acc;
    }, { inProgress: 0, completed: 0, underReview: 0 });
  }, [projects]);

  // Filter logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchMatch = 
        (project.taskTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.clientEmail || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const statusMatch = statusFilter === "all" || String(project.taskStatus || "").toLowerCase() === statusFilter;
      
      return searchMatch && statusMatch;
    });
  }, [projects, searchQuery, statusFilter]);

  const closeModal = () => {
    setSelectedProject(null);
    setDeliverableUrl("");
    setDeliveryNotes("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedProject) return;

    const trimmedUrl = deliverableUrl.trim();
    if (!trimmedUrl) {
      toast.error("Please enter a live preview or source code link.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      toast.error("Please provide a valid http or https URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionResult = await getSession();
      const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;

      const res = await fetch("/api/dashboard/freelancer/active-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": sessionUser?.email || freelancerEmail || "",
          "X-User-Role": sessionUser?.role || "Freelancer",
        },
        credentials: "include",
        body: JSON.stringify({
          taskId: selectedProject.taskId,
          deliverableUrl: trimmedUrl,
          deliveryNotes: deliveryNotes.trim()
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "Unable to submit the deliverable.");
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.taskId === selectedProject.taskId
            ? { ...project, taskStatus: "under review", deliverableUrl: trimmedUrl }
            : project
        )
      );

      toast.success("Deliverable submitted! Awaiting client review.");
      closeModal();
    } catch (error) {
      toast.error(error?.message || "Unable to submit the deliverable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "completed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Funds Released
        </span>
      );
    }
    if (s === "in review" || s === "under review") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Clock className="w-3.5 h-3.5" /> Deliverable Sent - Awaiting Review
        </span>
      );
    }
    if (s === "revision requested") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <MessageSquare className="w-3.5 h-3.5" /> Client Requested Updates
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
        <Briefcase className="w-3.5 h-3.5" /> Working on Milestones
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-teal-100 bg-teal-50/50 p-5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#009689] flex items-center justify-center shrink-0 border border-teal-200/50">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-900">{stats.inProgress}</span>
              <span className="text-sm font-medium text-slate-600">Active Contracts</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/50">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-900">{stats.completed}</span>
              <span className="text-sm font-medium text-slate-600">Delivered & Closed</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-5 relative overflow-hidden group hidden md:block">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200/50">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-900">{stats.underReview}</span>
              <span className="text-sm font-medium text-slate-600">Pending Client Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search, Status Filter & Action Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full md:w-auto overflow-x-auto hide-scrollbar">
          {["all", "in progress", "under review", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === tab 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all"
            />
          </div>
          <Link 
            href="/browse-tasks"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-semibold shadow-sm shadow-teal-900/10 transition-all shrink-0"
          >
            Find More Work
          </Link>
        </div>
      </div>

      {/* 3. Projects List or Empty State */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div key={project.id || project.taskId} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-5 lg:items-start justify-between">
                
                {/* Project Info */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3 justify-between sm:justify-start">
                    <div className="space-y-1">
                      <Link href={`/task/${project.taskId}`} className="text-xl font-bold text-slate-900 hover:text-[#009689] transition-colors line-clamp-2">
                        {project.taskTitle || "Project Title"}
                      </Link>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                          {project.taskCategory || "General"}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {(project.clientName || project.clientEmail || "C").charAt(0).toUpperCase()}
                          </div>
                          <span>{project.clientName || project.clientEmail || "Client"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Contract Value:</span>
                      <span className="font-bold text-[#009689] text-base">{formatCurrency(project.proposedBudget)}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200 hidden sm:block"></div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Updated: {formatDate(project.completedAt || project.submittedAt)}</span>
                    </div>
                  </div>

                  <div>
                    {getStatusBadge(project.taskStatus)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  {String(project.taskStatus || "").toLowerCase() === "in progress" || String(project.taskStatus || "").toLowerCase() === "revision requested" ? (
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setDeliverableUrl(project.deliverableUrl || "");
                        setDeliveryNotes("");
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all"
                    >
                      <Sparkles className="w-4 h-4" /> Submit Deliverable
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setDeliverableUrl(project.deliverableUrl || "");
                        setDeliveryNotes("Previous delivery notes not available.");
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm font-semibold transition-all"
                    >
                      <FileText className="w-4 h-4" /> View Submission
                    </button>
                  )}
                  
                  <Link 
                    href={`/task/${project.taskId}`}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-semibold transition-all"
                  >
                    View Original Task <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-5 relative">
            <div className="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-50"></div>
            <FolderKanban className="w-10 h-10 text-[#009689] relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No active projects right now</h2>
          <p className="max-w-md text-slate-500 mb-8">
            You don't have any ongoing contracts in this category. Send proposals to open tasks to land your next paid project.
          </p>
          <Link 
            href="/browse-tasks"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white font-semibold shadow-lg shadow-teal-900/20 transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" /> Explore Open Tasks
          </Link>
        </div>
      )}

      {/* 4. Interactive "Submit Deliverable" Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={!isSubmitting ? closeModal : undefined}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-xl w-full p-6 sm:p-7 relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 shrink-0 pb-5 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#009689]">
                  {String(selectedProject.taskStatus || "").toLowerCase() === "in progress" ? "Submit Deliverable" : "Submission Details"}
                </p>
                <h2 className="text-xl font-bold text-slate-900 mt-1 line-clamp-1">
                  {selectedProject.taskTitle}
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Contract Value: <span className="text-slate-800 font-bold">{formatCurrency(selectedProject.proposedBudget)}</span></p>
              </div>
              <button 
                onClick={closeModal}
                disabled={isSubmitting}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 disabled:opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-5 pb-2 -mr-2 pr-2 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Live Preview / Demo URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      required
                      readOnly={String(selectedProject.taskStatus || "").toLowerCase() !== "in progress"}
                      value={deliverableUrl}
                      onChange={(e) => setDeliverableUrl(e.target.value)}
                      placeholder="https://your-preview-link.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all read-only:bg-slate-50 read-only:text-slate-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">Provide a link to the deployed site, Figma file, Loom video, or Dropbox folder.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Source Code / Asset Link <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Code className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      readOnly={String(selectedProject.taskStatus || "").toLowerCase() !== "in progress"}
                      placeholder="https://github.com/..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all read-only:bg-slate-50 read-only:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Delivery Notes / Message to Client
                  </label>
                  <textarea
                    rows={4}
                    readOnly={String(selectedProject.taskStatus || "").toLowerCase() !== "in progress"}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Hello! I've completed the milestones. Here are the instructions to review the work..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all resize-none read-only:bg-slate-50 read-only:text-slate-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                {String(selectedProject.taskStatus || "").toLowerCase() === "in progress" && (
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Send to Client</>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
