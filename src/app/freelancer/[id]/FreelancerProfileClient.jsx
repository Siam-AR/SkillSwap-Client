"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Briefcase, 
  Mail, 
  MapPin, 
  DollarSign, 
  Star, 
  Calendar, 
  Info, 
  Check, 
  Award, 
  Copy, 
  ShieldCheck 
} from "lucide-react";

export default function FreelancerProfileClient({ freelancer }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (freelancer?.email || freelancer?._id || freelancer?.id) {
      const identifier = freelancer._id || freelancer.id;
      const email = freelancer.email;
      fetch(`/api/freelancers/${identifier}/reviews?email=${encodeURIComponent(email || "")}`)
        .then((res) => res.json())
        .then((payload) => {
          if (payload.success) {
            setReviews(payload.data);
          }
        })
        .catch(console.error);
    }
  }, [freelancer]);

  const handleCopyEmail = () => {
    if (freelancer?.email) {
      navigator.clipboard.writeText(freelancer.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const initial = (freelancer?.name || "F").charAt(0).toUpperCase();
  const displayRating = Number(freelancer?.rating || 0).toFixed(1);
  const completedJobs = freelancer?.finishedJobs || freelancer?.completedTasks || 0;
  
  const formattedDate = freelancer?.createdAt
    ? new Date(freelancer.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently Joined";

  const isBioEmptyOrPlaceholder = !freelancer?.bio || /^[\s./\\]+$/.test(freelancer.bio);

  const currentStatus = (freelancer?.status || freelancer?.availabilityStatus || "available").toLowerCase();
  
  const statusMap = {
    available: {
      label: "Available for work",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      dotClass: "bg-emerald-500",
      pulse: true,
    },
    busy: {
      label: "Busy on active projects",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
      dotClass: "bg-amber-500",
      pulse: false,
    },
    unavailable: {
      label: "Unavailable for work",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
      dotClass: "bg-rose-500",
      pulse: false,
    },
  };

  const statusConfig = statusMap[currentStatus] || statusMap.available;


  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50/70 text-slate-800 pb-16">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#009689] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>

        {/* Unified Single-Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Identity & Competency Section */}
          <div className="flex items-start sm:items-center gap-5 sm:gap-6">
            {/* Avatar */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0 bg-slate-50">
              {(freelancer?.image || freelancer?.avatar) && !imgError ? (
                <img
                  src={freelancer.image || freelancer.avatar}
                  alt={freelancer.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full rounded-2xl object-cover bg-white"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-teal-50 text-[#009689] flex items-center justify-center text-3xl font-extrabold">
                  {initial}
                </div>
              )}
              {/* Active status indicator ring */}
              <div 
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-4 ring-white ${statusConfig.dotClass}`} 
                title={statusConfig.label}
              ></div>
            </div>

            {/* Freelancer Name, Badges & Headline */}
            <div className="flex flex-col gap-1.5">
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {freelancer?.name || "Freelancer"}
                </h1>
                
                {/* Dynamic Status Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${statusConfig.badgeClass}`}>
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass} ${statusConfig.pulse ? "animate-pulse" : ""}`} />
                  <span>{statusConfig.label}</span>
                </div>
              </div>
              
              {/* Middle Row (Professional Title) */}
              {(() => {
                const displayTitle = freelancer?.title || freelancer?.profession || freelancer?.headline || "";
                if (displayTitle && displayTitle !== "Available for freelance work") {
                  return (
                    <p className="text-sm sm:text-base font-semibold text-[#009689]">
                      {displayTitle}
                    </p>
                  );
                }
                return null;
              })()}

              {/* Bottom Row (Quick Trust Tags) */}
              <div className="flex flex-wrap items-center gap-4 mt-1">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {freelancer?.location || "Remote"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {displayRating} ({freelancer?.reviewCount || 0} Reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right Action & Quick Stat Cluster */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0 mt-2 sm:mt-0">
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-semibold shadow-sm shadow-teal-900/15 flex items-center justify-center gap-2 transition-all"
            >
              <Briefcase className="w-4 h-4" /> Invite to Task
            </button>
            <button className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-all">
              <Mail className="w-4 h-4" /> Message
            </button>
          </div>
        </div>

        {/* Split Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Left Main Column (Span 8) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-8 shadow-sm space-y-8">
              
              {/* About Me Section */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                  About the Freelancer
                </h3>
                {isBioEmptyOrPlaceholder ? (
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-100 p-5 text-sm text-slate-500 italic flex items-start gap-3">
                    <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5"/>
                    <span>This freelancer hasn't written a public bio yet, but is available for new contracts and task invitations.</span>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {freelancer.bio}
                  </p>
                )}
              </section>

              {/* Skills & Specializations */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2 max-w-full">
                  {freelancer?.skills && freelancer.skills.length > 0 ? (
                    freelancer.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="max-w-full truncate inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs font-bold text-[#009689] hover:bg-[#009689] hover:text-white transition-all duration-200 cursor-default"
                      >
                        {/* <Check className="w-3 h-3" /> */}
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs font-bold text-[#009689] hover:bg-[#009689] hover:text-white transition-all duration-200 cursor-default">
                      <Check className="w-3 h-3" />
                      General Freelance Services
                    </span>
                  )}
                </div>
              </section>

              {/* Completed Work / Reviews */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                  Client Feedback & Project History
                </h3>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${star <= (review.rating || 5) ? "fill-current text-amber-500" : "text-slate-200"}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium">"{review.comment}"</p>
                        <p className="text-xs text-slate-500 font-medium">{review.clientName} ({review.clientEmail})</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 p-8 text-center space-y-2">
                    <Award className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-900">Ready for their first client review</p>
                    <p className="text-sm text-slate-500">Be the first client to collaborate with this talent and leave a verified project review.</p>
                  </div>
                )}
              </section>
              
            </div>
          </div>

          {/* Right Sticky Metadata Column (Span 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6 lg:sticky lg:top-24 h-fit">
              <h3 className="text-sm font-bold text-slate-900">
                Freelancer Details
              </h3>
              
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Hourly Rate
                </span>
                <span className="text-2xl font-extrabold text-[#009689]">
                  {freelancer?.hourlyRate ? `$${freelancer.hourlyRate}` : "$25"}<span className="text-sm font-semibold">/hr</span>
                </span>
              </div>
              
              <div className="space-y-4 pt-1">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Location</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {freelancer?.location || "Remote / Global"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-500">Email Address</p>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {freelancer?.email || "Not Provided"}
                      </p>
                      {freelancer?.email && (
                        <button 
                          onClick={handleCopyEmail}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                          title="Copy Email"
                        >
                          {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Platform Standing</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {completedJobs} Delivered Tasks
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Member Since</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Basic Invite to Task Modal Placeholder */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-[2rem] p-6 shadow-2xl relative">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Invite to Task</h2>
            <p className="text-sm text-slate-500 mb-6">
              Select one of your open tasks to invite <strong>{freelancer?.name || "this freelancer"}</strong> to submit a proposal.
            </p>
            
            <div className="space-y-3 mb-8">
              {/* Placeholder for tasks */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:ring-1 hover:ring-teal-400 cursor-pointer transition-all flex justify-between items-center bg-slate-50">
                <div>
                  <p className="text-sm font-bold text-slate-900">E-commerce Website Redesign</p>
                  <p className="text-xs text-slate-500 mt-0.5">Budget: $1,200 • Posted 2 days ago</p>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:ring-1 hover:ring-teal-400 cursor-pointer transition-all flex justify-between items-center bg-slate-50">
                <div>
                  <p className="text-sm font-bold text-slate-900">Full-Stack MERN Application</p>
                  <p className="text-xs text-slate-500 mt-0.5">Budget: $2,500 • Posted 1 week ago</p>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white font-semibold text-sm shadow-sm transition-colors"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
