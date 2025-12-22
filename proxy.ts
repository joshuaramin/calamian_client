import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  //   const apkey: any = process.env.NEXT_PUBLIC_X_API_KEY;
  const authToken = req.cookies.get("pha_tkn");

  const requestHeaders = new Headers(req.headers);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (!authToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return response;
}

export const config = {
  matcher: "/dashboard/:path*",
};
