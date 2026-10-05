"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, FileText, Briefcase, DollarSign, User, LogOut, Menu, X, ArrowLeft } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import Image from "next/image";

const navItems = [
  { href: "/dashboard/freelancer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/freelancer/my-proposals", label: "My Proposals", icon: FileText },
  { href: "/dashboard/freelancer/active-projects", label: "Active Projects", icon: Briefcase },
  { href: "/dashboard/freelancer/earnings", label: "Earnings & Payouts", icon: DollarSign },
];

export default function FreelancerSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/dashboard/freelancer") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const sidebarContent = (
    <div className="flex flex-1 w-full h-full flex-col justify-between">
      <div>
        <div className="mb-8 px-2 flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#009689] uppercase bg-teal-50 px-2 py-0.5 rounded-md inline-block mb-1">
              WORKSPACE
            </span>
            <h2 className="text-sm font-extrabold text-slate-900 mt-1">Freelancer Portal</h2>
          </div>
          
          {/* Back to Home Button */}
          <Link className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-all shadow-2xs group" href="/" title="Return to Main Website">
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform"/>
            <span>Home</span>
          </Link>
        </div>

        {/* Navigation Links Group */}
        <nav className="flex flex-col space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-[#009689] text-white shadow-sm shadow-teal-900/15 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card & Action */}
      <div className="mt-8">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#009689] bg-sky-100 text-sky-700">
                {user?.image ? (
                  <Image src={user.image} alt={user.name} width={36} height={36} className="h-full w-full object-cover" unoptimized />
                ) : (
                  <span className="text-sm font-bold">{avatarInitial}</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "User"}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold truncate">{user?.role || "Freelancer"}</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden p-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
      </div>

      <aside className="hidden w-64 xl:w-72 shrink-0 border-r border-slate-200/80 bg-white h-screen p-5 lg:flex flex-col justify-between sticky top-0 overflow-y-auto">
        {sidebarContent}
      </aside>

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)}>
          <div className="h-full w-72 bg-white p-5 shadow-2xl flex flex-col justify-between transform transition-transform duration-300" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-[#009689] uppercase bg-teal-50 px-2 py-0.5 rounded-md inline-block">
                WORKSPACE
              </span>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
