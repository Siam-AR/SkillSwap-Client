"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { getSession } from "@/lib/auth-client";
import Link from "next/link";

const normalizeSkills = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((skill) => String(skill).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return Number.isNaN(amount) ? "$0.00" : `$${amount.toFixed(2)}`;
};

export default function FreelancerEditProfilePage() {
  const [formState, setFormState] = useState({
    name: "",
    designation: "",
    image: "",
    skills: "",
    bio: "",
    hourlyRate: "",
    status: "available",
  });
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setFeedback(null);

      try {
        const sessionResult = await getSession();
        const sessionUser = sessionResult?.data?.user || sessionResult?.user || sessionResult?.data?.session?.user || null;
        const email = sessionUser?.email;

        if (!email) {
          setFeedback({ type: "error", message: "Unable to determine your account email." });
          setLoading(false);
          return;
        }

        const res = await fetch("/api/dashboard/freelancer/profile", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-User-Email": email,
            "X-User-Role": sessionUser?.role || "freelancer",
          },
        });

        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.message || "Failed to load profile.");

        const user = payload.data || {};
        setFormState({
          name: user.name || "",
          designation: user.designation || user.headline || "",
          image: user.image || "",
          skills: Array.isArray(user.skills) ? user.skills.join(", ") : String(user.skills || ""),
          bio: user.bio || "",
          hourlyRate: user.hourlyRate != null ? String(user.hourlyRate) : "",
          status: user.status || "available",
        });
      } catch (error) {
        setFeedback({ type: "error", message: error?.message || "Unable to load profile details." });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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
    const hourlyRateValue = Number(formState.hourlyRate || 0);

    if (!trimmedName) {
      setFeedback({ type: "error", message: "Name is required." });
      return;
    }

    if (isNaN(hourlyRateValue) || hourlyRateValue < 0) {
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
        }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Unable to save profile.");

      setFormState((current) => ({ ...current, skills: Array.isArray(payload.data.skills) ? payload.data.skills.join(", ") : String(payload.data.skills || "") }));
      setFeedback({ type: "success", message: "Profile updated successfully." });
      setShowSuccessModal(true);
    } catch (error) {
      setFeedback({ type: "error", message: error?.message || "Unable to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* Header section with back link */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Edit Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Update your professional identity and public profile details.
          </p>
        </div>
        <Link 
          href="/profile" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#009689] transition-colors bg-white border border-slate-200 px-4 py-2 rounded-xl"
        >
          <FiArrowLeft /> Back to Profile
        </Link>
      </div>

      {feedback ? (
        <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {feedback.message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        
        {/* Row 1: Name and Title */}
        <div className="grid gap-6 sm:grid-cols-2">
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
        </div>

        {/* Row 2: Image URL with Preview */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Profile Photo URL
            <input
              type="url"
              value={formState.image}
              onChange={handleChange("image")}
              placeholder="https://images.unsplash.com/..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689]"
            />
          </label>
          {formState.image && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Preview:</span>
              <img src={formState.image} alt="Preview" className="w-10 h-10 rounded-full border border-slate-200 object-cover" onError={(e) => e.currentTarget.src="https://via.placeholder.com/40"} />
            </div>
          )}
        </div>

        {/* Row 3: Rate and Status */}
        <div className="grid gap-6 sm:grid-cols-2">
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

        <div className="pt-4 flex items-center justify-end border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#009689] hover:bg-[#238B81] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-all disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiSave className="h-4 w-4" />
            {isSaving ? "Saving changes..." : "Save Changes"}
          </button>
        </div>
      </form>

      {showSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 text-center">Profile updated</h2>
            <p className="mt-3 text-sm text-slate-600 text-center leading-relaxed">
              Your professional profile has been updated and your changes are now live.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/profile"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#009689] hover:bg-[#238B81] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-all"
              >
                View Profile
              </Link>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="inline-flex w-full items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-3 text-sm font-semibold transition-all"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
