"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import EditProfileForm from "./EditProfileForm";

function getInitials(name, email) {
  if (name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }
  if (email) return email.charAt(0).toUpperCase();
  return "U";
}

export default function ProfilePage() {
  const { data: sessionData, isPending: sessionPending } = useSession();
  const sessionUser = sessionData?.user || null;
  const isAuthenticated = Boolean(sessionUser);
  const [isEditing, setIsEditing] = useState(false);
  const [fullUser, setFullUser] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isAuthenticated && sessionUser?.email) {
      setIsFetching(true);
      fetch("/api/dashboard/freelancer/profile", {
        headers: { "X-User-Email": sessionUser.email }
      })
        .then(res => res.json())
        .then(payload => {
          if (payload.success) setFullUser(payload.data);
        })
        .catch(console.error)
        .finally(() => setIsFetching(false));
    }
  }, [isAuthenticated, sessionUser?.email, isEditing]);

  const user = fullUser || sessionUser || null;
  const normalizedRole = String(user?.role || "").toLowerCase();
  const isClient = normalizedRole === "client";
  const isAdmin = normalizedRole === "admin";
  const hideFreelancerFields = isClient || isAdmin;
  const router = useRouter();
  const isPending = sessionPending || (isAuthenticated && isFetching && !fullUser);

  const avatarLabel = user?.name || "Freelancer";
  const avatarInitials = getInitials(avatarLabel, user?.email);

  if (isPending) {
    return (
    <main className="min-h-screen bg-slate-50/70">
      <Navbar />
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-28 w-28 rounded-full bg-slate-200" />
              <div className="h-8 w-56 rounded bg-slate-200" />
              <div className="h-4 w-72 rounded bg-slate-200" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
    <main className="min-h-screen bg-slate-50/70">
      <Navbar />
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-950">Sign in to view your profile</h1>
            <p className="mt-3 text-slate-600">Your account details will appear here once you sign in.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/auth/signin" className="rounded-xl bg-[#009689] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#238B81]">
                Sign in
              </Link>
              <Link href="/auth/signup" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Create account
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50/70">
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-6">
        
        {/* Back Button */}
        <div>
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#009689] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
        </div>

        {isEditing ? (
          <EditProfileForm 
            initialUser={user} 
            onCancel={() => setIsEditing(false)} 
            onSuccess={() => setIsEditing(false)} 
          />
        ) : (
          <>
            {/* Profile Hero Banner */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          {/* Ambient Header Accent */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none" />
          
          <div className={`relative flex ${isAdmin ? 'flex-col items-center justify-center' : 'flex-col sm:flex-row items-center sm:items-start justify-between'} gap-6`}>
            <div className={`flex ${isAdmin ? 'flex-col items-center text-center' : 'flex-col sm:flex-row items-center sm:items-start text-center sm:text-left'} gap-5`}>
              <div className="relative shrink-0">
                {user?.image || user?.avatar ? (
                  <img src={user?.image || user?.avatar} alt={avatarLabel} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover p-1 border-2 border-[#009689] shadow-md bg-white z-10" />
                ) : (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 border-2 border-[#009689] shadow-md bg-white z-10 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#009689] to-[#2CA99F] flex items-center justify-center text-white font-bold text-3xl shadow-inner">
                      {avatarInitials}
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                {isAdmin ? (
                  <div className="absolute -bottom-2 sm:-bottom-1 left-1/2 -translate-x-1/2 z-20">
                    {/* <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-purple-50 text-purple-700 border border-purple-200 shadow-sm whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      Platform Administrator
                    </span> */}
                  </div>
                ) : !isClient ? (
                  <div className="absolute -bottom-2 sm:-bottom-1 left-1/2 sm:left-auto sm:-right-2 -translate-x-1/2 sm:translate-x-0 z-20">
                    {(() => {
                      const status = user?.status || user?.availabilityStatus || "available";
                      if (status === "busy") {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200 shadow-sm whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Busy
                          </span>
                        );
                      }
                      if (status === "unavailable") {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-50 text-rose-700 border border-rose-200 shadow-sm whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Unavailable
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Available
                        </span>
                      );
                    })()}
                  </div>
                ) : null}
              </div>
              
              <div className="pt-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{avatarLabel}</h1>
                <p className="text-sm sm:text-base font-semibold text-[#009689] mt-0.5">
                  {user?.designation || (isAdmin ? "Platform Administrator" : user?.role === "freelancer" ? "Freelancer Account" : "Client Account")}
                </p>
              </div>
            </div>

            <div className={`flex flex-col ${isAdmin ? 'items-center mt-2' : 'items-end'} gap-3`}>
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-semibold shadow-md shadow-teal-900/15 transition-all"
              >
                Edit Profile
              </button>
            </div>
          </div>
          
          {isAdmin && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/admin/users" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 font-semibold text-sm">
                Manage Users
              </Link>
              <Link href="/admin/tasks" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 font-semibold text-sm">
                Moderate Tasks
              </Link>
              <Link href="/admin/analytics" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 font-semibold text-sm">
                View Analytics
              </Link>
            </div>
          )}

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-center sm:text-left">
            {isAdmin ? (
              <>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Platform Users</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{user?.totalPlatformUsers || 0} Users</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Active Tasks</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{user?.adminActiveTasksCount || 0} Listings</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Volume</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">${user?.totalPlatformVolume || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Access Level</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">Platform Superadmin</p>
                </div>
              </>
            ) : isClient ? (
              <>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tasks Posted</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{user?.postedTasksCount || 0} Tasks</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Active Tasks</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{user?.activeTasksCount || 0} Tasks</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Spent</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">${user?.totalSpent || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently Joined"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Hourly Rate</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{user?.hourlyRate ? `$${user.hourlyRate}/hr` : "Negotiable"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Completed Tasks</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{user?.completedTasks ? `${user.completedTasks} Orders` : "0 Orders"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Rating Score</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1">
                    {user?.rating ? `★ ${Number(user.rating).toFixed(1)} (${user.reviewsCount || 0})` : "★ New (0)"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently Joined"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Two-Column Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (About & Bio) */}
          <div className={`${hideFreelancerFields ? 'lg:col-span-12' : 'lg:col-span-7'} bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4 h-fit`}>
            <h2 className="text-lg font-bold text-slate-900">About Me</h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {user?.bio || <span className="italic text-slate-400">No bio added yet. Click edit profile to add your professional summary.</span>}
            </div>
          </div>

          {/* Right Column (Skills & Expertise) */}
          {!hideFreelancerFields && (
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
              <h2 className="text-lg font-bold text-slate-900">Skills & Stack</h2>
              <div className="flex flex-wrap gap-2 max-w-full">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="max-w-full truncate bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="italic text-slate-400 text-sm">No skills added yet.</span>
                )}
              </div>
            </div>
          )}

        </div>
        </>
        )}
      </section>
    </main>
  );
}