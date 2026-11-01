import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { getAuthUser } from "@/lib/server/auth";

export const metadata = { title: "Sign up | SlotMyInterview" };

export default async function SignupPage(props: PageProps<"/signup">) {
  if (await getAuthUser()) redirect("/dashboard");
  const sp = await props.searchParams;
  return (
    <div className="min-h-[calc(100vh-80px)] pt-24 pb-16 flex items-center justify-center bg-ink-0 px-4 text-white">
      <SignupForm initialType={sp.type === "employer" ? "employer" : "candidate"} />
    </div>
  );
}
