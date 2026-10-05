"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  Eye,
  Check,
  X,
  Inbox,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { createProposalCheckout, fetchClientProposals, submitClientProposalAction } from "@/lib/dashboard-client-proposals";

export default function ClientProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [inspectProposal, setInspectProposal] = useState(null);
  const [actionModal, setActionModal] = useState(null); // { type: 'accept' | 'decline', proposal }
  const [isProcessing, setIsProcessing] = useState(false);

  const loadProposals = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetchClientProposals();
      setProposals(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err?.message || "Failed to load submitted proposals.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchClientProposals();
        if (!mounted) return;
        setProposals(Array.isArray(res) ? res : []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load submitted proposals.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Normalizing status mappings since DB might use 'rejected' instead of 'declined'
  const getNormalizedStatus = (statusStr) => {
    const s = (statusStr || "pending").toLowerCase();
    if (s === "rejected") return "declined";
    return s;
  };

  // Filter calculations
  const pendingCount = proposals.filter((p) => getNormalizedStatus(p.status) === "pending").length;
  const acceptedCount = proposals.filter((p) => getNormalizedStatus(p.status) === "accepted").length;
  const declinedCount = proposals.filter((p) => getNormalizedStatus(p.status) === "declined").length;

  const filteredProposals = proposals.filter((p) => {
    const status = getNormalizedStatus(p.status);
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "pending" && status === "pending") ||
      (selectedFilter === "accepted" && status === "accepted") ||
      (selectedFilter === "declined" && status === "declined");

    const query = searchQuery.toLowerCase();
    const taskTitle = p.taskTitle?.toLowerCase() || "";
    const freelancerName = p.freelancerName?.toLowerCase() || "";
    const freelancerEmail = p.freelancerEmail?.toLowerCase() || "";
    const matchesSearch = !query || taskTitle.includes(query) || freelancerName.includes(query) || freelancerEmail.includes(query);

    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (proposalId, nextStatusType) => {
    setIsProcessing(true);
    
    if (nextStatusType === "accept") {
      try {
        const result = await createProposalCheckout(proposalId);
        if (result?.url) {
          window.location.assign(result.url);
          return;
        }
        alert(result?.message || "Unable to start checkout.");
        setIsProcessing(false);
      } catch (err) {
        alert(err?.message || "Unable to start checkout.");
        setIsProcessing(false);
      }
      return;
    }

    // For decline/reject
    try {
      const result = await submitClientProposalAction(proposalId, "reject");
      if (result?.success) {
        await loadProposals();
        if (inspectProposal?._id === proposalId || inspectProposal?.id === proposalId) {
          setInspectProposal(null);
        }
        setActionModal(null);
      } else {
        alert(result?.message || "Action could not be completed.");
      }
    } catch (err) {
      alert(err?.message || "Action could not be completed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            CLIENT WORKSPACE • CANDIDATE BIDS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Task Proposals
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review incoming pitches from verified freelancers, inspect scopes, and award contracts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm" href="/dashboard/client/my-tasks">
            <span>View Posted Tasks</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-[#009689]">
              <FileText className="w-5 h-5"/>
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">ALL PROPOSALS</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{proposals.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Total bids received</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5"/>
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">NEEDS REVIEW</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{pendingCount}</h3>
          <p className="text-xs text-slate-500 mt-1">Awaiting client decision</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5"/>
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">ACCEPTED CONTRACTS</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{acceptedCount}</h3>
          <p className="text-xs text-slate-500 mt-1">Awarded & active tasks</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-5 h-5"/>
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">DECLINED</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{declinedCount}</h3>
          <p className="text-xs text-slate-500 mt-1">Not selected for projects</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
          {error}
        </div>
      ) : null}

      {/* 3. Filter Bar & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100/70 rounded-xl">
          {[
            { id: "all", label: "All Proposals", count: proposals.length },
            { id: "pending", label: "Pending Review", count: pendingCount },
            { id: "accepted", label: "Accepted", count: acceptedCount },
            { id: "declined", label: "Declined", count: declinedCount },
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
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  selectedFilter === tab.id ? "bg-slate-100 text-slate-700" : "bg-slate-200/70 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          <input
            type="text"
            placeholder="Search by task or freelancer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 4. Table / Content Surface */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-teal-500/30 border-t-[#009689] rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-semibold text-slate-600">Loading proposals...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-[#009689] flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8"/>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No proposals found</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              There are no proposals matching your current filter. Post new tasks or adjust your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-4 px-6 font-bold">Task & Category</th>
                  <th className="py-4 px-6 font-bold">Candidate Freelancer</th>
                  <th className="py-4 px-6 font-bold">Bid vs Budget</th>
                  <th className="py-4 px-6 font-bold">Turnaround</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProposals.map((proposal) => {
                  const status = getNormalizedStatus(proposal.status);

                  return (
                    <tr key={proposal._id || proposal.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Task details */}
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-bold text-slate-600 bg-teal-50 border border-teal-200/70 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {proposal.taskCategory || "General"}
                        </span>
                        <h4 className="font-bold text-slate-900 mt-1 line-clamp-1">
                          {proposal.taskTitle || "Untitled Task"}
                        </h4>
                      </td>

                      {/* Freelancer info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-teal-50 text-[#009689] font-bold text-xs flex items-center justify-center border border-teal-100">
                            {proposal.freelancerName?.charAt(0)?.toUpperCase() || "F"}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 flex items-center gap-1 text-xs truncate">
                              {proposal.freelancerName || "Freelancer"}
                            </span>
                            <p className="text-[11px] text-slate-400 truncate">{proposal.freelancerEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Bid vs Budget */}
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-[#009689]">${proposal.proposedBudget}</span>
                      </td>

                      {/* Estimated Turnaround */}
                      <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                        {proposal.estimatedDays ? `${proposal.estimatedDays} days` : "Not specified"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            status === "accepted"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                              : status === "declined"
                              ? "bg-rose-50 text-rose-700 border border-rose-200/80"
                              : "bg-amber-50 text-amber-700 border border-amber-200/80"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              status === "accepted"
                                ? "bg-emerald-500"
                                : status === "declined"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            }`}
                          />
                          <span className="capitalize">{status}</span>
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Inspect Button */}
                          <button
                            type="button"
                            onClick={() => setInspectProposal(proposal)}
                            title="Inspect Cover Letter"
                            className="p-2 rounded-xl text-slate-600 hover:text-[#009689] hover:bg-teal-50 border border-slate-200 transition-all"
                          >
                            <Eye className="w-4 h-4"/>
                          </button>

                          {/* Accept / Decline actions if pending */}
                          {status === "pending" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setActionModal({ type: "accept", proposal })}
                                title="Accept & Hire"
                                className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-all"
                              >
                                <Check className="w-4 h-4"/>
                              </button>
                              <button
                                type="button"
                                onClick={() => setActionModal({ type: "decline", proposal })}
                                title="Decline Bid"
                                className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-all"
                              >
                                <X className="w-4 h-4"/>
                              </button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Detailed Proposal Review Modal */}
      {inspectProposal ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-6 relative animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-600 bg-teal-50 border border-teal-200/70 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {inspectProposal.taskCategory || "General"}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {inspectProposal.taskTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectProposal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            {/* Candidate & Bid Meta */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Candidate</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {inspectProposal.freelancerName || "Freelancer"}
                </span>
                <span className="text-slate-500 text-[11px]">{inspectProposal.freelancerEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Proposed Terms</span>
                <span className="font-extrabold text-[#009689] text-base mt-0.5 block">
                  ${inspectProposal.proposedBudget}
                </span>
                <span className="text-slate-500 text-[11px]">
                  Turnaround: {inspectProposal.estimatedDays || "—"} days
                </span>
              </div>
            </div>

            {/* Cover Letter Body */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Cover Letter / Pitch
              </span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {inspectProposal.coverNote || "No additional proposal text submitted."}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex-1"></div>

              <div className="flex items-center gap-2">
                {getNormalizedStatus(inspectProposal.status) === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActionModal({ type: "decline", proposal: inspectProposal })}
                      className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionModal({ type: "accept", proposal: inspectProposal })}
                      className="px-4 py-2 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-xs font-bold transition-all shadow-sm"
                    >
                      Accept Proposal
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setInspectProposal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 6. Custom Confirmation Modal (Accept / Decline) */}
      {actionModal ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-4 animate-in zoom-in-95">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                actionModal.type === "accept"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              }`}
            >
              {actionModal.type === "accept" ? (
                <CheckCircle2 className="w-6 h-6"/>
              ) : (
                <AlertTriangle className="w-6 h-6"/>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {actionModal.type === "accept" ? "Fund Escrow & Award Contract?" : "Decline proposal?"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {actionModal.type === "accept"
                  ? `You are about to award the contract for "${actionModal.proposal.taskTitle}" to ${actionModal.proposal.freelancerName} for $${actionModal.proposal.proposedBudget}. You will deposit the funds into platform escrow. The money will NOT be released to the freelancer until you review and approve the completed work.`
                  : `Are you sure you want to decline the proposal from ${actionModal.proposal.freelancerName}? This action notifies the candidate and rejects the bid.`}
              </p>
              
              {actionModal.type === "accept" && (
                <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 mt-3">
                  <Lock className="w-4 h-4 text-[#009689] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 font-medium">
                    <strong className="text-slate-800">100% Milestone Protection:</strong> Funds remain safely in escrow until you inspect and accept the final deliverable.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setActionModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleStatusChange(actionModal.proposal._id || actionModal.proposal.id, actionModal.type)}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center min-w-[140px] gap-2 ${
                  actionModal.type === "accept"
                    ? "bg-[#009689] hover:bg-[#238B81]"
                    : "bg-rose-600 hover:bg-rose-700"
                } disabled:opacity-50`}
              >
                {isProcessing ? (
                  "Processing..."
                ) : actionModal.type === "accept" ? (
                  "Fund Escrow & Start Task"
                ) : (
                  "Confirm Decline"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
