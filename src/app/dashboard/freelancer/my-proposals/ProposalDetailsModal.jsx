"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ExternalLink, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return Number.isNaN(amount) ? "$0.00" : `$${amount.toFixed(2)}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function ProposalDetailsModal({ proposal, onClose }) {
  // Handle click outside and Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!proposal) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-xl w-full p-6 sm:p-7 relative overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent bubbling to backdrop
      >
        {/* 1. Header Row */}
        <div className="flex items-start justify-between gap-4 shrink-0 pb-4">
          <div className="flex flex-col gap-2">
            <div>
              {proposal.status === "accepted" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                </span>
              ) : proposal.status === "rejected" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                  <XCircle className="w-3.5 h-3.5" /> Declined
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
                  <Clock className="w-3.5 h-3.5" /> Pending
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1 line-clamp-2">
              {proposal.taskTitle || "Task Title"}
            </h2>
            <div className="flex items-center gap-3">
              <span className="inline-flex px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-[10px] font-semibold text-slate-600">
                {proposal.taskCategory}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Submitted: {formatDate(proposal.submittedAt)}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-5">
          {/* 2. Bid & Client Quick Stats Bar */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Your Bid</span>
              <div className="flex flex-col">
                <span className="text-base font-bold text-[#009689]">{formatCurrency(proposal.proposedBudget)}</span>
                <span className="text-slate-500 font-medium">Task Budget: {formatCurrency(proposal.taskBudget)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Client Info</span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800 truncate">{proposal.clientEmail || "Unknown"}</span>
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified Client
                </span>
              </div>
            </div>
          </div>

          {/* 3. Full Cover Letter Body */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Proposal Cover Letter</span>
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {proposal.coverLetter || "No cover letter provided."}
            </div>
          </div>
        </div>

        {/* 4. Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-2 border-t border-slate-100 shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          {proposal.taskId ? (
            <Link 
              href={`/task/${proposal.taskId}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-semibold shadow-sm shadow-teal-900/15 transition-all"
            >
              Open Original Task <ExternalLink className="w-4 h-4" />
            </Link>
          ) : (
            <button 
              disabled
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-sm font-semibold cursor-not-allowed"
            >
              Task Unavailable <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
