"use client";

import { useState } from "react";
import { X, ExternalLink, MessageSquare, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getDashboardHeaders } from "@/lib/dashboard-client-proposals";

export default function ReviewDeliverablesModal({ task, onClose, onActionComplete }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  const targetTaskId = task?._id || task?.id || task?.taskId;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const authHeaders = await getDashboardHeaders();
      const res = await fetch(`/api/tasks/${targetTaskId}/release-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        credentials: "include",
        body: JSON.stringify({ taskId: targetTaskId }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to release payment.");
      }

      toast.success("Payment Released! The task is now officially completed.");
      onActionComplete({ ...task, status: "completed" });
      onClose();
    } catch (error) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionNotes.trim()) {
      toast.error("Please provide revision instructions.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const authHeaders = await getDashboardHeaders();
      const res = await fetch(`/api/tasks/${targetTaskId}/request-revision`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...authHeaders 
        },
        credentials: "include",
        body: JSON.stringify({ taskId: targetTaskId, notes: revisionNotes }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to request revision.");
      }

      toast.success("Revision requested! Freelancer has been notified.");
      onActionComplete({ ...task, status: "revision_requested" });
      onClose();
    } catch (error) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
      <div className="flex items-start justify-between gap-4 shrink-0 pb-5 border-b border-slate-100">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Review Submission
          </p>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 line-clamp-1">
            {task.title}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Submitted on {new Date(task.submittedAt || Date.now()).toLocaleDateString()}</p>
        </div>
        <button 
          onClick={onClose}
          disabled={isProcessing}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">Submitted Deliverable Link</h3>
          <a 
            href={task.deliverableUrl || task.deliverable_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors break-all"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {task.deliverableUrl || task.deliverable_url || "No link provided"}
          </a>
        </div>

        {task.deliveryNotes && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Freelancer Notes</h3>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 leading-relaxed">
              {task.deliveryNotes}
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-800">Escrow Protection Active</h4>
            <p className="text-xs text-emerald-600/80 mt-1 font-medium leading-relaxed">
              Your funds are held securely in escrow. Only approve and release payment once you are 100% satisfied with the submitted work.
            </p>
          </div>
        </div>

        {showRevisionForm && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-sm font-bold text-slate-900 mb-2">
              What needs to be changed?
            </label>
            <textarea
              rows={3}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="Please provide specific instructions for the freelancer..."
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-5 border-t border-slate-100">
        {!showRevisionForm ? (
          <>
            <button 
              type="button" 
              onClick={() => setShowRevisionForm(true)}
              disabled={isProcessing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Request Revisions
            </button>
            <button 
              type="button" 
              onClick={handleApprove}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-bold shadow-sm transition-all disabled:opacity-70"
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Approve & Release Payment</>
              )}
            </button>
          </>
        ) : (
          <>
            <button 
              type="button" 
              onClick={() => setShowRevisionForm(false)}
              disabled={isProcessing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleRequestRevision}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-70"
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <><MessageSquare className="w-4 h-4" /> Send Revision Request</>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
