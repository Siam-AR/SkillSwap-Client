"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiPenTool, FiTrendingUp, FiEdit3, FiVideo, FiCamera, FiMonitor, FiCode, FiDatabase, FiChevronDown, FiCheck } from "react-icons/fi";

const categories = [
  { name: "Graphic & Design", icon: FiPenTool },
  { name: "Digital Marketing", icon: FiTrendingUp },
  { name: "Writing & Content", icon: FiEdit3 },
  { name: "Video & Editing", icon: FiVideo },
  { name: "Photography", icon: FiCamera },
  { name: "Animation & 3D", icon: FiMonitor },
  { name: "Programming", icon: FiCode },
  { name: "Data Science", icon: FiDatabase },
];

export default function HomeHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
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

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory && selectedCategory !== "Categories") {
      params.set("category", selectedCategory);
    }
    router.push(`/browse-tasks?${params.toString()}`);
  };

  const handleCategoryCardClick = (categoryName) => {
    router.push(`/browse-tasks?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="relative flex w-full flex-col items-center justify-end overflow-hidden -mt-[80px] min-h-[100dvh] lg:min-h-screen pb-12 md:pb-16 lg:pb-20 xl:pb-24 2xl:pb-28 pt-32">
      <img 
        src="/images/hero-image-1.jpg" 
        alt="Hero Background" 
        className="absolute inset-0 z-0 h-full w-full object-cover object-center" 
      />
      <div className="absolute inset-0 z-10 bg-slate-900/60 lg:bg-slate-900/40 backdrop-brightness-90"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
      
      <div className="relative z-20 mx-auto w-full max-w-7xl 2xl:max-w-[1500px] px-4 sm:px-6 lg:px-12 mt-auto flex flex-col lg:flex-row items-center lg:items-end lg:justify-between gap-12 lg:gap-8">
        
        {/* Left Side: Text and Search */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 
            style={{ animationDelay: '100ms' }}
            className="opacity-0 animate-fade-in-up text-4xl sm:text-5xl md:text-6xl xl:text-6xl 2xl:text-7xl font-black leading-tight 2xl:leading-[1.1] tracking-tight text-white mb-6"
          >
            <span className="block whitespace-nowrap">Your Project,</span>
            <span className="block whitespace-nowrap">Our Talent</span>
          </h1>
          <p 
            style={{ animationDelay: '250ms' }}
            className="opacity-0 animate-fade-in-up w-full max-w-2xl xl:max-w-xl 2xl:max-w-2xl text-base md:text-lg xl:text-lg 2xl:text-xl text-slate-200 mb-10 2xl:mt-4 2xl:mb-8"
          >
            Find and hire expert freelancers to bring your projects to life. Explore a variety of services and skills.
          </p>

          <form 
            onSubmit={handleSearch} 
            style={{ animationDelay: '400ms' }}
            className="opacity-0 animate-fade-in-up w-full max-w-2xl xl:max-w-xl 2xl:max-w-3xl bg-white rounded-full p-1.5 md:p-2 xl:py-3.5 xl:px-6 2xl:py-4 2xl:px-6 shadow-xl flex flex-row items-center gap-1 md:gap-2 border border-slate-200 transition-all duration-300 focus-within:ring-4 focus-within:ring-teal-500/20 focus-within:border-teal-400 focus-within:shadow-teal-900/10"
          >
            
            {/* Search Input */}
            <div className="flex flex-1 items-center px-3 md:px-4 min-h-[44px]">
              <FiSearch className="h-4 w-4 md:h-5 md:w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Job title or keywords" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 w-full bg-transparent px-2 md:px-3 py-2 text-sm xl:text-base 2xl:text-lg text-slate-800 placeholder-slate-400 focus:outline-none min-h-[44px] min-w-0"
              />
            </div>
            
            <div className="hidden md:block w-px h-8 bg-slate-200 shrink-0"></div>
            
            {/* Category Custom Dropdown */}
            <div className="relative flex items-center px-1 md:px-2 min-h-[44px]" ref={dropdownRef}>
              <button 
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 md:gap-2 bg-transparent px-2 md:px-3 py-2 text-xs md:text-sm xl:text-base 2xl:text-lg text-slate-600 focus:outline-none cursor-pointer border-none min-h-[44px] shrink-0 hover:text-slate-900 transition-colors"
              >
                <span className="max-w-[80px] md:max-w-[120px] text-ellipsis overflow-hidden whitespace-nowrap">
                  {selectedCategory || "Categories"}
                </span>
                <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Panel */}
              {isDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-56 lg:w-64 z-50 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-2xl shadow-slate-900/15 p-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <ul className="flex flex-col gap-0.5">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory("");
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm xl:text-base font-medium rounded-xl transition-colors ${!selectedCategory ? 'text-[#009689] bg-teal-50/80' : 'text-slate-700 hover:bg-teal-50 hover:text-teal-700'}`}
                      >
                        <span>All Categories</span>
                        {!selectedCategory && <FiCheck className="w-4 h-4" />}
                      </button>
                    </li>
                    <div className="w-full h-px bg-slate-100 my-1"></div>
                    {categories.map((c) => (
                      <li key={c.name}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(c.name);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm xl:text-base font-medium rounded-xl transition-colors ${selectedCategory === c.name ? 'text-[#009689] bg-teal-50/80' : 'text-slate-700 hover:bg-teal-50 hover:text-teal-700'}`}
                        >
                          <div className="flex items-center gap-2">
                            <c.icon className="w-4 h-4 opacity-70" />
                            <span className="truncate">{c.name}</span>
                          </div>
                          {selectedCategory === c.name && <FiCheck className="w-4 h-4 shrink-0" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Search Action */}
            <button type="submit" className="flex items-center justify-center w-11 h-11 md:w-auto md:h-auto md:px-7 md:py-3 xl:px-8 xl:py-3.5 rounded-full bg-[#009689] hover:bg-[#238B81] text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/30 active:scale-95 shrink-0 md:min-h-[44px]">
              <FiSearch className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline text-sm xl:text-base 2xl:text-lg">Search</span>
            </button>
          </form>
        </div>

        {/* Right Side: Categories Grid */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end mt-8 lg:mt-0">
          <p className="text-sm xl:text-base 2xl:text-lg font-medium text-white/80 mb-4 lg:mb-6">Popular Categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 xl:gap-5 w-full lg:max-w-md xl:max-w-xl 2xl:max-w-3xl place-items-end">
            {categories.slice(0, 8).map((cat, index) => (
              <button 
                key={cat.name} 
                onClick={() => handleCategoryCardClick(cat.name)}
                style={{ animationDelay: `${index * 0.35}s` }}
                className="animate-float-wave group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-teal-400/60 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 cursor-pointer min-h-[88px] w-full xl:w-28 xl:h-24 2xl:w-36 2xl:h-28"
              >
                <cat.icon className="h-6 w-6 xl:w-6 xl:h-6 2xl:w-10 2xl:h-10 text-white mb-2 group-hover:text-teal-300 group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300" />
                <span className="text-center text-xs xl:text-xs 2xl:text-sm font-medium text-white/90 group-hover:text-white transition-colors line-clamp-1 w-full">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
