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
      classes: "bg-rose-50 text-rose-600 border-rose-200",
    };
  }

  if (normalizedStatus === "in progress" || normalizedStatus === "in-progress" || normalizedStatus === "in_progress") {
    return {
      label: "In Progress",
      classes: "bg-amber-50 text-amber-600 border-amber-200",
    };
  }

  if (normalizedStatus === "completed" || normalizedStatus === "complete") {
    return {
      label: "Completed",
      classes: "bg-sky-50 text-sky-600 border-sky-200",
    };
  }

  return {
    label: "Open",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
    <div className="group relative bg-white hover:bg-white border border-slate-200/90 hover:border-[#009689] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-teal-900/10 hover:-translate-y-1 h-full overflow-hidden">
      
      <div className="flex flex-col h-full">
        {/* Card Header (Category & Status) */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-teal-50 text-[#009689] border border-teal-200/60">
            {task.category || "General"}
          </span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusInfo.classes}`}>
            {statusInfo.showPulse && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
            {statusInfo.label}
          </span>
        </div>

        {/* Card Body */}
        <Link href={`/task/${taskId}`} className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#009689] transition-colors line-clamp-1 mt-3 mb-2">
            {task.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed min-h-[40px] mb-5">
            {task.description}
          </p>

          {/* Metadata Strip */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-lg font-extrabold text-[#009689]">${task.budget}</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Due {formatDate(task.deadline)}</span>
            </div>
          </div>
        </Link>
        
        {/* Card Footer & Action */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
          <Link 
            href={`/task/${taskId}`} 
            className="w-full py-2.5 px-4 rounded-xl bg-teal-50 group-hover:bg-[#009689] text-[#009689] group-hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300"
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
