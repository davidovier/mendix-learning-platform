import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getUser } from "@/lib/supabase/actions";
import { getUserProfile } from "@/lib/db/profile";
import { getAdminDashboardData } from "@/lib/admin/actions";
import { AdminDashboardClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await getUserProfile(user.id);
  if (!profile?.is_admin) redirect("/");

  const data = await getAdminDashboardData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage Capgemini colleague access requests
            </p>
          </div>
        </div>

        <AdminDashboardClient
          pending={data.pending}
          approved={data.approved}
          totalUsers={data.totalUsers}
        />
      </div>
    </div>
  );
}
