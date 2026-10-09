"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { getSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { CustomUploadButton } from "@/components/CustomUploadButton";

const normalizeSkills = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((skill) => String(skill).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
};

export default function EditProfileForm({ onCancel, onSuccess, initialUser }) {
  const router = useRouter();
  const isClient = String(initialUser?.role || "").toLowerCase() === "client";
  const [formState, setFormState] = useState({
    name: initialUser?.name || "",
    designation: initialUser?.designation || initialUser?.headline || "",
    image: initialUser?.image || "",
    skills: Array.isArray(initialUser?.skills) ? initialUser.skills.join(", ") : String(initialUser?.skills || ""),
    bio: initialUser?.bio || "",
    hourlyRate: initialUser?.hourlyRate != null ? String(initialUser.hourlyRate) : "",
    status: initialUser?.status || "available",
    location: initialUser?.location || "",
  });
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const skillList = useMemo(() => normalizeSkills(formState.skills), [formState.skills]);

  const handleChange = (field) => (event) => {
    setFormState((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const trimmedName = String(formState.name || "").trim();
    const trimmedDesignation = String(formState.designation || "").trim();
    const trimmedImage = String(formState.image || "").trim();
    const trimmedBio = String(formState.bio || "").trim();
    const trimmedLocation = String(formState.location || "").trim();
    const hourlyRateValue = Number(formState.hourlyRate || 0);

    if (!trimmedName) {
      setFeedback({ type: "error", message: "Name is required." });
      return;
    }

    if (!isClient && (isNaN(hourlyRateValue) || hourlyRateValue < 0)) {
      setFeedback({ type: "error", message: "Hourly rate must be a valid positive number." });
      return;
    }

    setIsSaving(true);

    try {
      const sessionResult = await getSession();
      const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;
      const email = sessionUser?.email;

      if (!email) {
        throw new Error("Unable to determine your account email.");
      }

      const res = await fetch("/api/dashboard/freelancer/profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": email,
          "X-User-Role": sessionUser?.role || "freelancer",
        },
        body: JSON.stringify({
          name: trimmedName,
          designation: trimmedDesignation,
          image: trimmedImage,
          skills: skillList,
          bio: trimmedBio,
          hourlyRate: hourlyRateValue,
          status: formState.status,
          location: trimmedLocation,
        }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Unable to save profile.");
      
      // Update session if needed (depends on how useSession works, but usually it needs to refresh the route)
      router.refresh();
      
      if (onSuccess) onSuccess();
    } catch (error) {
      setFeedback({ type: "error", message: error?.message || "Unable to update profile." });
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
        <button 
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          type="button"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {feedback ? (
        <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {feedback.message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name and Title */}
        <div className={`grid gap-6 ${isClient ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}>
          <label className="block text-sm font-semibold text-slate-800">
            Full Name
            <input
              type="text"
              value={formState.name}
              onChange={handleChange("name")}
              placeholder="Your full name"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689]"
            />
          </label>

          {!isClient && (
            <label className="block text-sm font-semibold text-slate-800">
              Designation / Professional Title
              <input
                type="text"
                value={formState.designation}
                onChange={handleChange("designation")}
                placeholder="e.g. Full Stack MERN Developer"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689]"
              />
            </label>
          )}
        </div>

        {/* Row 2: Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Profile Photo
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {formState.image ? (
              <img src={formState.image} alt="Preview" className="w-16 h-16 rounded-full border border-slate-200 object-cover shrink-0" onError={(e) => e.currentTarget.src="https://via.placeholder.com/64"} />
            ) : (
              <div className="w-16 h-16 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 text-xs text-center shrink-0">
                No Photo
              </div>
            )}
            
            <div className="flex-1 flex justify-start">
              <CustomUploadButton
                onUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    setFormState((current) => ({ ...current, image: res[0].url }));
                    setFeedback({ type: "success", message: "Photo uploaded successfully!" });
                  }
                }}
                onUploadError={(error) => {
                  setFeedback({ type: "error", message: `Upload failed: ${error.message}` });
                }}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Rate, Status and Location */}
        <div className={`grid gap-6 ${isClient ? "sm:grid-cols-1" : "sm:grid-cols-3"}`}>
          <label className="block text-sm font-semibold text-slate-800">
            Location
            <input
              type="text"
              value={formState.location}
              onChange={handleChange("location")}
              placeholder="e.g. New York, NY"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689]"
            />
          </label>

          {!isClient && (
            <>
              <label className="block text-sm font-semibold text-slate-800">
                Hourly Rate (USD)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.hourlyRate}
                  onChange={handleChange("hourlyRate")}
                  placeholder="40"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689]"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-800">
                Availability Status
                <select
                  value={formState.status}
                  onChange={handleChange("status")}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689]"
                >
                  <option value="available">Available - Ready for new projects</option>
                  <option value="busy">Busy - Currently on active projects</option>
                  <option value="unavailable">Unavailable - Not taking work</option>
                </select>
              </label>
            </>
          )}
        </div>

        {/* Row 4: Bio */}
        <label className="block text-sm font-semibold text-slate-800">
          Bio / Summary
          <textarea
            value={formState.bio}
            onChange={handleChange("bio")}
            rows={4}
            placeholder="Write a compelling professional summary..."
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689]"
          />
        </label>

        {/* Row 5: Skills */}
        {!isClient && (
          <label className="block text-sm font-semibold text-slate-800">
            Skills (comma separated)
            <input
              type="text"
              value={formState.skills}
              onChange={handleChange("skills")}
              placeholder="React, Next.js, Node.js, Tailwind"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689]"
            />
          </label>
        )}

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 text-sm font-semibold transition-all disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#009689] hover:bg-[#238B81] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-all disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiSave className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
