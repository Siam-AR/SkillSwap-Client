"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  Receipt,
  Download,
  Search,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Inbox,
  User,
  X,
  FileText
} from "lucide-react";
import { getDashboardHeaders } from "@/lib/dashboard-client-proposals";

export default function ClientPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const headers = await getDashboardHeaders();
        const res = await fetch("/api/dashboard/client/payments", {
          headers: { ...headers },
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load payments");
        setPayments(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        setError(err?.message || "Unable to load payments");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  // Live Metrics
  const totalSpent = useMemo(() => {
    return payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  }, [payments]);

  const avgCost = useMemo(() => {
    return payments.length > 0 ? totalSpent / payments.length : 0;
  }, [payments, totalSpent]);

  // Search Filter
  const filteredPayments = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return payments;
    return payments.filter((p) => {
      const title = (p.task_title || "").toLowerCase();
      const freelancer = (p.freelancer_name || p.freelancer_email || "").toLowerCase();
      const tx = (p.transaction_id || "").toLowerCase();
      return title.includes(query) || freelancer.includes(query) || tx.includes(query);
    });
  }, [payments, searchQuery]);

  return (
    <div className="space-y-8">
      {/* 1. Modern Borderless Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            CLIENT WORKSPACE • BILLING & TRANSACTIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Payments & Invoices
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review completed transactions, download project receipts, and monitor platform expenses.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm" href="/dashboard/client/my-tasks">
            <span>View Active Tasks</span>
          </Link>
        </div>
      </div>

      {/* 2. Financial Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-[#009689]">
              <DollarSign className="w-5 h-5"/>
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">TOTAL EXPENDITURE</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">${totalSpent.toFixed(2)}</h3>
          <p className="text-xs text-slate-500 mt-1">Total cleared contractor fees</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <Receipt className="w-5 h-5"/>
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">PAID TRANSACTIONS</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{payments.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Settled milestones & tasks</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard className="w-5 h-5"/>
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">AVERAGE PROJECT COST</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">${avgCost.toFixed(2)}</h3>
          <p className="text-xs text-slate-500 mt-1">Average payout per task</p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          <input
            type="text"
            placeholder="Search by task, freelancer, or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white transition-all"
          />
        </div>

        <div className="text-xs font-medium text-slate-500 px-2">
          Showing <span className="font-bold text-slate-900">{filteredPayments.length}</span> recorded payments
        </div>
      </div>

      {/* 4. Payments Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-teal-500/30 border-t-[#009689] rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-semibold text-slate-600">Loading payment history...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-sm font-semibold text-rose-600 bg-rose-50 border-b border-rose-100">
            {error}
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#009689] flex items-center justify-center mb-4">
              <Inbox className="w-7 h-7"/>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No completed payments found</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              Once you accept and approve task deliverables, your settled transactions and downloadable receipts will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/60">
                  <th className="py-4 px-6">Task & Transaction ID</th>
                  <th className="py-4 px-6">Freelancer Recipient</th>
                  <th className="py-4 px-6">Date Cleared</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPayments.map((p) => {
                  const paymentDate = p.paid_at || p.createdAt;
                  return (
                    <tr key={p._id || p.transaction_id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Task & TX ID */}
                      <td className="py-4 px-6">
                        <h4 className="font-bold text-slate-900 line-clamp-1">
                          {p.task_title || "Direct Task Settlement"}
                        </h4>
                        <span className="font-mono text-[11px] font-medium text-slate-400 mt-0.5 block truncate max-w-xs">
                          {p.transaction_id || "TX-PENDING"}
                        </span>
                      </td>

                      {/* Freelancer Recipient */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-50 text-[#009689] font-bold text-xs flex items-center justify-center border border-teal-100">
                            {(p.freelancer_name || p.freelancer_email || "F").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-xs truncate">
                              {p.freelancer_name || "Verified Freelancer"}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                              {p.freelancer_email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date Cleared */}
                      <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400"/>
                          <span>
                            {paymentDate ? new Date(paymentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-[#009689] text-base">
                          ${Number(p.amount).toFixed(2)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Completed</span>
                        </span>
                      </td>

                      {/* Receipt Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-teal-50 hover:text-[#009689] hover:border-teal-200 text-slate-600 text-xs font-semibold transition-all shadow-sm"
                        >
                          <Receipt className="w-3.5 h-3.5"/>
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Clean Receipt Popover Modal */}
      {selectedReceipt ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-6 relative animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#009689] bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md uppercase">
                  Official Receipt
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">Transaction Summary</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Payment ID</span>
                <span className="font-mono font-medium text-slate-800 text-[11px] truncate max-w-[200px]">
                  {selectedReceipt.transaction_id || "TX-PENDING"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Task / Project</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[200px]">
                  {selectedReceipt.task_title || "Project Milestone"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Paid To</span>
                <span className="font-bold text-slate-800">{selectedReceipt.freelancer_name || selectedReceipt.freelancer_email}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Amount Settled</span>
                <span className="font-extrabold text-[#009689] text-base">${Number(selectedReceipt.amount).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4"/> Paid via Taskify
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5"/>
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
