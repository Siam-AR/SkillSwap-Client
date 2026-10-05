import ClientSidebar from "@/components/dashboard/ClientSidebar";
import { getServerSession, requireRole } from "@/lib/session";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ClientDashboardLayout({ children }) {
  await requireRole("client");
  const session = await getServerSession();
  const user = session?.user || null;

  return (
    <div className="min-h-screen bg-slate-50/70 flex">
      {/* Persistent Left Sidebar */}
      <aside className="flex w-64 shrink-0 border-r border-slate-200/80 bg-white min-h-screen sticky top-0 flex-col justify-between p-5 z-30">
        <ClientSidebar user={user} />
      </aside>

      {/* Main Workspace Canvas */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto space-y-8">
          <div className="flex items-center justify-between lg:hidden pb-4 mb-4 border-b border-slate-200/80">
            <Link className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900" href="/">
              <ArrowLeft className="w-4 h-4"/>
              <span>Back to Taskify</span>
            </Link>
            <span className="text-xs font-bold text-[#009689]">Workspace</span>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}