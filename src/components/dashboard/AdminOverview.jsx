"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Briefcase, DollarSign, Clock, TrendingUp, PieChart as PieIcon } from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const defaultRevenueData = [
  { month: "May", revenue: 420, tasks: 6 },
  { month: "Jun", revenue: 680, tasks: 11 },
  { month: "Jul", revenue: 950, tasks: 15 },
  { month: "Aug", revenue: 1420, tasks: 22 },
  { month: "Sep", revenue: 1890, tasks: 31 },
  { month: "Oct", revenue: 2378, tasks: 49 },
];

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

  const taskDistribution = [
    { name: "Active / In Progress", value: overview?.activeTasks || 39, color: "#009689" },
    { name: "Open for Bids", value: Math.max(0, (overview?.totalTasks || 49) - (overview?.activeTasks || 39) - 4), color: "#0ea5e9" },
    { name: "Completed", value: 4, color: "#10b981" },
  ];

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

      {/* C. Interactive Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        
        {/* 1. Revenue & Task Growth Curve (Span 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 text-[#009689]">
                  <TrendingUp className="w-4 h-4"/>
                </div>
                <h3 className="text-base font-bold text-slate-900">Platform Revenue Trajectory</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Monthly escrow settlement volume and contract progression
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              +24.8% MoM
            </span>
          </div>

          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={defaultRevenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009689" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#009689" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                        <p className="font-bold text-slate-800">{label} 2026</p>
                        <p className="text-[#009689] font-bold">Revenue: ${payload[0].value}</p>
                        <p className="text-slate-500">Tasks: {payload[0].payload.tasks}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Area type="monotone" dataKey="revenue" stroke="#009689" strokeWidth={3} fillOpacity={1} fill="url(#revenueTeal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Task Pipeline Distribution (Span 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <PieIcon className="w-4 h-4"/>
            </div>
            <h3 className="text-base font-bold text-slate-900">Task Pipeline Status</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Distribution across live contract states
          </p>

          <div className="h-64 w-full min-w-0 flex items-center justify-center">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie data={taskDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4}>
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-md text-xs">
                        <span className="font-bold text-slate-800">{payload[0].name}: </span>
                        <span className="font-extrabold text-[#009689]">{payload[0].value}</span>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(val) => <span className="text-xs text-slate-600 font-medium">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
