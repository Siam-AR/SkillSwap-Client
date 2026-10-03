"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, DollarSign, Users, FileText, ShieldCheck, CheckCircle2 } from "lucide-react";
import TaskProposalForm from "@/components/TaskProposalForm";
import EditTaskForm from "@/components/dashboard/EditTaskForm";
import { useSession } from "@/lib/auth-client";

function formatDate(dateString) {
  if (!dateString) {
    return "Flexible";
  }
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadge(status) {
  const normalizedStatus = String(status || "open").trim().toLowerCase();

  if (normalizedStatus === "close" || normalizedStatus === "closed") {
    return {
      label: "Closed",
      classes: "bg-rose-50 text-rose-700 border-rose-200",
      showPulse: false,
    };
  }
  if (normalizedStatus === "in progress" || normalizedStatus === "in-progress" || normalizedStatus === "in_progress") {
    return {
      label: "In Progress",
      classes: "bg-amber-50 text-amber-700 border-amber-200",
      showPulse: false,
    };
  }
  if (normalizedStatus === "completed" || normalizedStatus === "complete") {
    return {
      label: "Completed",
      classes: "bg-sky-50 text-sky-700 border-sky-200",
      showPulse: false,
    };
  }

  return {
    label: "Open",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    showPulse: true,
  };
}

export default function TaskDetailsShell({ task }) {
  const { data: sessionData } = useSession();
  const userRole = String(sessionData?.user?.role || "").trim();
  const [taskState, setTaskState] = useState(task);
  const [editingTask, setEditingTask] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setTaskState(task);
  }, [task]);

  const isTaskOwner = String(sessionData?.user?.id || "") === String(taskState?.clientId || taskState?.client?._id || "");
  const canEditTask = isTaskOwner && String(taskState?.status || "").toLowerCase() === "open";
  const showProposalSidebar = !isTaskOwner;

  const clientName = taskState?.client?.name || taskState?.clientName || null;
  const clientEmail = taskState?.clientEmail || taskState?.client?.email || null;
  const clientDisplayName = clientName || clientEmail || "Verified Client";
  const clientInitial = String((clientName || clientDisplayName || "C").charAt(0)).toUpperCase();

  const statusInfo = getStatusBadge(taskState.status);
  const defaultPlaceholder = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80";
  const imageSrc = taskState.imageUrl || taskState.image || defaultPlaceholder;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <Link href="/browse-tasks" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#009689] font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tasks
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Task Core Details) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* A. Main Task Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-teal-50 text-[#009689] border border-teal-200 text-[11px] font-semibold px-3 py-1 rounded-lg uppercase tracking-wider">
                {taskState.category || "General"}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.classes}`}>
                {statusInfo.showPulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                {statusInfo.label}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-auto">
                Posted {new Date(taskState.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            {/* Task Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-5 mb-5">
              {taskState.title}
            </h1>

            {/* Image Banner */}
            <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-slate-100 my-6 border border-slate-100">
              <img 
                src={imageSrc} 
                alt={taskState.title} 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = defaultPlaceholder; }}
              />
            </div>

            {/* B. Quick Metric Cards Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="flex flex-col gap-1.5 bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <DollarSign className="w-4 h-4 text-[#009689]" /> Fixed Budget
                </div>
                <div className="text-xl font-bold text-[#009689]">
                  ${taskState.budget}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <Clock className="w-4 h-4 text-[#009689]" /> Due Date
                </div>
                <div className="text-slate-800 font-semibold text-sm sm:text-base">
                  {formatDate(taskState.deadline || taskState.dueDate)}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <Users className="w-4 h-4 text-[#009689]" /> Proposals
                </div>
                <div className="text-slate-800 font-semibold text-sm sm:text-base">
                  {taskState.proposalsCount || 0} Submitted
                </div>
              </div>
            </div>
          </div>

          {/* C. Detailed Description & Deliverables Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#009689]" /> Project Details
            </h3>
            <div className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {taskState.description}
            </div>
          </div>

          {/* About the Client Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
              About the Client
            </h3>

            <div className="flex items-center justify-between gap-3.5">
              <div className="flex items-center gap-3.5">
                {(taskState.client?.image || taskState.client?.avatar) && !imgError ? (
                  <img 
                    src={taskState.client.image || taskState.client.avatar} 
                    alt={taskState.client.name || "Client"} 
                    onError={() => setImgError(true)}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#009689]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-[#009689] font-bold text-lg flex items-center justify-center border border-teal-200 shrink-0">
                    {clientInitial}
                  </div>
                )}

                <div>
                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    {clientDisplayName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {clientEmail || "Verified Client"}
                  </p>
                </div>
              </div>
              
              <div className="text-right text-xs">
                <span className="text-slate-400 block font-medium">Member Since</span>
                <span className="font-semibold text-slate-700 mt-0.5 block">
                  {taskState.client?.createdAt ? new Date(taskState.client.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Recently Joined"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Proposal Submission Card) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-6">
          {isTaskOwner ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Manage Task</h3>
              <p className="text-sm text-slate-500 mb-6">You are the creator of this task.</p>
              
              <div className="space-y-3">
                {canEditTask && (
                  <button
                    type="button"
                    onClick={() => setEditingTask(taskState)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all duration-300"
                  >
                    Edit Task Details
                  </button>
                )}
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200 transition-all duration-300"
                >
                  View Proposals
                </Link>
              </div>
            </div>
          ) : (
            <TaskProposalForm taskId={taskState._id} taskBudget={taskState.budget} client={taskState.client} />
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTask ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-3xl overflow-auto rounded-[1.75rem] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#009689] mb-1">Edit Task</p>
                <h2 className="text-2xl font-semibold text-slate-900">Update your open task</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 border border-slate-200"
              >
                Close
              </button>
            </div>
            <EditTaskForm task={editingTask} onCancel={() => setEditingTask(null)} onUpdated={(updatedTask) => {
              setTaskState(updatedTask);
              setEditingTask(null);
            }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
