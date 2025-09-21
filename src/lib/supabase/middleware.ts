import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_API_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase API URL or key");
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes that require authentication
  const protectedRoutes = ["/new-post", "/post/*/edit"];
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.includes("*")) {
      // Handle wildcard routes like /post/*/edit
      const routePattern = route.replace("*", "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(request.nextUrl.pathname);
    }
    return request.nextUrl.pathname.startsWith(route);
  });

  // Allow access to public routes and auth pages
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                    request.nextUrl.pathname.startsWith("/signup");

  if (!user && isProtectedRoute && !isAuthPage) {
    // Redirect to login only for protected routes
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() you need to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object

  return supabaseResponse;
}