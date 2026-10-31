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
    <div className="min-h-[calc(100vh-80px)] mt-20 flex items-center justify-center bg-[#f8f9fc] p-4 text-slate-900">
      <LoginForm next={next} initialError={initialError} />
    </div>
  );
}
