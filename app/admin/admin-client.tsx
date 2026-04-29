"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { PendingRequest, ApprovedColleague } from "@/lib/admin/actions";
import { approveCapgeminiRequest, declineCapgeminiRequest } from "@/lib/admin/actions";

function RelativeTime({ iso }: { iso: string }) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return <>{days} day{days !== 1 ? "s" : ""} ago</>;
  if (hours > 0) return <>{hours} hour{hours !== 1 ? "s" : ""} ago</>;
  return <>{Math.max(1, mins)} minute{mins !== 1 ? "s" : ""} ago</>;
}

function PendingRow({ request, onAction }: { request: PendingRequest; onAction: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveCapgeminiRequest(request.user_id);
      if (result.error) setError(result.error);
      else onAction();
    });
  };

  const handleDecline = () => {
    startTransition(async () => {
      const result = await declineCapgeminiRequest(request.user_id);
      if (result.error) {
        setError(result.error);
        setDialogOpen(false);
      } else {
        setDialogOpen(false);
        onAction();
      }
    });
  };

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 text-sm font-medium">{request.email}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        <RelativeTime iso={request.capgemini_requested_at} />
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          Pending
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-destructive">{error}</span>}
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isPending}
            className="h-7 gap-1 px-2.5 text-xs"
          >
            <Check className="h-3 w-3" />
            Approve
          </Button>
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger
              render={
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  className="h-7 gap-1 px-2.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <X className="h-3 w-3" />
                  Decline
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Decline and delete account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <strong>{request.email}</strong>&apos;s account.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDecline}
                  disabled={isPending}
                >
                  Delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
}

interface AdminDashboardClientProps {
  pending: PendingRequest[];
  approved: ApprovedColleague[];
  totalUsers: number;
}

export function AdminDashboardClient({ pending, approved, totalUsers }: AdminDashboardClientProps) {
  const router = useRouter();

  const handleAction = () => {
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: pending.length, color: "text-amber-600" },
          { label: "Approved", value: approved.length, color: "text-green-600" },
          { label: "Total users", value: totalUsers, color: "text-foreground" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Pending table */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pending requests
        </h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {pending.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No pending requests</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requested</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((r) => (
                  <PendingRow key={r.user_id} request={r} onAction={handleAction} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Approved table */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Approved colleagues
        </h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {approved.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No approved colleagues yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approved</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approved by</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((r) => (
                  <tr key={r.user_id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-sm font-medium">{r.email}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {r.capgemini_reviewed_at
                        ? new Date(r.capgemini_reviewed_at).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {r.reviewed_by_email ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
