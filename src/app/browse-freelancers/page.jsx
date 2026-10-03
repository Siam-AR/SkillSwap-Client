import Link from "next/link";
import { ShieldCheck, Star, CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TaskPagination from "@/components/TaskPagination";
import FreelancerFilters from "@/components/FreelancerFilters";
import { fetchBrowseFreelancers } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BrowseFreelancersPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const search = typeof params.search === "string" ? params.search : "";
  const page = Number.parseInt(typeof params.page === "string" ? params.page : "1", 10);
  const skill = typeof params.skill === "string" ? params.skill : "";
  const sort = typeof params.sort === "string" ? params.sort : "";

  let response = null;
  let error = null;

  try {
    response = await fetchBrowseFreelancers({ search, page, limit: 8, skill, sort });
  } catch (err) {
    error = err?.message || "Unable to load freelancers from the database.";
  }

  const freelancers = Array.isArray(response?.data) ? response.data : [];
  const totalFreelancers = response?.pagination?.totalFreelancers ?? freelancers.length;
  const totalPages = response?.pagination?.totalPages ?? 1;
  const currentPage = response?.pagination?.page ?? 1;

  return (
    <main className="min-h-screen bg-slate-50/70 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-48 bg-gradient-to-b from-teal-500/8 to-transparent blur-3xl pointer-events-none -z-10" />
      <Navbar />

      <section className="flex-grow py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-[#009689] border border-teal-200/80 mb-3">
              TALENT DIRECTORY
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Meet skilled <span className="text-[#009689]">freelancers</span> ready to work
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-2 leading-relaxed">
              Browse freelancer profiles, review their skills, and open their full profile to see past work and hire them for your next task.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-semibold shadow-sm">
              {totalFreelancers} freelancer{totalFreelancers === 1 ? "" : "s"} available
            </div>
          </div>

          {/* Filter & Search Bar */}
          <FreelancerFilters />

          {error ? (
            <div className="mt-10 rounded-[2rem] border border-dashed border-rose-300 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Unable to load freelancers</h2>
              <p className="mt-3 text-slate-600">{error}</p>
            </div>
          ) : freelancers.length ? (
            <>
              {/* Freelancers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {freelancers.map((freelancer) => (
                  <div key={freelancer._id} className="group bg-white rounded-3xl border border-slate-200/90 hover:border-[#009689] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-teal-900/10 hover:-translate-y-1">
                    <div>
                      {/* 1. Top Badges: Availability Status & Pricing/Rate */}
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Available
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {freelancer.hourlyRate ? `$${freelancer.hourlyRate}/hr` : "Negotiable"}
                        </span>
                      </div>

                      {/* 2. Identity Row: Avatar with Teal Ring & Verified Badge + Name/Role */}
                      <div className="flex items-center gap-3.5 mb-5">
                        <div className="relative shrink-0">
                          {freelancer.image || freelancer.avatar ? (
                            <img
                              src={freelancer.image || freelancer.avatar}
                              alt={freelancer.name}
                              className="w-16 h-16 rounded-full object-cover p-0.5 border-2 border-[#009689]"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full p-0.5 border-2 border-[#009689] flex items-center justify-center bg-slate-50">
                              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#009689] to-[#2CA99F] flex items-center justify-center text-white font-bold text-xl shadow-inner">
                                {(freelancer.name || "F").charAt(0).toUpperCase()}
                              </div>
                            </div>
                          )}
                          {/* Teal Verification Checkmark Badge */}
                          <div className="absolute -bottom-1 -right-0.5 w-5 h-5 rounded-full bg-[#009689] border-2 border-white flex items-center justify-center text-white shadow-sm">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 group-hover:text-[#009689] transition-colors text-base sm:text-lg truncate">
                            {freelancer.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">
                            {freelancer.designation || "\u00A0"}
                          </p>
                        </div>
                      </div>

                      {/* 3. Rating & Orders Metric Strip */}
                      <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center justify-between text-xs mb-5 border border-slate-100">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <span className="text-amber-500">★</span>
                          <span>{freelancer.rating ? Number(freelancer.rating).toFixed(0) : "5"}</span>
                          <span className="text-slate-400 font-normal">
                            ({freelancer.reviewCount || freelancer.reviews?.length || 1})
                          </span>
                        </div>
                        <div className="text-slate-500 font-medium">
                          {freelancer.finishedJobs || freelancer.completedOrders || freelancer.completedTasks || 1} order{freelancer.finishedJobs === 1 || freelancer.completedOrders === 1 || freelancer.completedTasks === 1 ? "" : "s"}
                        </div>
                      </div>

                      {/* 4. Skill Tags / Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-6 min-h-[58px]">
                        {(freelancer.skills?.length
                          ? freelancer.skills.slice(0, 4)
                          : ["Web Development", "React", "Next.js"]
                        ).map((skill, i) => (
                          <span
                            key={i}
                            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200/80"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 5. Footer CTA Button */}
                    <Link 
                      href={`/freelancer/${freelancer._id}`} 
                      className="w-full py-2.5 px-4 rounded-xl bg-teal-50/80 group-hover:bg-[#009689] text-[#009689] group-hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm"
                    >
                      View Profile
                      <span className="text-sm font-bold group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <TaskPagination currentPage={currentPage} totalPages={totalPages} basePath="/browse-freelancers" />
              </div>
            </>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">No freelancers match your search</h2>
              <p className="mt-3 text-slate-600">
                Try a broader search or clear your filters to see available talent.
              </p>
              <Link href="/browse-freelancers" className="mt-6 inline-flex rounded-2xl bg-[#009689] hover:bg-[#238B81] px-5 py-3 text-sm font-semibold text-white transition-colors">
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}