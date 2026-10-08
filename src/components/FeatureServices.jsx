"use client";

import { useState } from "react";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const TABS = ["Development", "Graphic & Design", "Digital Marketing", "Writing"];

export default function FeatureServices({ tasks }) {
  const [activeTab, setActiveTab] = useState("Development");

  const filteredTasks = tasks.filter((task) => {
    // Map existing categories to tabs
    if (activeTab === "Graphic & Design" && task.category === "Design") return true;
    if (activeTab === "Development" && task.category === "Development") return true;
    if (activeTab === "Writing" && task.category === "Writing") return true;
    if (activeTab === "Digital Marketing" && task.category === "Marketing") return true;
    return task.category === activeTab;
  });

  return (
    <section className="mt-12 md:mt-20 w-full max-w-[1500px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 2xl:px-16">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">Feature <span className="text-[#009689]">Services</span></h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Discover our featured services designed to elevate your experience
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-row flex-nowrap md:flex-wrap items-center justify-start md:justify-center overflow-x-auto md:overflow-visible gap-4 md:gap-6 border-b border-slate-200 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold whitespace-nowrap transition-all min-h-[44px] flex items-center justify-center px-2 ${
              activeTab === tab
                ? "border-b-2 border-[#009689] text-slate-900"
                : "text-slate-500 lg:hover:text-slate-900 border-b-2 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 2xl:gap-10 w-full">
        {filteredTasks.length > 0 ? (
          filteredTasks.slice(0, 6).map((task, i) => (
            <Link 
              key={task._id} 
              href={`/task/${task._id}`} 
              className="group block"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-teal-100 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-900/5 hover:border-teal-500/40">
                {/* Image Box */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <img
                    src={task.imageUrl || "https://placehold.co/600x400/e2e8f0/64748b?text=Service"}
                    alt={task.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {task.category || "General"}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                      {task.client?.reviewCount > 0 ? (
                        <>
                          <FaStar className="text-amber-400" /> {task.client.rating} <span className="text-slate-400">({task.client.reviewCount})</span>
                        </>
                      ) : (
                        <span className="text-slate-400 font-normal">No reviews yet</span>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-base md:text-lg font-bold text-slate-900 transition lg:group-hover:text-[#009689]">
                    {task.title}
                  </h3>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 overflow-hidden rounded-full bg-slate-200">
                        <img
                          src={task.client?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.client?.name || "Client"}`}
                          alt={task.client?.name || "Client"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-slate-700 line-clamp-1">
                        {task.client?.name || "Client"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap pl-2">
                      From <strong className="text-sm md:text-base font-bold text-slate-900">${task.budget}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-slate-500">
            No feature services found for this category.
          </div>
        )}
      </div>
    </section>
  );
}
