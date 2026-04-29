import { getUser } from "@/lib/supabase/actions";
import { hasFullAccess } from "@/lib/stripe/subscription";
import { getUserProfile } from "@/lib/db/profile";
import { UserNavClient } from "./user-nav-client";

export async function UserNav() {
  const user = await getUser();

  if (!user) {
    return <UserNavClient user={null} isFullAccess={false} isAdmin={false} />;
  }

  const [fullAccess, profile] = await Promise.all([
    hasFullAccess(user.id),
    getUserProfile(user.id),
  ]);

  return (
    <UserNavClient
      user={{ email: user.email || "" }}
      isFullAccess={fullAccess}
      isAdmin={profile?.is_admin ?? false}
    />
  );
}
