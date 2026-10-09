"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight, Send, ArrowUpRight, Sparkles } from "lucide-react";

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
    <section className="w-full py-12 md:py-16">
      <div className="w-full max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <p className="text-sm font-bold uppercase tracking-wider text-[#009689]">
            Latest Tasks
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Explore Recent Opportunities
          </h2>
          <p className="max-w-2xl text-slate-500 text-base md:text-lg">
            Find the perfect project that matches your skills. These freshly posted tasks are waiting for your proposals.
          </p>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full"
        >
        {displayTasks.map((task) => {
          const timeAgo = formatTimeAgo(task.createdAt);
          const proposalsCount = task.proposalsCount || task.proposals?.length || 0;
          const budgetAmount = task.budget || task.price || 0;
          const budgetType = task.budgetType || "";
          const categoryName = typeof task.category === "object" ? task.category?.name : task.category || "General";

          return (
            <motion.div key={task._id} variants={cardVariants} className="h-full">
              <Link href={`/task/${task._id || task.id}`} className="block h-full outline-none">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-900/5 hover:border-teal-500/40 cursor-pointer flex flex-col justify-between group h-full">
                  
                  {/* 1. Header: Category Pill & Elevated Budget Badge */}
                  <div className="flex items-center justify-between gap-2 pb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-[#009689] border border-teal-100">
                      <Sparkles className="w-3 h-3 text-[#009689]"/>
                      {categoryName}
                    </span>

                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
                      <span>${budgetAmount}</span>
                      {budgetType && <span className="text-[10px] text-slate-400 font-medium">/{budgetType}</span>}
                    </div>
                  </div>

                  {/* 2. Task Title & Description Snippet */}
                  <div className="space-y-2 py-1 flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 leading-snug min-h-[3rem] group-hover:text-[#009689] transition-colors line-clamp-2">
                      {task.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                      {task.description && task.description.trim().length > 0 
                        ? task.description 
                        : "No description provided for this task. Review scope requirements before submitting a proposal."}
                    </p>
                  </div>

                  {/* 3. Structured Metadata Strip */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium py-2 border-t border-slate-100 mt-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400"/>
                      <span>{timeAgo}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-slate-400"/>
                      <span>{proposalsCount} props</span>
                    </div>
                  </div>

                  {/* 4. Action Button Footer */}
                  <div className="pt-2">
                    <div className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 min-h-[44px] rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold lg:group-hover:bg-[#009689] lg:group-hover:text-white lg:group-hover:border-transparent transition-all duration-300 group/btn shadow-sm">
                      <span>Quick Apply</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 lg:group-hover/btn:text-white lg:group-hover/btn:translate-x-0.5 lg:group-hover/btn:-translate-y-0.5 transition-all"/>
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
            className="flex items-center gap-2 text-[#009689] lg:hover:text-[#238B81] font-semibold text-base transition-colors group min-h-[44px] px-4"
          >
            View All Tasks
            <ArrowRight className="w-5 h-5 transition-transform lg:group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
