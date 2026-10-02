import Link from "next/link";
import { Clock, DollarSign, ArrowRight } from "lucide-react";

function formatDate(dateString) {
  if (!dateString) {
    return "No deadline";
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
      classes: "bg-rose-950/40 text-rose-400 border-rose-800/30",
    };
  }

  if (normalizedStatus === "in progress" || normalizedStatus === "in-progress" || normalizedStatus === "in_progress") {
    return {
      label: "In Progress",
      classes: "bg-amber-950/40 text-amber-400 border-amber-800/30",
    };
  }

  if (normalizedStatus === "completed" || normalizedStatus === "complete") {
    return {
      label: "Completed",
      classes: "bg-sky-950/40 text-sky-400 border-sky-800/30",
    };
  }

  return {
    label: "Open",
    classes: "bg-emerald-950/40 text-emerald-400 border-emerald-800/30",
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

  return (
    <div className="group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-teal-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-teal-950/20 hover:-translate-y-1 h-full overflow-hidden">
      
      {/* Subtle top edge ambient gradient line on hover */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/0 group-hover:via-teal-400/50 to-transparent transition-all duration-500"></div>

      <div className="flex flex-col h-full">
        {/* Card Header (Category & Status) */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            {task.category || "General"}
          </span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${statusInfo.classes}`}>
            {statusInfo.showPulse && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
            {statusInfo.label}
          </span>
        </div>

        {/* Card Body */}
        <Link href={`/task/${taskId}`} className="flex-1">
          <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1 mb-2">
            {task.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed min-h-[40px] mb-4">
            {task.description}
          </p>

          {/* Metadata Strip */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 text-[#2CA99F] font-bold text-base sm:text-lg">
              <DollarSign className="w-4 h-4 text-teal-400" />
              <span>{task.budget}</span>
            </div>
            
            <div className="w-[1px] h-4 bg-slate-700/50"></div>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Due {formatDate(task.deadline)}</span>
            </div>
          </div>
        </Link>
        
        {/* Card Footer & Action */}
        <div className="mt-5 pt-5 border-t border-slate-800/50 flex flex-col sm:flex-row items-center gap-3">
          <Link 
            href={`/task/${taskId}`} 
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 group-hover:bg-[#009689] text-slate-200 group-hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm"
          >
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          {actions ? <div className="flex w-full items-center justify-center gap-2">{actions}</div> : null}
        </div>
      </div>
    </div>
  );
}
