"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Briefcase, DollarSign, Clock, Activity, FileText, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminOverview() {
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const response = await apiFetch("/api/admin/overview", { method: "GET" });
        if (isMounted) {
          setOverview(response?.data || {});
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load admin stats");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* A. Borderless Modern SaaS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            ADMIN CONSOLE • SYSTEM OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Platform Health & Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor live platform activity, system revenue, registered users, and active escrows.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link 
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm" 
            href="/dashboard/admin/manage-users"
          >
            <Users className="w-4 h-4"/>
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* B. 4-Column Live Platform Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Users Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Total Users</span>
            <div className="bg-teal-50 text-[#009689] p-2.5 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {loading ? "..." : (overview.totalUsers || 0)}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">Freelancers & clients</p>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Total Tasks</span>
            <div className="bg-sky-50 text-sky-600 p-2.5 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {loading ? "..." : (overview.totalTasks || 0)}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">All projects submitted</p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Platform Revenue</span>
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {loading ? "..." : `$${(overview.totalRevenue || 0).toLocaleString()}`}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">Escrow settlements cleared</p>
          </div>
        </div>

        {/* Active Contracts Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-[#009689]/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Active Tasks</span>
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {loading ? "..." : (overview.activeTasks || 0)}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">Currently in progress</p>
          </div>
        </div>
      </div>

      {/* C. Split System Activity & Administrative Action Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        
        {/* 1. Recent Activity & Task Audits */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Recent Platform Activity</h2>
            </div>
            <Link href="/dashboard/admin/manage-tasks" className="text-sm font-semibold text-[#009689] hover:text-teal-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Audit Stream Loading</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Live task creation and escrow settlement events will populate here.
            </p>
          </div>
        </div>

        {/* 2. Quick Admin Controls & System Shortcuts */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-900">System Controls</h2>
          </div>

          <div className="space-y-3">
            <Link 
              href="/dashboard/admin/manage-users"
              className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
            >
              <div className="bg-slate-100 p-2.5 rounded-xl group-hover:bg-white transition-colors">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Review Platform Users</h3>
                <p className="text-xs text-slate-500 mt-0.5">Inspect, verify, or ban accounts</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/admin/manage-tasks"
              className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
            >
              <div className="bg-slate-100 p-2.5 rounded-xl group-hover:bg-white transition-colors">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Audit Tasks</h3>
                <p className="text-xs text-slate-500 mt-0.5">Resolve disputed deliverables</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/admin/transactions"
              className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
            >
              <div className="bg-slate-100 p-2.5 rounded-xl group-hover:bg-white transition-colors">
                <DollarSign className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Financial Ledger</h3>
                <p className="text-xs text-slate-500 mt-0.5">Inspect escrow balances & payouts</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
