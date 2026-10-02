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
    <main className="min-h-screen bg-slate-50/60 relative overflow-hidden flex flex-col">
      <Navbar />

      <section className="flex-grow relative py-10 lg:py-14 overflow-hidden">
        {/* Subtle Brand Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gradient-to-b from-teal-500/8 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          
          {/* Header Block */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-[#009689] border border-teal-200/80 mb-3">
                {totalTasks} open tasks available
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Find the right <span className="text-[#009689]">micro-task</span> for you
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-2 leading-relaxed">
                Search open tasks, filter by category, and jump into a project that fits your skills.
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <TaskFilters categories={categories} initialSearch={search} initialCategory={category} />

          {(search || category) && (
            <p className="mt-4 text-sm text-slate-600">
              Showing results for <span className="font-semibold text-slate-900">{search || "all tasks"}</span>
              {category ? ` in ${category}` : ""}.
            </p>
          )}

          {error ? (
            <div className="mt-12 rounded-2xl border border-dashed border-rose-200 bg-rose-50 p-10 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-rose-800">Unable to load tasks</h2>
              <p className="mt-3 text-rose-600/80">
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
            <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">No tasks found</h2>
              <p className="mt-3 text-slate-600 max-w-md mx-auto">
                We couldn't find any tasks matching your current filters. Try a broader search or visit the homepage to see the latest opportunities.
              </p>
              <Link href="/browse-tasks" className="mt-6 inline-flex rounded-xl bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors border border-slate-200">
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