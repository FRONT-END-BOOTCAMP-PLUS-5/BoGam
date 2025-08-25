import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. API 경로 처리 - CORS
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // CORS 헤더 설정
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name'
    );
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');

    // Preflight 요청 처리
    if (req.method === 'OPTIONS') {
      const preflightResponse = new NextResponse(null, { status: 200 });
      preflightResponse.headers.set('Access-Control-Allow-Origin', '*');
      preflightResponse.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS, PATCH'
      );
      preflightResponse.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name'
      );
      preflightResponse.headers.set('Access-Control-Allow-Credentials', 'true');
      preflightResponse.headers.set('Access-Control-Max-Age', '86400');
      
      return preflightResponse;
    }

    return response;
  }

  // 2. 인증 상태 확인
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  // 3. 공개 경로 (비인증 허용)
  const publicPaths = new Set<string>(['/', '/signin', '/signup']);
  const isPublicPath = publicPaths.has(pathname);

  // 4. 로그인 사용자가 /signin, /signup 접근 시 /main으로 리디렉트
  if (isAuthenticated && (pathname === '/signin' || pathname === '/signup')) {
    const url = req.nextUrl.clone();
    url.pathname = '/main';
    return NextResponse.redirect(url);
  }

  // 5. 미로그인 사용자가 보호된 페이지 접근 시 '/' 으로 리디렉트 + 쿠키/상태 힌트
  if (!isAuthenticated && !isPublicPath) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    const res = NextResponse.redirect(url);

    // next-auth 쿠키 제거 (개발/프로덕션 모두 대응)
    res.cookies.set('next-auth.session-token', '', { maxAge: 0, path: '/' });
    res.cookies.set('__Secure-next-auth.session-token', '', { maxAge: 0, path: '/' });
    res.cookies.set('next-auth.csrf-token', '', { maxAge: 0, path: '/' });
    res.cookies.set('app-step', 'auth', { path: '/', maxAge: 60 });

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    // 정적 리소스 경로를 제외한 모든 경로에 미들웨어 실행
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
};
