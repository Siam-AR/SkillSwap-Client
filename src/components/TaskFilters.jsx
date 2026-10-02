"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function TaskFilters({ categories, initialSearch = "", initialCategory = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    setSearch(initialSearch);
    setCategory(initialCategory);
  }, [initialSearch, initialCategory]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    params.delete("page");
    const queryString = params.toString();
    router.push(`/browse-tasks${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="mt-8 bg-white border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl flex flex-col md:flex-row gap-3 items-center shadow-sm shadow-slate-200/50 w-full"
    >
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title, category, or keyword..."
          className="w-full bg-slate-50/70 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all"
        />
      </div>

      <div className="w-full md:w-auto relative shrink-0">
        <select
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full md:w-56 appearance-none bg-slate-50/70 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <button
        type="submit"
        className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-teal-900/15 shrink-0 whitespace-nowrap"
      >
        Apply filters
      </button>
    </form>
  );
}
