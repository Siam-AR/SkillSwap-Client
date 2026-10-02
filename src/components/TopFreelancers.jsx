"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Star, ArrowRight } from "lucide-react";

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
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#009689]">
              Top Freelancers
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Hire top rated talent
            </h2>
          </div>
          <Link
            href="/browse-freelancers"
            className="text-sm font-semibold text-[#009689] transition hover:text-teal-500 flex items-center gap-1 group"
          >
            Browse freelancers <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {freelancers.map((freelancer) => {
            const displaySkills = freelancer.skills?.slice(0, 3) || [];
            const extraSkillsCount = (freelancer.skills?.length || 0) - 3;
            
            return (
              <motion.div key={freelancer._id || freelancer.email} variants={cardVariants} className="h-full">
                <Link href={`/freelancer/${freelancer._id || freelancer.email}`} className="block h-full group">
                  <div className="flex flex-col justify-between h-full bg-white rounded-2xl sm:rounded-3xl border border-teal-100/60 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    
                    {/* 1. Card Header */}
                    <div className="flex flex-col gap-4">
                      {/* Top Row: Availability & Rate */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wide">Available</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">
                            {freelancer.hourlyRate ? (
                              <>
                                ${freelancer.hourlyRate}
                                <span className="text-xs font-medium text-slate-500">/hr</span>
                              </>
                            ) : (
                              <span className="text-xs font-semibold text-slate-500">Negotiable</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="rounded-full bg-gradient-to-br from-teal-400 via-[#009689] to-teal-600 p-[2px]">
                            <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full border-2 border-white bg-slate-100">
                              {freelancer.image ? (
                                <Image
                                  src={freelancer.image}
                                  alt={freelancer.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xl font-bold text-slate-700">
                                  {freelancer.name?.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Verified Badge */}
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[1px]">
                            <BadgeCheck className="w-5 h-5 text-white" fill="#009689" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="truncate text-lg font-semibold text-slate-900">
                            {freelancer.name}
                          </h3>
                          <p className="truncate text-xs text-slate-500">
                            {freelancer.title || "Freelancer"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Card Body */}
                    <div className="mt-5 flex flex-col gap-4 flex-1">
                      {/* Trust Strip */}
                      <div className="flex items-center justify-between text-xs font-medium text-slate-600 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-700">{freelancer.rating || "5.0"}</span>
                          <span className="text-slate-500">({freelancer.reviewCount || 0})</span>
                        </div>
                        <div>
                          {freelancer.finishedJobs || 0} {(freelancer.finishedJobs === 1) ? "order" : "orders"}
                        </div>
                      </div>

                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {displaySkills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/60"
                          >
                            {skill}
                          </span>
                        ))}
                        {extraSkillsCount > 0 && (
                          <span className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-teal-50 text-[#009689] border border-teal-100/60">
                            +{extraSkillsCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3. Card Footer */}
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <button className="w-full flex items-center justify-center gap-1.5 bg-teal-50 text-[#009689] hover:bg-[#2CA99F] hover:text-white font-semibold text-sm py-2 px-4 rounded-xl transition-colors">
                        View Profile 
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}