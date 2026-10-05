"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PlusCircle, Briefcase, FileText, CreditCard, LogOut, ArrowLeft } from "lucide-react";
import { signOut } from "@/lib/auth-client";

const navItems = [
  { href: "/dashboard/client", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/client/post-task", label: "Post Task", icon: PlusCircle },
  { href: "/dashboard/client/my-tasks", label: "My Tasks", icon: Briefcase, badge: "Live" },
  { href: "/dashboard/client/proposals", label: "Proposals", icon: FileText },
  { href: "/dashboard/client/payments", label: "Payments & Invoices", icon: CreditCard },
];

export default function ClientSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) => {
    if (href === "/dashboard/client") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const initials = (user?.name || "Client")
    .split(" ")
    .map((segment) => segment[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex flex-1 w-full h-full flex-col justify-between">
      <div>
        <div className="mb-8 px-2 flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#009689] uppercase bg-teal-50 px-2 py-0.5 rounded-md inline-block mb-1">
              WORKSPACE
            </span>
            <h2 className="text-sm font-extrabold text-slate-900 mt-1">Client Portal</h2>
          </div>
          
          {/* Back to Home Button */}
          <Link className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-all shadow-2xs group" href="/" title="Return to Main Website">
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform"/>
            <span>Home</span>
          </Link>
        </div>

        <nav className="flex flex-col space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "bg-[#009689] text-white shadow-sm shadow-teal-900/15 font-semibold rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-sm font-medium transition-all"
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-teal-50 text-[#009689] text-[11px] font-bold px-2 py-0.5 rounded-full ml-auto">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
        <div className="relative">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-[#009689]">
            {initials}
          </div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-sm font-bold text-slate-900">{user?.name || "Client"}</h3>
          <p className="truncate text-[11px] font-medium text-slate-500">Client Account</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
