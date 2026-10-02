"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight } from "lucide-react";

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
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

        {/* Grid - 2 Column Wide Format */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {displayTasks.map((task) => {
            const timeAgo = formatTimeAgo(task.createdAt);
            const proposalsCount = task.proposalsCount || 0;

            return (
              <motion.div key={task._id} variants={cardVariants} className="h-full">
                <Link href={`/task/${task._id}`} className="block h-full group">
                  <div className="relative bg-white/90 backdrop-blur-sm border border-slate-200/80 border-l-[4px] border-l-transparent rounded-2xl p-6 transition-all duration-300 hover:border-[#2CA99F] hover:shadow-[0_12px_30px_rgba(0,150,137,0.08)] hover:-translate-y-0.5 flex flex-col justify-between h-full">
                    
                    <div>
                      {/* Top Row: Header & Budget Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <span className="bg-teal-50 text-[#009689] font-medium text-xs px-2.5 py-1 rounded-md">
                          {task.category || "General"}
                        </span>
                        
                        <div className="bg-slate-900 text-white text-sm font-bold px-3 py-1 rounded-full group-hover:bg-[#009689] transition-colors shrink-0">
                          ${task.budget} Fixed
                        </div>
                      </div>

                      {/* Middle Area: Title, Metadata & Snippet */}
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#009689] transition-colors line-clamp-1 mt-4">
                        {task.title}
                      </h3>

                      {/* Meta Strip */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500 mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{timeAgo}</span>
                        </div>
                        <span className="text-slate-300 mx-0.5">•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Remote</span>
                        </div>
                        <span className="text-slate-300 mx-0.5">•</span>
                        <span>
                          {proposalsCount} {proposalsCount === 1 ? "proposal" : "proposals"}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-500 line-clamp-2 mt-3 leading-relaxed">
                        {task.description || "No description provided for this task."}
                      </p>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                      {/* Left: Skill Tags */}
                      <div className="flex flex-wrap gap-2">
                        {task.skills && task.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="bg-slate-50 text-slate-600 border border-slate-200 text-xs px-2.5 py-1 rounded-md font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Right: Quick Apply Link */}
                      <div className="text-sm font-semibold text-[#009689] flex items-center gap-1 group-hover:gap-2 transition-all shrink-0 pl-4">
                        Quick Apply <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                    
                  </div>
                </Link>
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
