"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, CheckCircle2, Briefcase, ArrowUpRight, ArrowRight } from "lucide-react";

export default function TopFreelancers({ freelancers }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <section className="w-full max-w-[1500px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 2xl:px-16 py-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center pb-4">
        <h2 className="text-4xl font-bold text-slate-900">Top  <span className="text-[#009689]">Freelancers</span></h2>
        <p className="mt-3 text-slate-600">
          Hire top rated talent
        </p>
      </div>

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 w-full mt-10"
      >
        {freelancers.slice(0, 4).map((freelancer) => {
          const rawStatus = (
            freelancer.status ||
            freelancer.availabilityStatus ||
            "available"
          ).toLowerCase();
          
          const rateText = freelancer.hourlyRate
            ? `$${freelancer.hourlyRate}/hr`
            : freelancer.rate || "Negotiable";

          const completed = freelancer.finishedJobs || freelancer.completedTasks || 0;
          const ordersText = completed > 0
            ? `${completed} ${completed === 1 ? "order" : "orders"}`
            : "1 order";

          const ratingValue = freelancer.rating || "5.0";
          const reviewsCount = freelancer.reviewCount || freelancer.reviews || 0;
          const skills = freelancer.skills || [];

          return (
            <motion.div key={freelancer._id || freelancer.email} variants={cardVariants} className="w-full h-full">
              <Link href={`/freelancer/${freelancer._id || freelancer.email}`} className="block w-full h-full outline-none">
                  <div className="group relative w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between h-full shadow-sm lg:hover:shadow-xl lg:hover:shadow-teal-900/5 lg:hover:-translate-y-1 lg:hover:border-teal-300/80 transition-all duration-300">
                    
                    {/* 1. Header: Status & Rate */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      {rawStatus === "busy" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Busy
                        </span>
                      ) : rawStatus === "unavailable" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Unavailable
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Available
                        </span>
                      )}

                      <span className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                        {rateText}
                      </span>
                    </div>

                    {/* 2. Freelancer Identity (Avatar, Name, Role) */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-3">
                        <div className="w-20 h-20 rounded-full p-1 border-2 border-[#009689] bg-white shadow-xs overflow-hidden flex items-center justify-center">
                          {freelancer.image || freelancer.avatar ? (
                            <img
                              src={freelancer.image || freelancer.avatar}
                              alt={freelancer.name}
                              className="w-full h-full rounded-full object-cover lg:group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#009689] to-[#2CA99F] flex items-center justify-center text-white font-extrabold text-2xl">
                              {freelancer.name?.charAt(0) || "F"}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-white rounded-full shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#009689] fill-teal-50"/>
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 lg:group-hover:text-[#009689] transition-colors line-clamp-1">
                        {freelancer.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1 max-w-[90%]">
                        {freelancer.designation || freelancer.title || freelancer.headline || freelancer.professionalTitle || "Full Stack Developer"}
                      </p>

                      {/* 3. Compact Metrics Strip */}
                      <div className="flex items-center justify-center gap-4 mt-4 w-full py-2.5 px-4 rounded-2xl bg-slate-50 border border-slate-100/80 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400"/>
                          <span>{ratingValue}</span>
                          <span className="text-slate-400 font-normal">({reviewsCount})</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                          <Briefcase className="w-4 h-4 text-slate-400"/>
                          <span>{ordersText}</span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Skills Row: Strictly 1 Line, No Wrapping */}
                    <div className="flex items-center justify-center gap-1.5 w-full overflow-hidden mt-5 mb-6 h-7">
                      {skills.slice(0, 2).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl whitespace-nowrap truncate max-w-[120px]"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 2 && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100/80 border border-slate-200/60 px-2 py-1 rounded-xl shrink-0 whitespace-nowrap">
                          +{skills.length - 2}
                        </span>
                      )}
                    </div>

                    {/* 5. Compact CTA Button */}
                    <div className="pt-2 border-t border-slate-100 mt-auto">
                      <div className="w-full inline-flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-2xl bg-teal-50/70 lg:group-hover:bg-[#009689] text-[#009689] lg:group-hover:text-white border border-teal-200/50 lg:group-hover:border-[#009689] text-sm font-bold transition-all duration-200 shadow-sm group/btn">
                        <span>View Profile</span>
                        <ArrowUpRight className="w-4 h-4 lg:group-hover/btn:translate-x-0.5 lg:group-hover/btn:-translate-y-0.5 transition-transform"/>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

      {/* Action Button */}
      <div className="pt-4 flex justify-center">
        <Link 
          href="/browse-freelancers"
          className="flex items-center gap-2 text-[#009689] lg:hover:text-[#238B81] font-semibold text-base transition-colors group min-h-[44px] px-4"
        >
          Browse all freelancers
          <ArrowRight className="w-5 h-5 transition-transform lg:group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}