"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function WithdrawModal({ proposal, onClose, onConfirm }) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Handle click outside and Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isWithdrawing) onClose();
    };
    
    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, isWithdrawing]);

  if (!proposal) return null;

  const handleConfirm = async () => {
    setIsWithdrawing(true);
    await onConfirm(proposal.id);
    setIsWithdrawing(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={!isWithdrawing ? onClose : undefined}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-md w-full p-6 sm:p-7 relative overflow-hidden space-y-5 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-slate-900">Withdraw Proposal?</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Are you sure you want to withdraw your proposal for "{proposal.taskTitle || 'this task'}"? This action cannot be undone and your bid will be permanently removed.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center text-xs text-slate-600">
          <div className="flex flex-col truncate pr-4">
            <span className="font-semibold text-slate-900 truncate">Task</span>
            <span className="truncate">{proposal.taskTitle || "Unknown"}</span>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="font-semibold text-slate-900">Bid</span>
            <span className="font-bold text-rose-600">${proposal.proposedBudget}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isWithdrawing}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isWithdrawing}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm shadow-rose-900/15 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isWithdrawing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Withdrawing...
              </>
            ) : (
              "Withdraw Proposal"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
