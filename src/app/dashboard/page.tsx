import { redirect } from "next/navigation";
import { requireUserPage } from "@/lib/server/auth";
import { getProviderDashboard, getSeekerDashboard, getTaxonomy } from "@/lib/server/queries";
import { SeekerDashboard } from "@/components/dashboard/seeker-dashboard";
import { ProviderDashboard } from "@/components/dashboard/provider-dashboard";
import { publicEnv } from "@/lib/env";

export const metadata = { title: "Dashboard | SlotMyInterview" };

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const user = await requireUserPage("/dashboard");
  const sp = await props.searchParams;
  const tab = typeof sp.tab === "string" ? sp.tab : undefined;

  if (user.role === "ADMIN") redirect("/admin");

  if (user.role === "JOB_PROVIDER" && user.providerProfile) {
    const [data, taxonomy] = await Promise.all([getProviderDashboard(user.providerProfile.id, user.id), getTaxonomy()]);
    return <ProviderDashboard data={data} taxonomy={taxonomy} email={user.email} initialTab={tab} />;
  }

  if (user.seekerProfile) {
    const [data, taxonomy] = await Promise.all([getSeekerDashboard(user.seekerProfile.id), getTaxonomy()]);
    return (
      <SeekerDashboard
        data={data}
        taxonomy={taxonomy}
        email={user.email}
        initialTab={tab}
        webhookUrl={`${publicEnv.siteUrl}/api/webhooks/calcom/${user.seekerProfile.id}`}
      />
    );
  }

  throw new Error("Your account has no profile. Please contact support.");
}
