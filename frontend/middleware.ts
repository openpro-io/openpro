import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from 'next-runtime-env';

export function middleware(req: NextRequest) {
  // retrieve the current response
  const res = NextResponse.next();

  // TODO: Probably dont want to do '*'
  // if the incoming is for the desired API endpoint
  if (req.nextUrl.pathname === '/api/graphql') {
    res.headers.append('Access-Control-Allow-Credentials', 'true');
    res.headers.append(
      'Access-Control-Allow-Origin',
      env('NEXT_PUBLIC_NEXTAUTH_URL') ?? process.env.NEXTAUTH_URL ?? '*'
    );
    res.headers.append(
      'Access-Control-Allow-Methods',
      'GET,DELETE,PATCH,POST,PUT'
    );
    res.headers.append(
      'Access-Control-Allow-Headers',
      'Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, Apollo-Require-Preflight, Origin, X-Requested-With, Authorization'
    );
  } else {
    // generic CORS policy omitted for brevity....
  }

  return res;
}

// specify the path regex to apply the middleware to
export const config = {
  matcher: '/api/:path*',
};
