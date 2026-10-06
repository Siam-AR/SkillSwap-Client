"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  CreditCard, Lock, CheckCircle2, TrendingUp, Search, RefreshCw,
  User, ReceiptText, Calendar
} from "lucide-react";
import { fetchAdminTransactions } from "@/lib/api";

function formatDate(value) {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const normalizeStatus = (status) => {
  const val = String(status || "unknown").toLowerCase();
  if (val.includes("complete")) return "completed";
  if (val.includes("escrow") || val.includes("pending")) return "escrow";
  if (val.includes("refund")) return "refunded";
  return "unknown";
};

export default function AdminTransactionsPage() {
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminTransactions({ limit: 50 });
      setTx(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Compute metrics
  const { totalVolume, escrowVolume, completedCount, platformFee } = useMemo(() => {
    let vol = 0;
    let esc = 0;
    let count = 0;

    tx.forEach(t => {
      const status = normalizeStatus(t.payment_status || t.status || t.paymentStatus);
      const amount = Number(t.amount ?? t.payout ?? 0);
      
      if (status === "completed") {
        vol += amount;
        count += 1;
      } else if (status === "escrow") {
        esc += amount;
      }
    });

    return {
      totalVolume: vol,
      escrowVolume: esc,
      completedCount: count,
      platformFee: vol * 0.10 // Assuming 10% fee
    };
  }, [tx]);

  // Filter Data
  const filteredTx = useMemo(() => {
    let data = tx;
    if (selectedTab !== "all") {
      data = data.filter(t => normalizeStatus(t.payment_status || t.status || t.paymentStatus) === selectedTab);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(t => {
        const clientEmail = (t.client_email || t.clientEmail || t.client || "").toLowerCase();
        const freelancerEmail = (t.freelancer_email || t.freelancerEmail || t.freelancer || "").toLowerCase();
        return clientEmail.includes(query) || freelancerEmail.includes(query);
      });
    }
    return data;
  }, [tx, selectedTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Modern Borderless Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            ADMIN CONSOLE • FINANCIAL LEDGER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Transactions & Escrow Settlements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audit platform payment releases, active escrow reserves, and contractor payouts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#009689] ${loading ? "animate-spin text-slate-500" : ""}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {/* 2. High-Level Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-teal-50 text-[#009689] p-3 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Volume Cleared</p>
            <p className="text-xl font-bold text-slate-900">${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Currently in Escrow</p>
            <p className="text-xl font-bold text-slate-900">${escrowVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Completed Payouts</p>
            <p className="text-xl font-bold text-slate-900">{completedCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-sky-50 text-sky-600 p-3 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Platform Fee Revenue</p>
            <p className="text-xl font-bold text-slate-900">${platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* 3. Integrated Filter Tabs & Live Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100/70 rounded-xl">
          {[
            { id: "all", label: "All Settlements" },
            { id: "completed", label: "Completed" },
            { id: "escrow", label: "Held in Escrow" },
            { id: "refunded", label: "Refunded" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          <input
            type="text"
            placeholder="Search by client or freelancer email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 4. Elevated Light Table Structure & Transaction Badges */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-slate-100 text-left text-sm text-slate-800">
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '8%' }} />
            </colgroup>
            <thead className="bg-slate-50/50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Client Email</th>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Freelancer Email</th>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Payout</th>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Payment Date</th>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#009689] mb-3" />
                      <p className="font-medium">Loading ledger...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTx.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <ReceiptText className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="font-medium">No transactions found.</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTx.map((t) => {
                  const status = normalizeStatus(t.payment_status || t.status || t.paymentStatus);
                  const amount = Number(t.amount ?? t.payout ?? 0);
                  const clientEmail = t.client_email || t.clientEmail || t.client || "-";
                  const freelancerEmail = t.freelancer_email || t.freelancerEmail || t.freelancer || "-";
                  
                  return (
                    <tr key={t._id || t.id || JSON.stringify(t)} className="bg-white hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3 text-slate-800 truncate font-medium text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-100 p-1 rounded-full text-slate-400">
                            <User className="w-3 h-3" />
                          </div>
                          <span className="truncate">{clientEmail}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600 truncate text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-100 p-1 rounded-full text-slate-400">
                            <User className="w-3 h-3" />
                          </div>
                          <span className="truncate">{freelancerEmail}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-black text-[#009689] text-sm">
                        ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(t.paid_at || t.paidAt || t.createdAt || t.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {status === "completed" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : status === "escrow" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/80">
                            <Lock className="w-3 h-3" />
                            Escrow
                          </span>
                        ) : status === "refunded" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/80">
                            Refunded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-50 text-slate-700 border border-slate-200/80">
                            Unknown
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-500 hover:text-slate-700 transition-all shadow-sm"
                          title="View Receipt"
                        >
                          <ReceiptText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
