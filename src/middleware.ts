import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('--Login url is triggered--');
  return NextResponse.redirect(new URL('/login', request.url));
}
export const config = {
  matcher: ['/'],
};
