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
    <section className="mt-20">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-900">Feature  <span className="text-[#009689]">Services</span></h2>
        <p className="mt-3 text-slate-600">
          Discover our featured services designed to elevate your experience
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-b border-slate-200 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold transition-all ${
              activeTab === tab
                ? "border-b-2 border-[#009689] text-slate-900 pb-[18px] -mb-[18px]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.slice(0, 6).map((task, i) => (
            <Link 
              key={task._id} 
              href={`/task/${task._id}`} 
              className="group block"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-teal-100 bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:border-teal-300 hover:shadow-md">
                {/* Image Box */}
                <div className="relative h-48 w-full bg-slate-100">
                  <img
                    src={task.imageUrl || "https://placehold.co/600x400/e2e8f0/64748b?text=Service"}
                    alt={task.title}
                    className="h-full w-full object-cover"
                  />
                  <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow backdrop-blur transition hover:bg-white hover:text-rose-500">
                    <FiHeart className="h-4 w-4" />
                  </button>
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

                  <h3 className="mt-3 line-clamp-2 text-base font-bold text-slate-900 transition group-hover:text-[#009689]">
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
                      <span className="text-xs font-medium text-slate-700">
                        {task.client?.name || "Client"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      From <strong className="text-sm font-bold text-slate-900">${task.budget}</strong>
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
