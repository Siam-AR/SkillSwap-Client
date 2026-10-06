"use client";

import { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getDashboardHeaders } from "@/lib/dashboard-client-proposals";

export default function RateFreelancerModal({ task, onClose, onActionComplete }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const targetTaskId = task?._id || task?.id || task?.taskId;
  const freelancerName = task?.freelancerName || "Freelancer";

  const handleSubmit = async () => {
    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a valid rating (1-5 stars).");
      return;
    }

    setIsProcessing(true);
    try {
      const authHeaders = await getDashboardHeaders();
      const res = await fetch(`/api/tasks/${targetTaskId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        credentials: "include",
        body: JSON.stringify({ rating, feedback }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review.");
      }

      toast.success("Review submitted successfully!");
      if (onActionComplete) onActionComplete(task);
      onClose();
    } catch (error) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden flex flex-col animate-in zoom-in-95">
      <div className="flex items-start justify-between gap-4 shrink-0 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 line-clamp-1">
            Rate Your Experience with {freelancerName}
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Your feedback helps maintain a high-quality community.
          </p>
        </div>
        <button 
          onClick={onClose}
          disabled={isProcessing}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 py-6 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110 p-1"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    (hoverRating || rating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200 fill-slate-50"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-sm font-bold text-slate-600 mt-2">
            {rating} out of 5 Stars
          </span>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Optional Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={`Share your experience working with this freelancer...`}
            className="w-full min-h-[120px] p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all text-sm resize-y text-slate-800 placeholder:text-slate-400"
          ></textarea>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 mt-auto shrink-0">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold transition-colors disabled:opacity-50"
        >
          Skip
        </button>
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-teal-900/10"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Submit Review
        </button>
      </div>
    </div>
  );
}
