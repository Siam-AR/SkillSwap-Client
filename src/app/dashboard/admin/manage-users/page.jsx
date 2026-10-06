"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, Briefcase, UserCheck, ShieldAlert, Search, RefreshCw, Lock, Unlock, Mail, AlertTriangle, X } from "lucide-react";
import { fetchAdminUsers, updateAdminUserBlockStatus } from "@/lib/api";
import { getSession } from "@/lib/auth-client";

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingIds, setSavingIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", type: "info" });
  
  // Filtering & Search
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAdminUsers();
      setUsers(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      const message = err?.message || "Unable to load users.";
      setError(message);
      setNotification({ open: true, message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const sessionResult = await getSession();
      const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;
      setCurrentUser(sessionUser);
    } catch (err) {
      console.warn("Unable to resolve current user session", err);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadCurrentUser();
      await loadUsers();
    };

    void initialize();
  }, []);

  const handleToggleBlock = async (user) => {
    if (currentUser?.id && currentUser.id === user.id) {
      const message = "You cannot change block status for your own account.";
      setError(message);
      setNotification({ open: true, message, type: "error" });
      return;
    }

    if (!user.isBlocked) {
      setUserToBlock(user);
      setBlockModalOpen(true);
      return;
    } else {
      await performToggle(user, false);
    }
  };

  const performToggle = async (user, nextBlocked) => {
    setSavingIds((current) => [...current, user.id]);
    setError(null);

    try {
      const response = await updateAdminUserBlockStatus(user.id, nextBlocked);
      const updated = response?.data;
      if (updated) {
        setUsers((current) => current.map((u) => (u.id === updated.id ? updated : u)));
        setNotification({
          open: true,
          message: `User ${updated.name || updated.email} has been ${updated.isBlocked ? "blocked" : "unblocked"}.`,
          type: updated.isBlocked ? "warning" : "success",
        });
      }
    } catch (err) {
      const message = err?.message || "Unable to update user status.";
      setError(message);
      setNotification({ open: true, message, type: "error" });
    } finally {
      setSavingIds((current) => current.filter((id) => id !== user.id));
      if (blockModalOpen) {
        setBlockModalOpen(false);
        setUserToBlock(null);
      }
    }
  };

  const totalUsers = users.length;
  const freelancerCount = users.filter((u) => u.role?.toLowerCase() === "freelancer").length;
  const clientCount = users.filter((u) => u.role?.toLowerCase() === "client").length;
  const blockedCount = users.filter((u) => u.isBlocked).length;

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (selectedTab !== "all") {
      if (selectedTab === "blocked") {
        filtered = filtered.filter(u => u.isBlocked);
      } else {
        filtered = filtered.filter(u => u.role?.toLowerCase() === selectedTab);
      }
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(query) || 
        u.email?.toLowerCase().includes(query) ||
        u.id?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [users, selectedTab, searchQuery]);

  const closeNotification = () => {
    setNotification((current) => ({ ...current, open: false }));
  };

  return (
    <div className="space-y-6">
      {notification.open ? (
        <div className={`fixed right-4 top-4 z-50 max-w-sm rounded-2xl border p-4 shadow-xl ${
          notification.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : notification.type === "warning"
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-rose-200 bg-rose-50 text-rose-800"
        }`}>
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium">{notification.message}</p>
            <button type="button" onClick={closeNotification} className="text-slate-500 hover:text-slate-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            ADMIN CONSOLE • USER DIRECTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Manage Platform Users
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Inspect user accounts, verify roles, and toggle access permissions across Taskify.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#009689] ${loading ? "animate-spin text-slate-500" : ""}`}/>
            <span>Refresh Directory</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-teal-50 text-[#009689] p-3 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Registered</p>
            <p className="text-xl font-bold text-slate-900">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-sky-50 text-sky-600 p-3 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Active Freelancers</p>
            <p className="text-xl font-bold text-slate-900">{freelancerCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Active Clients</p>
            <p className="text-xl font-bold text-slate-900">{clientCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-4">
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Blocked / Suspended</p>
            <p className="text-xl font-bold text-slate-900">{blockedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100/70 rounded-xl">
          {[
            { id: "all", label: "All Users", count: totalUsers },
            { id: "freelancer", label: "Freelancers", count: freelancerCount },
            { id: "client", label: "Clients", count: clientCount },
            { id: "blocked", label: "Blocked", count: blockedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                selectedTab === tab.id ? "bg-slate-100 text-slate-700" : "bg-slate-200/70 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm text-slate-800">
            <thead className="bg-slate-50/50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#009689] mb-3" />
                      <p className="font-medium">Loading user directory...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="font-medium">No users found.</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSaving = savingIds.includes(user.id);
                  const isSelf = currentUser?.id === user.id;
                  const roleLower = user.role?.toLowerCase() || "client";
                  
                  return (
                    <tr key={user.id} className="bg-white hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 border border-teal-100 text-sm font-bold text-[#009689]">
                            {user.name ? user.name.charAt(0).toUpperCase() : <Users className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.name || "Unknown User"}</p>
                            <p className="font-mono text-[11px] text-slate-400">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user.email || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          roleLower === "freelancer"
                            ? "bg-teal-50 text-teal-700 border-teal-200/60"
                            : roleLower === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200/60"
                            : "bg-sky-50 text-sky-700 border-sky-200/60"
                        }`}>
                          {user.role || "Client"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold border ${
                          user.isBlocked 
                            ? "bg-rose-50 text-rose-700 border-rose-200/80" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                        }`}>
                          {!user.isBlocked && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                          {user.isBlocked && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(user)}
                          disabled={isSaving || isSelf}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                            isSelf
                              ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                              : user.isBlocked
                              ? "border-emerald-200 bg-emerald-50/60 hover:bg-emerald-600 hover:text-white text-emerald-700"
                              : "border-rose-200 bg-rose-50/60 hover:bg-rose-600 hover:text-white text-rose-700"
                          } ${isSaving ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          {user.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          {isSaving ? "Saving..." : isSelf ? "Your Account" : user.isBlocked ? "Unblock" : "Block"}
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

      {blockModalOpen && userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Confirm Suspension</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to block <span className="font-bold text-slate-800">{userToBlock.name}</span> (<span className="text-slate-700 font-mono text-xs">{userToBlock.email}</span>)?
              </p>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                This will revoke access to their workspace, halt active bids, and freeze transactions until unblocked.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setBlockModalOpen(false);
                  setUserToBlock(null);
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200/50 transition-colors"
                disabled={savingIds.includes(userToBlock.id)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => performToggle(userToBlock, true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm transition-colors"
                disabled={savingIds.includes(userToBlock.id)}
              >
                {savingIds.includes(userToBlock.id) ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Suspending...</span>
                  </>
                ) : (
                  <span>Confirm Suspension</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
