import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. API 경로 처리 - CORS
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();

    // 요청의 Origin 가져오기
    const origin = req.headers.get('origin');

    // 허용할 도메인 목록
    const allowedOrigins = [
      'https://lion5-bogam.site',
      'https://www.lion5-bogam.site',
      'http://localhost:3000',
      'http://localhost:3001',
    ];

    // Origin이 허용 목록에 있는지 확인
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    // CORS 헤더 설정 - credentials가 포함된 요청이므로 구체적인 origin 사용
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      // 개발 환경에서는 모든 origin 허용 (credentials 없이)
      response.headers.set('Access-Control-Allow-Origin', '*');
      // credentials가 false인 경우에만 true 설정 가능
      response.headers.set('Access-Control-Allow-Credentials', 'false');
    }

    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name, X-User-Nickname, X-CSRF-Token'
    );
    response.headers.set('Access-Control-Max-Age', '86400');

    // Preflight 요청 처리
    if (req.method === 'OPTIONS') {
      const preflightResponse = new NextResponse(null, { status: 200 });

      if (isAllowedOrigin) {
        preflightResponse.headers.set('Access-Control-Allow-Origin', origin);
        preflightResponse.headers.set(
          'Access-Control-Allow-Credentials',
          'true'
        );
      } else {
        preflightResponse.headers.set('Access-Control-Allow-Origin', '*');
        preflightResponse.headers.set(
          'Access-Control-Allow-Credentials',
          'false'
        );
      }

      preflightResponse.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS, PATCH'
      );
      preflightResponse.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name, X-User-Nickname, X-CSRF-Token'
      );
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
    res.cookies.set('__Secure-next-auth.session-token', '', {
      maxAge: 0,
      path: '/',
    });
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
