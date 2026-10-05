import { requireRole, getServerSession } from "@/lib/session";
import ClientSidebar from "@/components/dashboard/ClientSidebar";

const ClientDashboardLayout = async ({ children }) => {
  await requireRole("client");
  const session = await getServerSession();
  const user = session?.user || null;

  return (
    <main className="min-h-screen bg-slate-50/70 text-slate-800 flex">
      <ClientSidebar user={user} />
      <div className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        {children}
      </div>
    </main>
  );
};

export default ClientDashboardLayout;