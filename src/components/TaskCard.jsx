"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

function formatDate(dateString) {
  if (!dateString) {
    return "Flexible";
  }

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadge(status) {
  const normalizedStatus = String(status || "open").trim().toLowerCase();

  if (normalizedStatus === "close" || normalizedStatus === "closed") {
    return {
      label: "Closed",
      bgClass: "bg-rose-500/90",
      showPulse: false,
    };
  }

  if (normalizedStatus === "in progress" || normalizedStatus === "in-progress" || normalizedStatus === "in_progress") {
    return {
      label: "In Progress",
      bgClass: "bg-amber-500/90",
      showPulse: false,
    };
  }

  if (normalizedStatus === "completed" || normalizedStatus === "complete") {
    return {
      label: "Completed",
      bgClass: "bg-sky-500/90",
      showPulse: false,
    };
  }

  return {
    label: "Open",
    bgClass: "bg-emerald-500/90",
    showPulse: true,
  };
}

const normalizeTaskId = (id) => {
  if (typeof id === "string") {
    return id.trim();
  }

  if (id && typeof id === "object") {
    if (typeof id.toHexString === "function") {
      return id.toHexString();
    }

    if (typeof id.toString === "function") {
      const stringValue = id.toString();
      if (stringValue.startsWith("ObjectId(\"") && stringValue.endsWith("\")")) {
        return stringValue.slice(9, -2);
      }
      return stringValue;
    }
  }

  return String(id ?? "").trim();
};

export default function TaskCard({ task, actions }) {
  const taskId = normalizeTaskId(task._id ?? task.id ?? "");
  const statusInfo = getStatusBadge(task.status);
  
  const defaultPlaceholder = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80";
  const imageSrc = task.imageUrl || task.image || defaultPlaceholder;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 lg:hover:border-[#009689] overflow-hidden shadow-sm lg:hover:shadow-xl lg:hover:shadow-teal-900/10 transition-all duration-300 flex flex-col justify-between lg:hover:-translate-y-1 h-full">
      
      {/* 1. Image Thumbnail Banner */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-100 shrink-0">
        <img
          src={imageSrc}
          alt={task.title}
          className="w-full h-full object-cover lg:group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.currentTarget.src = defaultPlaceholder;
          }}
        />
        {/* Category Badge overlay on top-left */}
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[#009689] shadow-sm inline-block">
            {task.category || "General"}
          </span>
        </div>
        {/* Status badge on top-right */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.bgClass} backdrop-blur-md text-white shadow-sm`}>
            {statusInfo.showPulse && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* 2. Card Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 lg:group-hover:text-[#009689] transition-colors line-clamp-1 mb-2">
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {task.description}
        </p>

        {/* Due Date & Sub-meta */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100 mt-auto">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Due: {formatDate(task.deadline || task.dueDate)}</span>
        </div>

        {/* 3. Footer Bar: Price & CTA Button */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">Budget</span>
            <span className="text-lg sm:text-xl font-extrabold text-[#009689]">
              ${task.budget}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Link 
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl bg-teal-50 lg:group-hover:bg-[#009689] text-[#009689] lg:group-hover:text-white text-xs sm:text-sm font-semibold transition-all duration-300" 
              href={`/task/${taskId}`}
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5 lg:group-hover:translate-x-1 transition-transform" />
            </Link>
            {actions ? <div className="flex items-center justify-center gap-2">{actions}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
