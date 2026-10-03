"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Eye, Calendar, FileSearch, Trash2, Filter, ExternalLink, FileText } from "lucide-react";
import { toast } from "react-toastify";
import ProposalDetailsModal from "./ProposalDetailsModal";
import WithdrawModal from "./WithdrawModal";

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
  });
};

const getInitials = (email) => {
  if (!email) return "C";
  return email.charAt(0).toUpperCase();
};

export default function ProposalsClientView({ initialProposals = [] }) {
  const [localProposals, setLocalProposals] = useState(initialProposals);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposalToWithdraw, setProposalToWithdraw] = useState(null);

  const stats = useMemo(() => {
    return localProposals.reduce(
      (acc, curr) => {
        acc.all++;
        if (curr.status === "pending") acc.pending++;
        else if (curr.status === "accepted") acc.accepted++;
        else if (curr.status === "rejected") acc.rejected++;
        return acc;
      },
      { all: 0, pending: 0, accepted: 0, rejected: 0 }
    );
  }, [localProposals]);

  const filteredProposals = useMemo(() => {
    return localProposals.filter((proposal) => {
      const matchesSearch = 
        (proposal.taskTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proposal.clientEmail || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [localProposals, searchQuery, statusFilter]);

  const handleConfirmWithdraw = async (proposalId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setLocalProposals((current) => current.filter(p => p.id !== proposalId));
    setProposalToWithdraw(null);
    toast.success("Proposal successfully withdrawn.", { icon: "✅" });
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Summary Stats Strip */}
      <div>
        <div className="mb-6">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            FREELANCER WORKSPACE <span className="mx-1">•</span> PROPOSALS
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Submitted Proposals
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Manage, track, and review all your custom bids and client communications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setStatusFilter("all")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${statusFilter === "all" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            All Proposals
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusFilter === "all" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-500"}`}>{stats.all}</span>
          </button>
          
          <button 
            onClick={() => setStatusFilter("pending")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${statusFilter === "pending" ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Pending Review
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusFilter === "pending" ? "bg-amber-200 text-amber-800" : "bg-slate-100 text-slate-500"}`}>{stats.pending}</span>
          </button>

          <button 
            onClick={() => setStatusFilter("accepted")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${statusFilter === "accepted" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Accepted
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusFilter === "accepted" ? "bg-emerald-200 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>{stats.accepted}</span>
          </button>

          <button 
            onClick={() => setStatusFilter("rejected")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${statusFilter === "rejected" ? "bg-rose-50 border border-rose-200 text-rose-700" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Declined
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusFilter === "rejected" ? "bg-rose-200 text-rose-800" : "bg-slate-100 text-slate-500"}`}>{stats.rejected}</span>
          </button>
        </div>
      </div>

      {/* 2. Search, Filter, and Action Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tasks or clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#009689]/20 focus:border-[#009689] transition-all"
            />
          </div>
          
          <div className="relative w-full sm:w-48 shrink-0">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#009689]/20 focus:border-[#009689] appearance-none transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            {/* Custom chevron for select */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <Link 
          href="/browse-tasks" 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-semibold shadow-sm shadow-teal-900/15 transition-all shrink-0"
        >
          Browse Open Tasks
        </Link>
      </div>

      {/* 3. Elevated Modern Proposals Table */}
      {filteredProposals.length > 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Task Details</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Client Info</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Bid vs Budget</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date Sent</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 min-w-[280px]">
                      <div className="flex flex-col">
                        <Link href={proposal.taskId ? `/task/${proposal.taskId}` : "#"} className="font-bold text-slate-900 hover:text-[#009689] transition-colors truncate block max-w-[280px]">
                          {proposal.taskTitle}
                        </Link>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="inline-flex px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-[10px] font-semibold text-slate-600">
                            {proposal.taskCategory}
                          </span>
                          <span className="text-xs text-slate-500 truncate max-w-[150px]">
                            {proposal.coverLetter ? `"${proposal.coverLetter}"` : "No cover letter provided."}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-100 to-emerald-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-xs shrink-0">
                          {getInitials(proposal.clientEmail)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 truncate max-w-[120px]">{proposal.clientEmail || "Unknown Client"}</span>
                          <span className="text-[10px] text-slate-400">Verified Client</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#009689]">{formatCurrency(proposal.proposedBudget)}</span>
                        <span className="text-[10px] text-slate-500 font-medium mt-0.5">Budget: {formatCurrency(proposal.taskBudget)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm font-medium">{formatDate(proposal.submittedAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {proposal.status === "accepted" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Accepted
                        </span>
                      ) : proposal.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedProposal(proposal)}
                          className="p-2 rounded-xl text-[#009689] bg-teal-50 hover:bg-[#009689] hover:text-white transition-all duration-200 border border-teal-200/60"
                          title="View Proposal Details"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {proposal.taskId ? (
                          <Link 
                            href={`/task/${proposal.taskId}`}
                            target="_blank"
                            className="p-2 rounded-xl text-slate-500 bg-slate-50 hover:bg-slate-200 hover:text-slate-800 transition-all border border-slate-200"
                            title="Open Original Task"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        ) : (
                          <span 
                            className="p-2 rounded-xl text-slate-300 bg-slate-50 border border-slate-100 cursor-not-allowed"
                            title="Task Unavailable"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </span>
                        )}
                        {proposal.status === "pending" && (
                          <button 
                            onClick={() => setProposalToWithdraw(proposal)}
                            className="p-2 rounded-xl text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                            title="Withdraw Proposal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredProposals.map((proposal) => (
              <div key={proposal.id} className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      {proposal.status === "accepted" ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Accepted</span>
                      ) : proposal.status === "rejected" ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">Rejected</span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">Pending</span>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(proposal.submittedAt)}
                      </span>
                    </div>
                    <Link href={proposal.taskId ? `/task/${proposal.taskId}` : "#"} className="font-bold text-slate-900 text-base leading-snug hover:text-[#009689]">
                      {proposal.taskTitle}
                    </Link>
                    <span className="inline-flex w-fit mt-2 px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-[10px] font-semibold text-slate-600">
                      {proposal.taskCategory}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-y border-slate-100 border-dashed">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Client</span>
                    <span className="text-sm font-semibold text-slate-800 truncate max-w-[120px]">{proposal.clientEmail || "Unknown"}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bid / Budget</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-[#009689]">{formatCurrency(proposal.proposedBudget)}</span>
                      <span className="text-xs text-slate-400">/ {formatCurrency(proposal.taskBudget)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setSelectedProposal(proposal)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 text-[#009689] text-sm font-semibold hover:bg-[#009689] hover:text-white transition-colors border border-teal-200/60"
                  >
                    <FileText className="w-4 h-4" /> View Details
                  </button>
                  {proposal.taskId ? (
                    <Link 
                      href={`/task/${proposal.taskId}`}
                      target="_blank"
                      className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                      title="Open Original Task"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span 
                      className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                      title="Task Unavailable"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  )}
                  {proposal.status === "pending" && (
                    <button 
                      onClick={() => setProposalToWithdraw(proposal)}
                      className="inline-flex items-center justify-center p-2.5 rounded-xl border border-rose-100 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white transition-colors"
                      title="Withdraw Proposal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 4. Empty State Fallback */
        <div className="bg-white border border-slate-200/90 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm h-64">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
            <FileSearch className="w-8 h-8 text-[#009689]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No proposals found</h2>
          <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
            {searchQuery || statusFilter !== "all" 
              ? "We couldn't find any proposals matching your current filters. Try adjusting your search criteria." 
              : "You haven't submitted any proposals yet. Explore open tasks to find your next project."}
          </p>
          {(searchQuery || statusFilter !== "all") ? (
            <button 
              onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all"
            >
              Clear Filters
            </button>
          ) : (
            <Link 
              href="/browse-tasks" 
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-semibold shadow-sm shadow-teal-900/15 transition-all"
            >
              Browse Open Tasks
            </Link>
          )}
        </div>
      )}

      {selectedProposal && (
        <ProposalDetailsModal 
          proposal={selectedProposal} 
          onClose={() => setSelectedProposal(null)} 
        />
      )}

      {proposalToWithdraw && (
        <WithdrawModal
          proposal={proposalToWithdraw}
          onClose={() => setProposalToWithdraw(null)}
          onConfirm={handleConfirmWithdraw}
        />
      )}
    </div>
  );
}
