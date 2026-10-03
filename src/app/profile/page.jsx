"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
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
  const { data: sessionData, isPending } = useSession();
  const user = sessionData?.user || null;
  const isAuthenticated = Boolean(user);
  const [isEditing, setIsEditing] = useState(false);

  const avatarLabel = user?.name || user?.email || "Account";
  const avatarInitials = getInitials(user?.name, user?.email);

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
        <Footer />
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
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/70">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
        
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
          
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative shrink-0">
                {user?.image ? (
                  <img src={user.image} alt={avatarLabel} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover p-1 border-2 border-[#009689] shadow-md bg-white z-10" />
                ) : (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 border-2 border-[#009689] shadow-md bg-white z-10 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#009689] to-[#2CA99F] flex items-center justify-center text-white font-bold text-3xl shadow-inner">
                      {avatarInitials}
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute -bottom-2 sm:-bottom-1 left-1/2 sm:left-auto sm:-right-2 -translate-x-1/2 sm:translate-x-0 z-20">
                  {user?.status === "busy" || user?.status === "unavailable" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-50 text-rose-700 border border-rose-200 shadow-sm whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      {user.status === "busy" ? "Busy" : "Unavailable"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Available
                    </span>
                  )}
                </div>
              </div>
              
              <div className="pt-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{avatarLabel}</h1>
                <p className="text-sm sm:text-base font-semibold text-[#009689] mt-0.5">
                  {user?.designation || user?.headline || (user?.role === "freelancer" ? "Full Stack Developer" : "Client Account")}
                </p>
              </div>
            </div>

            <div>
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-semibold shadow-md shadow-teal-900/15 transition-all"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-center sm:text-left">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Hourly Rate</p>
              <p className="text-base sm:text-lg font-bold text-slate-800">{user?.hourlyRate ? `$${user.hourlyRate}/hr` : "Negotiable"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Completed Tasks</p>
              <p className="text-base sm:text-lg font-bold text-slate-800">{user?.completedTasks || user?.finishedJobs || user?.completedOrders || 0} Orders</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Rating Score</p>
              <p className="text-base sm:text-lg font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1">
                <span className="text-amber-500">★</span> 
                {user?.rating ? Number(user.rating).toFixed(1) : "New"} 
                <span className="text-slate-400 font-medium text-sm">({user?.reviewsCount || user?.reviews?.length || 0})</span>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
              <p className="text-base sm:text-lg font-bold text-slate-800">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently"}
              </p>
            </div>
          </div>
        </div>

        {/* Two-Column Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (About & Bio) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <h2 className="text-lg font-bold text-slate-900">About Me</h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {user?.bio || <span className="italic text-slate-400">No bio added yet. Click edit profile to add your professional summary.</span>}
            </div>
          </div>

          {/* Right Column (Skills & Expertise) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <h2 className="text-lg font-bold text-slate-900">Skills & Stack</h2>
            <div className="flex flex-wrap gap-2">
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span key={index} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="italic text-slate-400 text-sm">No skills added yet.</span>
              )}
            </div>
          </div>

        </div>
        </>
        )}

      </section>
      <Footer />
    </main>
  );
}