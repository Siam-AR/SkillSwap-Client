import ClientSidebar from "@/components/dashboard/ClientSidebar";
import { getServerSession, requireRole } from "@/lib/session";

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
          {children}
        </main>
      </div>
    </div>
  );
}