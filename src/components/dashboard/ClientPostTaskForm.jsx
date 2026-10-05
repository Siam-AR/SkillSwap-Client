"use client";

import { useState } from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { UploadCloud, X, Calendar, DollarSign, Sparkles, ShieldCheck, ChevronDown, Loader2 } from "lucide-react";
import { createTask } from "@/lib/api";
import { CustomUploadButton } from "@/components/CustomUploadButton";
import { useRouter } from "next/navigation";

const categories = ["Design", "Writing", "Development", "Marketing", "Other"];

export default function ClientPostTaskForm() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState({ type: "idle", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    deadline: "",
    imageUrl: "",
  });

  const resetForm = () => {
    setFormValues({ title: "", category: "", description: "", budget: "", deadline: "", imageUrl: "" });
    setStatusMessage({ type: "idle", text: "" });
  };

  const updateField = (field, value) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: String(formValues.title || "").trim(),
      category: String(formValues.category || "").trim(),
      description: String(formValues.description || "").trim(),
      budget: Number(formValues.budget || 0),
      deadline: String(formValues.deadline || "").trim(),
      imageUrl: formValues.imageUrl,
    };

    if (!payload.title || !payload.category || !payload.description || !payload.deadline || !payload.budget) {
      setStatusMessage({ type: "error", text: "Please fill out all required fields before posting a task." });
      return;
    }

    if (payload.budget <= 0) {
      setStatusMessage({ type: "error", text: "Budget must be greater than zero." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: "idle", text: "" });

    try {
      await createTask(payload);
      resetForm();
      router.push("/dashboard/client/my-tasks");
    } catch (error) {
      const message = error?.message || "Unable to post your task right now.";
      setStatusMessage({ type: "error", text: message });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            CLIENT WORKSPACE • NEW PROJECT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Create a New Task
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Specify deliverables, timeline, and budget to connect with verified freelance specialists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Main Form Card (Span 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Task Title */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Design a landing page for my startup"
                value={formValues.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#009689] focus:ring-2 focus:ring-teal-500/15 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formValues.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 focus:border-[#009689] focus:ring-2 focus:ring-teal-500/15 outline-none transition-all text-sm font-medium text-slate-800 bg-white"
                >
                  <option value="" disabled>Choose a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Task Scope & Requirements <span className="text-rose-500">*</span>
              </label>
              <textarea
                placeholder="Describe the task, deliverables, style, and any requirements..."
                value={formValues.description}
                onChange={(event) => updateField("description", event.target.value)}
                className="w-full min-h-[140px] px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#009689] focus:ring-2 focus:ring-teal-500/15 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-y"
              />
              <p className="text-xs text-slate-500">
                Include tools, deliverables, milestones, or repo requirements.
              </p>
            </div>

            {/* Budget & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Fixed Budget (USD) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="150"
                    value={formValues.budget}
                    onChange={(event) => updateField("budget", event.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#009689] focus:ring-2 focus:ring-teal-500/15 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Deadline <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formValues.deadline}
                    onChange={(event) => updateField("deadline", event.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:border-[#009689] focus:ring-2 focus:ring-teal-500/15 outline-none transition-all text-sm font-medium text-slate-800 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Banner Image (Optional)
              </label>
              
              {formValues.imageUrl ? (
                <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200">
                  <img src={formValues.imageUrl} alt="Banner Preview" className="h-48 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => updateField("imageUrl", "")}
                    className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-slate-900/70 backdrop-blur px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 transition"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 hover:bg-teal-50/30 hover:border-teal-300 transition-all text-center min-h-[160px]">
                  <div className="absolute inset-0 z-10 opacity-0 cursor-pointer">
                    <CustomUploadButton
                      onUploadComplete={(res) => {
                        if (res && res[0]) {
                          updateField("imageUrl", res[0].url);
                        }
                      }}
                      onUploadError={(error) => {
                        setStatusMessage({ type: "error", text: `Upload failed: ${error.message}` });
                      }}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-6">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#009689] flex items-center justify-center border border-teal-100">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Drop your task banner here or click to browse</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP up to 4MB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {statusMessage.text && statusMessage.type === "error" && (
              <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-semibold shadow-sm shadow-teal-900/15 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Post Task
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-all"
              >
                Reset
              </button>
            </div>

          </form>
        </div>

        {/* Right Sticky Guidance Rail (Span 4) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
          {/* Tips Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Posting Best Practices
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></div>
                <div>
                  <span className="font-semibold text-slate-800">Specific Deliverables:</span>
                  <p className="text-slate-500 mt-0.5">Mention exact outputs (e.g., Figma mockups, Next.js components).</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></div>
                <div>
                  <span className="font-semibold text-slate-800">Realistic Budgets:</span>
                  <p className="text-slate-500 mt-0.5">Market-rate compensation attracts verified senior developers.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></div>
                <div>
                  <span className="font-semibold text-slate-800">Clear Timelines:</span>
                  <p className="text-slate-500 mt-0.5">Set clear milestones for drafts and revisions.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Escrow & Quality Card */}
          <div className="bg-teal-50/60 rounded-3xl border border-teal-100 p-6 space-y-3">
            <ShieldCheck className="text-[#009689] w-6 h-6" />
            <h3 className="font-bold text-slate-900">Protected Payments</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Funds are held securely in milestone escrow and only released once you inspect and approve submitted deliverables.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
