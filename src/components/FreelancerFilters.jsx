"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function FreelancerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [skill, setSkill] = useState(searchParams.get("skill") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      const currentSkill = searchParams.get("skill") || "";
      const currentSort = searchParams.get("sort") || "";

      // Only push to router if the filters actually changed (prevents pagination reset loop)
      if (search === currentSearch && skill === currentSkill && sort === currentSort) {
        return;
      }

      const params = new URLSearchParams(searchParams);
      if (search) params.set("search", search);
      else params.delete("search");

      if (skill) params.set("skill", skill);
      else params.delete("skill");

      if (sort) params.set("sort", sort);
      else params.delete("sort");

      // Reset to page 1 when filters change
      params.set("page", "1");

      router.push(`/browse-freelancers?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(handler);
  }, [search, skill, sort, router, searchParams]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-sm shadow-slate-200/50 flex flex-col md:flex-row gap-3 items-center mt-8 mb-10">
      
      {/* Search Input */}
      <div className="relative w-full overflow-hidden flex items-center">
        <div className="absolute left-3 text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search freelancers by name or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50/60 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all"
        />
      </div>

      {/* Skill / Specialty Filter */}
      <select
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        className="w-full md:w-60 bg-slate-50/60 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:bg-white focus:border-[#009689] transition-all"
      >
        <option value="">All Skills</option>
        <option value="Frontend">Frontend</option>
        <option value="Full Stack">Full Stack</option>
        <option value="UI/UX Design">UI/UX Design</option>
        <option value="Content Writing">Content Writing</option>
        <option value="SEO">SEO</option>
        <option value="Bug Fixing">Bug Fixing</option>
      </select>

      {/* Sort Dropdown */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-full md:w-48 bg-slate-50/60 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:bg-white focus:border-[#009689] transition-all"
      >
        <option value="">Top Rated</option>
        <option value="most-completed">Most Completed Tasks</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
}
