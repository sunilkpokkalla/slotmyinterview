import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getWaitlistByCode } from "@/app/actions/waitlist";

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const entry = await getWaitlistByCode(code);

  const title = entry 
    ? `${entry.fullName} invited you to SlotMyInterview VIP Access`
    : "SlotMyInterview VIP Priority Access";
  
  const description = entry?.username
    ? `Claimed /u/${entry.username} on SlotMyInterview. Skip resume screening with AST-verified code proof & direct interview slots. Use this link to jump 50 spots ahead in line!`
    : "The verified portfolio and interview marketplace. Watch elite AI engineers move from verified GitHub histories straight into your calendar. Join the founding waitlist.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/api/og/ticket?code=${code}&name=${encodeURIComponent(entry?.fullName || "Member")}`,
          width: 1200,
          height: 630,
          alt: "SlotMyInterview VIP Pass",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function JoinPage({ params }: Props) {
  const { code } = await params;
  // Redirect to homepage with referral code query param to activate priority boost
  redirect(`/#waitlist?ref=${encodeURIComponent(code)}`);
}
