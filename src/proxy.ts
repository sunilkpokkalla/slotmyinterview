import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

/**
 * Refreshes the Supabase session cookie on every matched request and keeps signed-out users
 * away from private pages. Role checks still happen inside each page and Server Action.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  if (!user && PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  // Skip static assets, images and the Cal.com webhook (it authenticates with its own signature).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)"],
};
