import axios from 'axios';
import { getSession } from 'next-auth/react';

// next-auth 세션 타입 확장
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

// 타입 정의
type AxiosInstance = ReturnType<typeof axios.create>;
interface RequestConfig {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
}

interface ApiError {
  response?: {
    status?: number;
    statusText?: string;
  };
  config?: RequestConfig;
  message?: string;
  code?: string;
  userMessage?: string;
}

/**
 * 프론트엔드 전용 Axios 인스턴스 싱글톤 클래스
 * 백엔드와 독립적으로 작동하는 API 클라이언트
 */
class FrontendAxiosInstance {
  private static instance: FrontendAxiosInstance;
  private axiosInstance: AxiosInstance;
  private readonly baseURL: string;
  private readonly timeout: number = 10000; // 10초

  private constructor() {
    // 환경에 따른 baseURL 설정
    this.baseURL =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.bogam.co.kr'
        : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * 싱글톤 인스턴스 반환
   */
  public static getInstance(): FrontendAxiosInstance {
    if (!FrontendAxiosInstance.instance) {
      FrontendAxiosInstance.instance = new FrontendAxiosInstance();
    }
    return FrontendAxiosInstance.instance;
  }

  /**
   * Axios 인스턴스 반환
   */
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * 인터셉터 설정 (next-auth 기반)
   */
  private setupInterceptors(): void {
    // 요청 인터셉터 - next-auth 세션을 사용한 인증
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          `[Frontend API Request] ${config.method?.toUpperCase()} ${
            (config as any).url
          }`
        );

        // Promise를 반환하여 비동기 처리
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.addAuthHeaders(config as any) as any;
      },
      (error: unknown) => {
        console.error('[Frontend API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(
          `[Frontend API Response] ${(response as { status: number }).status} ${
            (response as { config?: { url?: string } }).config?.url
          }`
        );
        return response;
      },
      (error: unknown) => {
        const apiError = error as ApiError;
        console.error('[Frontend API Response Error]', {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          url: apiError.config?.url,
          message: apiError.message,
        });

        // 에러 타입별 처리 (next-auth 기반)
        if (apiError.response?.status === 401) {
          // next-auth의 세션 만료 처리 (비동기로 실행)
          this.handleUnauthorized().catch(console.error);
        } else if (apiError.response?.status === 403) {
          // 권한 부족
          apiError.userMessage = '접근 권한이 없습니다.';
        } else if (apiError.response?.status === 404) {
          apiError.userMessage = '요청한 리소스를 찾을 수 없습니다.';
        } else if (
          apiError.response?.status &&
          apiError.response.status >= 500
        ) {
          apiError.userMessage =
            '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (apiError.code === 'ECONNABORTED') {
          apiError.userMessage =
            '요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.';
        }

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * 인증 헤더 추가 (비동기 처리)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async addAuthHeaders(config: any): Promise<any> {
    try {
      // next-auth 세션에서 토큰 가져오기
      const session = await getSession();
      if (session?.accessToken && config.headers) {
        (
          config.headers as Record<string, string>
        ).Authorization = `Bearer ${session.accessToken}`;
      }

      // CSRF 토큰이 필요한 경우 (선택사항)
      if (config.method !== 'get' && config.headers) {
        const csrfToken = await this.getCsrfToken();
        if (csrfToken) {
          (config.headers as Record<string, string>)['X-CSRF-Token'] =
            csrfToken;
        }
      }
    } catch (error) {
      console.warn('[Frontend API] 세션 정보를 가져올 수 없습니다:', error);
      // 세션이 없어도 요청은 계속 진행
    }

    return config;
  }

  /**
   * CSRF 토큰 가져오기 (next-auth 기반)
   */
  private async getCsrfToken(): Promise<string | null> {
    try {
      if (typeof window !== 'undefined') {
        const response = await fetch('/api/auth/csrf');
        const data = await response.json();
        return data.csrfToken || null;
      }
    } catch (error) {
      console.warn('[Frontend API] CSRF 토큰을 가져올 수 없습니다:', error);
    }
    return null;
  }

  /**
   * 인증 오류 처리 (next-auth 기반)
   */
  private async handleUnauthorized(): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        // next-auth의 signOut 사용
        const { signOut } = await import('next-auth/react');
        await signOut({
          redirect: false, // 자동 리다이렉트 비활성화
          callbackUrl: '/signin',
        });

        // 수동으로 로그인 페이지로 리다이렉트
        window.location.href = '/signin';
      } catch (error) {
        console.error('[Frontend API] 로그아웃 처리 중 오류:', error);
        // fallback: 수동으로 로그인 페이지로 이동
        window.location.href = '/signin';
      }
    }
  }

  /**
   * 현재 세션 상태 확인
   */
  public async isAuthenticated(): Promise<boolean> {
    try {
      const session = await getSession();
      return !!session?.user;
    } catch (error) {
      console.warn('[Frontend API] 세션 확인 중 오류:', error);
      return false;
    }
  }

  /**
   * 사용자 정보 가져오기
   */
  public async getUserInfo(): Promise<{
    user?: unknown;
    accessToken?: string;
  } | null> {
    try {
      const session = await getSession();
      return session
        ? { user: session.user, accessToken: session.accessToken }
        : null;
    } catch (error) {
      console.warn('[Frontend API] 사용자 정보 가져오기 실패:', error);
      return null;
    }
  }

  /**
   * 베이스 URL 반환
   */
  public getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * 타임아웃 설정
   */
  public setTimeout(timeout: number): void {
    this.axiosInstance.defaults.timeout = timeout;
  }

  /**
   * 헤더 설정
   */
  public setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * 헤더 제거
   */
  public removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  /**
   * 인스턴스 재설정 (테스트용)
   */
  public static resetInstance(): void {
    FrontendAxiosInstance.instance =
      undefined as unknown as FrontendAxiosInstance;
  }
}

// 싱글톤 인스턴스 내보내기
export const frontendAxiosInstance = FrontendAxiosInstance.getInstance();
export default frontendAxiosInstance;
