"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Clock, Send, Lock, CheckCircle2, DollarSign } from "lucide-react";

const DEFAULT_SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function apiFetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${DEFAULT_SERVER}${path}`;
  const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
  const res = await fetch(url, Object.assign({}, opts, { headers, credentials: "include" }));

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const error = new Error("Request failed");
    error.status = res.status;
    error.body = data;
    throw error;
  }

  return data;
}

export default function TaskProposalForm({ taskId, taskBudget, client }) {
  const { data: sessionData, isPending } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [imgError, setImgError] = useState(false);
  
  const [form, setForm] = useState({
    expectedAmount: taskBudget ? String(taskBudget) : "",
    estimatedDays: "",
    coverLetter: "",
  });

  const getAuthHeaders = () => {
    const currentUser = sessionData?.user || user;

    return {
      "X-User-Id": currentUser?.id || "",
      "X-User-Email": currentUser?.email || "",
      "X-User-Role": currentUser?.role || "",
    };
  };

  useEffect(() => {
    async function loadState() {
      try {
        if (!sessionData?.user) {
          setUser(null);
          setHasSubmitted(false);
          return;
        }

        const [authResponse, proposalResponse] = await Promise.all([
          apiFetch("/api/auth/me", { headers: getAuthHeaders() }),
          apiFetch(`/api/proposals/check/${encodeURIComponent(taskId)}`, { headers: getAuthHeaders() }),
        ]);

        setUser(authResponse?.user || sessionData.user || null);
        setHasSubmitted(Boolean(proposalResponse?.hasSubmitted));
      } catch (error) {
        setUser(sessionData?.user || null);
        setHasSubmitted(false);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending) {
      loadState();
    }
  }, [taskId, sessionData, isPending]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await apiFetch("/api/proposals", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          task_id: taskId,
          proposed_budget: Number(form.expectedAmount),
          estimated_days: Number(form.estimatedDays),
          cover_note: form.coverLetter,
        }),
      });

      if (response?.success) {
        setHasSubmitted(true);
        setFeedback({ type: "success", message: "Proposal submitted successfully." });
        setForm({ expectedAmount: "", estimatedDays: "", coverLetter: "" });
        router.refresh();
      }
    } catch (error) {
      const message = error?.body?.message || error?.message || "Failed to submit proposal.";
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || isPending) {
    return <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-500 text-center">Checking your access...</div>;
  }

  const normalizedRole = String(user?.role || sessionData?.user?.role || "").trim();

  if (!user || normalizedRole !== "Freelancer") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Submit a Proposal</h3>
        <p className="text-sm text-slate-500 mb-6">Pitch your turnaround time and bid to the client.</p>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600 text-center font-medium">
          Please sign in as a freelancer to submit a proposal.
        </div>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Submit a Proposal</h3>
        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center flex flex-col items-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
          <h4 className="font-semibold text-emerald-800 text-base">Proposal Submitted</h4>
          <p className="text-sm text-emerald-600 mt-1">Your proposal is already on the list for this task.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-lg shadow-slate-200/40">
      <h3 className="text-xl font-extrabold text-slate-900">Submit a Proposal</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">Pitch your turnaround time and bid to the client.</p>

      {/* Proposal Destination Header / Client Card */}
      <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100/90 flex items-center gap-3 my-5">
        {(client?.image || client?.avatar) && !imgError ? (
          <img 
            src={client.image || client.avatar} 
            alt={client.name || "Client"} 
            onError={() => setImgError(true)}
            className="w-10 h-10 rounded-full object-cover border border-[#009689]"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#009689] text-white font-bold text-sm flex items-center justify-center uppercase shrink-0">
            {client?.name?.charAt(0) || "C"}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
            Sending Proposal to
          </span>
          <h4 className="text-sm font-bold text-slate-900 truncate">
            <span className="underline decoration-[#009689] decoration-2 underline-offset-4">
              {client?.name || client?.email?.split('@')[0] || "Client"}
            </span>
          </h4>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Proposed Budget */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wide">Proposed Budget ($ USD)</label>
          <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-[#009689] transition-all overflow-hidden flex items-center">
            <div className="pl-3 text-slate-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <input
              name="expectedAmount"
              type="number"
              min="1"
              required
              placeholder={taskBudget ? String(taskBudget) : "e.g. 150"}
              value={form.expectedAmount}
              onChange={(event) => setForm((current) => ({ ...current, expectedAmount: event.target.value }))}
              className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Estimated Days */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wide">Estimated Turnaround (Days)</label>
          <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-[#009689] transition-all overflow-hidden flex items-center">
            <div className="pl-3 text-slate-400">
              <Clock className="w-4 h-4" />
            </div>
            <input
              name="estimatedDays"
              type="number"
              min="1"
              required
              placeholder="e.g. 3"
              value={form.estimatedDays}
              onChange={(event) => setForm((current) => ({ ...current, estimatedDays: event.target.value }))}
              className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wide">Cover Letter / Proposal Note</label>
          <textarea
            name="coverLetter"
            rows="4"
            required
            placeholder="Introduce yourself and outline your plan to complete this task quickly and accurately..."
            value={form.coverLetter}
            onChange={(event) => setForm((current) => ({ ...current, coverLetter: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all"
          />
        </div>

        {feedback ? (
          <div className={`rounded-xl p-3 text-sm font-medium ${feedback.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
            {feedback.message}
          </div>
        ) : null}

        <button 
          type="submit" 
          disabled={submitting} 
          className="w-full py-3.5 px-4 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white font-semibold text-sm shadow-md shadow-teal-900/15 hover:shadow-teal-900/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {submitting ? "Sending..." : "Send Proposal"}
          {!submitting && <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
