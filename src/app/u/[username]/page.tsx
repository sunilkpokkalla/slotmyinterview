import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileLayout, type ProfileViewer } from "@/components/profile/profile-layout";
import { getPublicProfile } from "@/lib/server/queries";
import { getCurrentUser } from "@/lib/server/auth";

export async function generateMetadata(props: PageProps<"/u/[username]">): Promise<Metadata> {
  const { username } = await props.params;
  const candidate = await getPublicProfile(username);
  if (!candidate) return { title: "Profile not found | SlotMyInterview" };
  return {
    title: `${candidate.name} | SlotMyInterview`,
    description: candidate.headline || `Book an interview with ${candidate.name}`,
  };
}

export default async function PublicProfilePage(props: PageProps<"/u/[username]">) {
  const { username } = await props.params;
  const [candidate, user] = await Promise.all([getPublicProfile(username), getCurrentUser()]);
  if (!candidate) notFound();

  const viewer: ProfileViewer = {
    isSignedIn: Boolean(user),
    isOwner: Boolean(user?.seekerProfile && user.seekerProfile.id === candidate.id),
    isRecruiter: user?.role === "JOB_PROVIDER",
    name: user?.providerProfile?.companyName ?? user?.seekerProfile?.fullName,
    email: user?.email,
  };

  // Contact email is only for the owner. Recruiters book through the candidate's calendar instead,
  // so open sign-ups can't be used to harvest addresses.
  const visibleCandidate = viewer.isOwner ? candidate : { ...candidate, email: "" };

  return <ProfileLayout candidate={visibleCandidate} viewer={viewer} />;
}
