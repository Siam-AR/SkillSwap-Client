"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CreditCard, 
  LogOut, 
  Menu, 
  X,
  Home
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

const navItems = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/manage-tasks", label: "Manage Tasks", icon: Briefcase },
  { href: "/dashboard/admin/transactions", label: "Transactions & Escrow", icon: CreditCard },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/dashboard/admin") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const initials = (user?.name || "Taskify Admin")
    .split(" ")
    .map((segment) => segment[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Workspace Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#009689] uppercase bg-teal-50 px-2 py-0.5 rounded-md inline-block">
            WORKSPACE
          </span>
          <h2 className="text-sm font-extrabold text-slate-900 mt-1">
            Admin Portal
          </h2>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-xl transition-colors"
          title="Exit to Website"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>

      {/* Navigation Group */}
      <nav className="space-y-1.5 mt-8 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                active
                  ? "bg-[#009689] text-white font-semibold shadow-sm shadow-teal-900/15"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom User/Admin Card */}
      <div className="mt-auto p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-[#009689] font-bold text-xs">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {user?.name || "Taskify Admin"}
            </h3>
            <p className="text-xs text-slate-500 capitalize truncate">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle (Only visible if the parent layout shows it, otherwise hidden by layout) */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
      </div>

      {/* Desktop sidebar is handled by the layout injection */}
      <div className="hidden lg:contents">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="absolute left-0 top-0 h-full w-72 bg-white p-5 shadow-2xl flex flex-col" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
