"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

export default function TaskFilters({ categories, initialSearch = "", initialCategory = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dedup categories in case of anomalies like "Writing" vs "Writing & Content" variants appearing twice if exact strings
  const uniqueCategories = Array.from(new Set(categories || []));

  useEffect(() => {
    setSearch(initialSearch);
    setCategory(initialCategory);
  }, [initialSearch, initialCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

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

      <div className="w-full md:w-56 relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full flex items-center justify-between text-left bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 transition-all outline-none focus:bg-white focus:border-[#009689] focus:ring-1 focus:ring-[#009689] ${
            isDropdownOpen ? "bg-white border-[#009689] ring-1 ring-[#009689]" : ""
          }`}
        >
          <span className={`text-sm truncate pr-2 ${category ? "text-slate-900 font-medium" : "text-slate-700"}`}>
            {category || "All Categories"}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Custom Glassmorphic Popover */}
        {isDropdownOpen && (
          <div data-lenis-prevent="true" className="absolute top-[calc(100%+8px)] left-0 w-full z-50 bg-white/95 backdrop-blur-md rounded-xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-1.5 max-h-60 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
            <div
              onClick={() => {
                setCategory("");
                setIsDropdownOpen(false);
              }}
              className={`flex items-center justify-between px-4 py-2.5 mx-1.5 rounded-lg cursor-pointer transition-colors text-sm ${
                category === "" 
                  ? "bg-teal-50 text-teal-800 font-bold" 
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>All Categories</span>
              {category === "" && <Check className="w-4 h-4 text-teal-600 shrink-0 ml-2" />}
            </div>
            
            {uniqueCategories.map((item) => (
              <div
                key={item}
                onClick={() => {
                  setCategory(item);
                  setIsDropdownOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 mx-1.5 rounded-lg cursor-pointer transition-colors text-sm ${
                  category === item 
                    ? "bg-teal-50 text-teal-800 font-bold" 
                    : "text-slate-700 hover:bg-teal-50/50 hover:text-teal-700"
                }`}
              >
                <span className="truncate">{item}</span>
                {category === item && <Check className="w-4 h-4 text-teal-600 shrink-0 ml-2" />}
              </div>
            ))}
          </div>
        )}
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
