import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default async function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/studio')) {
    const { userId, orgMemberships } = auth(req);
    
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    const isOrgMember = orgMemberships?.some(
      m => m.organization.id === process.env.ALLOWED_ORG_ID
    );

    if (!isOrgMember) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/studio/:path*'],
};
