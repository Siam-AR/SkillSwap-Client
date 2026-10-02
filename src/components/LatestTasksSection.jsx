"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Clock, MapPin, Star, ArrowRight } from "lucide-react";

function formatTimeAgo(dateString) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
  return Math.floor(seconds) + " seconds ago";
}

export default function LatestTasksSection({ tasks }) {
  // Use only the latest 4 tasks
  const displayTasks = tasks?.slice(0, 4) || [];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <p className="text-sm font-bold uppercase tracking-wider text-[#009689]">
            Latest Tasks
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Recent Opportunities
          </h2>
          <p className="max-w-2xl text-slate-500 text-lg">
            Find the perfect project that matches your skills. These freshly posted tasks are waiting for your proposals.
          </p>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {displayTasks.map((task) => {
            const timeAgo = formatTimeAgo(task.createdAt);

            return (
              <motion.div key={task._id} variants={cardVariants} className="h-full">
                <div className="group bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:border-teal-300/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
                  
                  <div className="flex flex-col gap-4">
                    {/* Top Row: Title & Bookmark */}
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/task/${task._id}`} className="min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#009689] transition-colors line-clamp-2">
                          {task.title}
                        </h3>
                      </Link>
                      <button className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Remote</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{task.client?.rating || "New"}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {task.description || "No description provided."}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {task.skills && task.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="bg-teal-50/60 text-[#009689] border border-teal-100 text-xs px-2.5 py-1 rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                      {task.skills && task.skills.length > 3 && (
                        <span className="bg-slate-50 text-slate-600 border border-slate-200 text-xs px-2 py-1 rounded-md font-medium">
                          +{task.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer & Pricing */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-slate-500">
                        Proposals: <strong className="text-slate-700">{task.proposalsCount || 0}</strong>
                      </span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-900">${task.budget}</span>
                        <span className="text-xs font-semibold text-slate-500">/fixed</span>
                      </div>
                    </div>
                    
                    <Link href={`/task/${task._id}`} className="block w-full">
                      <button className="bg-[#2CA99F] hover:bg-[#238B81] text-white font-semibold py-2.5 rounded-xl w-full text-center transition-colors shadow-sm flex items-center justify-center gap-2 group-button">
                        Apply Now
                      </button>
                    </Link>
                  </div>
                  
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Link */}
        <div className="pt-4 flex justify-center">
          <Link 
            href="/browse-tasks"
            className="flex items-center gap-2 text-[#009689] hover:text-[#238B81] font-semibold text-base transition-colors group"
          >
            View All Tasks
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
