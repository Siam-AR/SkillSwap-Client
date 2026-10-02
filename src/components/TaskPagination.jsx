"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TaskPagination({ currentPage, totalPages, basePath = "/browse-tasks" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);

    const params = new URLSearchParams(searchParams.toString());

    if (nextPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const query = params.toString();
    const targetUrl = `${basePath}${query ? `?${query}` : ""}`;

    router.push(targetUrl, { scroll: false });
    router.refresh();
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className={`flex items-center justify-center gap-1 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          page === 1
            ? "bg-slate-900/40 text-slate-600 cursor-not-allowed border border-slate-800/50"
            : "bg-slate-900 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 hover:bg-slate-800"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2 mx-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-semibold transition-all ${
              p === page
                ? "bg-[#009689] text-white shadow-md shadow-teal-900/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className={`flex items-center justify-center gap-1 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          page === totalPages
            ? "bg-slate-900/40 text-slate-600 cursor-not-allowed border border-slate-800/50"
            : "bg-slate-900 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 hover:bg-slate-800"
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
