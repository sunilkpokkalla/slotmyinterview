import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getAuthUser } from "@/lib/server/auth";

export const metadata = { title: "Sign in | SlotMyInterview" };

export default async function LoginPage(props: PageProps<"/login">) {
  const sp = await props.searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  if (await getAuthUser()) redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");

  const initialError = sp.error === "confirmation_failed" ? "That confirmation link is invalid or has expired. Please sign in or sign up again." : undefined;

  return (
    <div className="min-h-[calc(100vh-80px)] pt-24 pb-16 flex items-center justify-center bg-ink-0 px-4 text-white">
      <LoginForm next={next} initialError={initialError} />
    </div>
  );
}
