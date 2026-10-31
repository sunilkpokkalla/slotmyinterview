import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { LeadsTable } from "@/components/admin/leads-table";

export const metadata = { title: "Admin | SlotMyInterview", robots: { index: false } };

export default async function AdminPage() {
  // The proxy only checks that you're signed in; role is enforced here and again in every admin action.
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") notFound();

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 1000 });

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-24 pb-16 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Badge className="bg-purple-100 text-purple-700 font-mono text-[10px] mb-2">
            <ShieldCheck className="w-3 h-3 mr-1" /> Admin
          </Badge>
          <h1 className="text-2xl font-extrabold">Homepage leads</h1>
          <p className="text-xs text-slate-500 mt-1">Email addresses captured by the homepage form.</p>
        </div>
        <LeadsTable leads={leads.map((l) => ({ id: l.id, email: l.email, source: l.source, status: l.status, createdAt: l.createdAt.toISOString() }))} />
      </div>
    </div>
  );
}
