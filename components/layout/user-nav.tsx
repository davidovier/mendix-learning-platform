import { getUser } from "@/lib/supabase/actions";
import { isProUser } from "@/lib/stripe/subscription";
import { UserNavClient } from "./user-nav-client";

export async function UserNav() {
  const user = await getUser();

  if (!user) {
    return <UserNavClient user={null} isPro={false} />;
  }

  const isPro = await isProUser(user.id);

  return <UserNavClient user={{ email: user.email || "" }} isPro={isPro} />;
}
