"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/actions";
import { getUserProfile } from "@/lib/db/profile";
import { revalidatePath } from "next/cache";

export interface PendingRequest {
  user_id: string;
  email: string;
  capgemini_requested_at: string;
}

export interface ApprovedColleague {
  user_id: string;
  email: string;
  capgemini_reviewed_at: string | null;
  reviewed_by_email: string | null;
}

export interface AdminDashboardData {
  pending: PendingRequest[];
  approved: ApprovedColleague[];
  totalUsers: number;
}

function getAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createSupabaseClient(url, key);
}

async function assertAdmin(): Promise<string> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");
  const profile = await getUserProfile(user.id);
  if (!profile?.is_admin) throw new Error("Forbidden");
  return user.id;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  await assertAdmin();

  const supabase = await createClient();

  const [pendingResult, approvedResult, totalResult] = await Promise.all([
    supabase
      .from("user_profiles")
      .select("user_id, email, capgemini_requested_at")
      .eq("capgemini_status", "pending")
      .order("capgemini_requested_at", { ascending: true }),

    supabase
      .from("user_profiles")
      .select("user_id, email, capgemini_reviewed_at, capgemini_reviewed_by")
      .eq("capgemini_status", "approved")
      .order("capgemini_reviewed_at", { ascending: false }),

    supabase
      .from("user_profiles")
      .select("user_id", { count: "exact", head: true }),
  ]);

  // Resolve reviewer emails for approved colleagues
  const approvedRaw = (approvedResult.data ?? []) as {
    user_id: string;
    email: string;
    capgemini_reviewed_at: string | null;
    capgemini_reviewed_by: string | null;
  }[];

  const reviewerIds = [...new Set(
    approvedRaw
      .map((r) => r.capgemini_reviewed_by)
      .filter((id): id is string => id !== null)
  )];

  let reviewerEmailMap: Record<string, string> = {};
  if (reviewerIds.length > 0) {
    const { data: reviewerProfiles } = await supabase
      .from("user_profiles")
      .select("user_id, email")
      .in("user_id", reviewerIds);
    reviewerEmailMap = Object.fromEntries(
      (reviewerProfiles ?? []).map((p) => [p.user_id, p.email])
    );
  }

  return {
    pending: (pendingResult.data ?? []) as PendingRequest[],
    approved: approvedRaw.map((r) => ({
      user_id: r.user_id,
      email: r.email,
      capgemini_reviewed_at: r.capgemini_reviewed_at,
      reviewed_by_email: r.capgemini_reviewed_by
        ? (reviewerEmailMap[r.capgemini_reviewed_by] ?? null)
        : null,
    })),
    totalUsers: totalResult.count ?? 0,
  };
}

export async function approveCapgeminiRequest(targetUserId: string): Promise<{ error?: string }> {
  const adminId = await assertAdmin().catch(() => null);
  if (!adminId) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("user_profiles")
    .update({
      capgemini_status: "approved",
      capgemini_reviewed_at: new Date().toISOString(),
      capgemini_reviewed_by: adminId,
    })
    .eq("user_id", targetUserId)
    .eq("capgemini_status", "pending");

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return {};
}

export async function declineCapgeminiRequest(targetUserId: string): Promise<{ error?: string }> {
  const adminId = await assertAdmin().catch(() => null);
  if (!adminId) return { error: "Unauthorized" };

  const adminClient = getAdminSupabaseClient();
  const { error } = await adminClient.auth.admin.deleteUser(targetUserId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return {};
}
