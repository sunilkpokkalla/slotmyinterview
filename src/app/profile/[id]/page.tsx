import { notFound, permanentRedirect } from "next/navigation";
import { prisma } from "@/lib/server/prisma";

/** Legacy /profile/:id links: send them to the canonical /u/:username page. */
export default async function LegacyProfilePage(props: PageProps<"/profile/[id]">) {
  const { id } = await props.params;
  const profile = /^[0-9a-f-]{36}$/i.test(id)
    ? await prisma.seekerProfile.findUnique({ where: { id }, select: { username: true } })
    : await prisma.seekerProfile.findUnique({ where: { username: id.toLowerCase() }, select: { username: true } });
  if (!profile) notFound();
  permanentRedirect(`/u/${profile.username}`);
}
