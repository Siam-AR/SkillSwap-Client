import Link from "next/link";
import Image from "next/image";
import { FiStar } from "react-icons/fi";
import { Card } from "@heroui/react";

export default function TopFreelancers({ freelancers }) {
  return (
    <section className="mt-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#009689]">
            Top Freelancers
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Hire top rated talent
          </h2>
        </div>
        <a
          href="/browse-freelancers"
          className="text-sm font-semibold text-[#009689] transition hover:text-teal-500"
        >
          Browse freelancers &rarr;
        </a>
      </div>
    {/* Grid */}
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
  {freelancers.map((freelancer) => (
    <Link key={freelancer.email} href={`/freelancer/${freelancer._id || freelancer.email}`} className="block h-full">
      <Card
        className="
          group h-full min-w-0
          rounded-2xl
          border border-teal-100/80
          bg-white/90 backdrop-blur-sm
          p-5
          shadow-md hover:shadow-lg
          transition-all duration-300
          hover:-translate-y-1
          hover:border-teal-300
        "
      >
      {/* Top */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="rounded-full bg-gradient-to-br from-teal-400 via-[#009689] to-teal-600 p-[2px]">
          <div className="relative h-14 w-14 overflow-hidden rounded-full bg-slate-100">
            {freelancer.image ? (
              <Image
                src={freelancer.image}
                alt={freelancer.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-lg font-bold text-slate-700">
                {freelancer.name?.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {freelancer.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Available for work
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {freelancer.skills?.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          <FiStar className="h-3.5 w-3.5 fill-current" />
          {freelancer.rating || 0}
          <span className="opacity-70">
            ({freelancer.reviewCount})
          </span>
        </div>

        <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-[#009689]">
          {freelancer.finishedJobs} jobs
        </div>
      </div>
      </Card>
    </Link>
  ))}
</div>
    </section>
  );
}