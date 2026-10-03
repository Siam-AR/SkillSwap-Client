"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { 
  DollarSign, CheckCircle2, 
  Search, FileDown, Calendar, ReceiptText 
} from "lucide-react";

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

export default function EarningsClientView({ 
  initialEarnings = [], 
  totalEarnings = 0, 
  completedTasks = 0
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all-time");

  const filteredEarnings = useMemo(() => {
    return initialEarnings.filter((entry) => {
      const searchMatch = 
        (entry.taskTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.clientName || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const statusMatch = statusFilter === "all" || "completed" === statusFilter; // Since all returned are currently completed
      
      let timeMatch = true;
      if (timeFilter !== "all-time" && entry.completedAt) {
        const date = new Date(entry.completedAt);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (timeFilter === "this-month") {
          timeMatch = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        } else if (timeFilter === "past-90") {
          timeMatch = diffDays <= 90;
        } else if (timeFilter === "this-year") {
          timeMatch = date.getFullYear() === now.getFullYear();
        }
      }
      
      return searchMatch && statusMatch && timeMatch;
    });
  }, [initialEarnings, searchQuery, statusFilter, timeFilter]);

  return (
    <div className="space-y-6">
      {/* 2. Live Financial Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-teal-200 transition-colors">
          <div className="flex items-start justify-between">
            <div className="bg-teal-50 text-[#009689] p-2.5 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalEarnings)}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-50 inline-block px-2 py-1 rounded-md">
              + Lifetime cleared payments
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
          <div className="flex items-start justify-between">
            <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Paid Contracts</p>
            <p className="text-2xl font-bold text-slate-900">{completedTasks} Orders</p>
            <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-50 inline-block px-2 py-1 rounded-md">
              100% completion rate
            </p>
          </div>
        </div>
      </div>

      {/* 3. Payouts History & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-[#009689] transition-all cursor-pointer"
          >
            <option value="all-time">All Time</option>
            <option value="this-month">This Month</option>
            <option value="past-90">Past 90 Days</option>
            <option value="this-year">This Year</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-[#009689] transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="completed">Paid</option>
            <option value="processing">Processing</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* 4. Elevated Modern Transaction History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Task / Milestone</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Client</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Reference</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Date Cleared</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Amount</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredEarnings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    {/* 5. Polished Empty State Fallback */}
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 border border-teal-100">
                        <ReceiptText className="w-8 h-8 text-[#009689]" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">No payment transactions recorded</h3>
                      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                        Once you submit approved deliverables on your active contracts, your earnings and payout invoices will appear here.
                      </p>
                      <Link 
                        href="/dashboard/freelancer/active-projects"
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all"
                      >
                        View Active Projects
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEarnings.map((entry) => (
                  <tr key={`${entry.paymentId}-${entry.taskId}`} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/task/${entry.taskId}`} className="font-bold text-slate-900 hover:text-[#009689] transition-colors line-clamp-1">
                        {entry.taskTitle}
                      </Link>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          Contract #{String(entry.taskId).substring(0, 6)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                          {(entry.clientName || "C").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 text-sm truncate max-w-[120px]">{entry.clientName}</span>
                          <span className="text-xs text-slate-400 truncate max-w-[120px]">{entry.clientEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
                        Taskify Escrow
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(entry.completedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 text-sm">
                      +{formatCurrency(entry.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
