import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TaskCard from "@/components/TaskCard";
import TaskPagination from "@/components/TaskPagination";
import TaskFilters from "@/components/TaskFilters";
import { fetchBrowseTasks } from "@/lib/api";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BrowseTasksPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";
  const page = Number.parseInt(typeof params.page === "string" ? params.page : "1", 10);

  let response = null;
  let error = null;

  try {
    response = await fetchBrowseTasks({ search, category, page, limit: 12 });
  } catch (err) {
    error = err?.message || "Unable to load tasks from the database.";
  }

  const tasks = Array.isArray(response?.data) ? response.data : [];
  const totalTasks = response?.pagination?.totalTasks ?? tasks.length;
  const totalPages = response?.pagination?.totalPages ?? 1;
  const currentPage = response?.pagination?.page ?? 1;
  const categories = Array.isArray(response?.categories) ? response.categories : [];

  return (
    <main className="min-h-screen bg-[#0B1320] text-slate-100 flex flex-col">
      <Navbar />

      <section className="flex-grow relative pt-12 pb-24 overflow-hidden">
        {/* Ambient Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#009689]/15 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          
          {/* Header Section */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold px-3 py-1 rounded-full">
                  {totalTasks} open tasks available
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                Find the right <span className="text-[#009689]">micro-task</span> for you
              </h1>
              <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-400">
                Search open tasks, filter by category, and jump into a project that fits your skills.
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <TaskFilters categories={categories} initialSearch={search} initialCategory={category} />

          {(search || category) && (
            <p className="mt-4 text-sm text-slate-400">
              Showing results for <span className="font-semibold text-white">{search || "all tasks"}</span>
              {category ? ` in ${category}` : ""}.
            </p>
          )}

          {error ? (
            <div className="mt-12 rounded-2xl border border-dashed border-rose-800/50 bg-rose-950/20 p-10 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-white">Unable to load tasks</h2>
              <p className="mt-3 text-slate-400">
                {error}
              </p>
            </div>
          ) : tasks.length ? (
            <>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard key={task._id.toString()} task={task} />
                ))}
              </div>

              <div className="mt-16">
                <TaskPagination currentPage={currentPage} totalPages={totalPages} />
              </div>
            </>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">No tasks found</h2>
              <p className="mt-3 text-slate-400 max-w-md mx-auto">
                We couldn't find any tasks matching your current filters. Try a broader search or visit the homepage to see the latest opportunities.
              </p>
              <Link href="/browse-tasks" className="mt-6 inline-flex rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}