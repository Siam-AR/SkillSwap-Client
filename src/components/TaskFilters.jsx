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
      className="mt-8 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-2 sm:p-2.5 rounded-2xl flex flex-col md:flex-row gap-2.5 items-center shadow-xl shadow-black/20 w-full"
    >
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title, category, or keyword..."
          className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all outline-none"
        />
      </div>

      <div className="w-full md:w-auto relative">
        <select
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full md:w-48 appearance-none bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-[#009689] focus:ring-1 focus:ring-[#009689] transition-all cursor-pointer"
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
        className="w-full md:w-auto bg-[#009689] hover:bg-[#2CA99F] text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-teal-950/30 whitespace-nowrap"
      >
        Apply filters
      </button>
    </form>
  );
}
