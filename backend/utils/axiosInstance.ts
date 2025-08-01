import axios, { AxiosInstance } from 'axios';

/**
 * 공공데이터포털 API용 axios 인스턴스 싱글톤
 * 클린 아키텍처의 Infrastructure 레이어
 */
class PublicDataAxiosInstance {
  private static instance: AxiosInstance;
  private static readonly timeout: number = 30000; // 30초

  private constructor() {}

  /**
   * 싱글톤 인스턴스 반환
   * @returns axios 인스턴스
   */
  public static getInstance(): AxiosInstance {
    if (!PublicDataAxiosInstance.instance) {
      PublicDataAxiosInstance.instance = axios.create({
        timeout: PublicDataAxiosInstance.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Referer': 'https://www.data.go.kr/',
          'Origin': 'https://www.data.go.kr',
        },
      });

      // 요청 인터셉터 추가 (로깅용)
      PublicDataAxiosInstance.instance.interceptors.request.use(
        (config) => {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
          return config;
        },
        (error) => {
          console.error('[API Request Error]', error);
          return Promise.reject(error);
        }
      );

      // 응답 인터셉터 추가 (로깅용)
      PublicDataAxiosInstance.instance.interceptors.response.use(
        (response) => {
          console.log(`[API Response] ${response.status} ${response.config.url}`);
          return response;
        },
        (error) => {
          console.error('[API Response Error]', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            message: error.message,
          });
          return Promise.reject(error);
        }
      );
    }

    return PublicDataAxiosInstance.instance;
  }

  /**
   * 인스턴스 재설정 (테스트용)
   */
  public static resetInstance(): void {
    PublicDataAxiosInstance.instance = undefined as unknown as AxiosInstance;
  }
}

export default PublicDataAxiosInstance; 