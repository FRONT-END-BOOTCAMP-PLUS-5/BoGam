import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. API 경로 처리 - CORS
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    // Preflight
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  // 2. 인증 상태 확인
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  // 3. 로그인 사용자가 /signin, /signup 접근 시 /main으로 리디렉트
  if (isAuthenticated && (pathname === '/signin' || pathname === '/signup')) {
    const url = req.nextUrl.clone();
    url.pathname = '/main';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 👇 두 matcher 경로 모두 포함
export const config = {
  matcher: ['/api/:path*', '/signin', '/signup'],
};
