import { TaxCertRepository } from '@be/domain/repository/TaxCertRepository';
import {
  GetTaxCertRequestDto,
  BaseTaxCertRequest,
  TaxCertTwoWayRequest,
} from '../dtos/GetTaxCertRequestDto';
import { GetTaxCertResponseDto, CodefResponse } from '../dtos/GetTaxCertResponseDto';

/**
 * 납세증명서 조회 Usecase
 * 클린 아키텍처의 Application 레이어
 * 2-way 인증을 포함한 복잡한 납세증명서 발급 로직 처리
 */
export class GetTaxCertUsecase {
  constructor(private taxCertRepository: TaxCertRepository) {}

  async getTaxCert(
    request: GetTaxCertRequestDto
  ): Promise<GetTaxCertResponseDto> {
    const startTime = Date.now();
    const requestId = `usecase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🚀 [${requestId}] GetTaxCertUsecase 시작`);
    console.log(request);
    console.log(`📝 [${requestId}] 요청 데이터 분석:`, request);

    try {
      let response: any;

      // 2-way 인증 요청인지 확인
      const isTwoWay = this.isTwoWayRequest(request);
      console.log(`🔍 [${requestId}] 2-way 인증 요청 여부: ${isTwoWay}`);

      if (isTwoWay) {
        // 추가인증 요청
        console.log(`⏳ [${requestId}] 2-way 인증 요청 처리 시작`);
        const twoWayRequest = request as TaxCertTwoWayRequest;
        console.log(`📋 [${requestId}] 2-way 인증 요청 상세:`, {
          jobIndex: twoWayRequest.twoWayInfo?.jobIndex,
          threadIndex: twoWayRequest.twoWayInfo?.threadIndex,
          jti: twoWayRequest.twoWayInfo?.jti,
          twoWayTimestamp: twoWayRequest.twoWayInfo?.twoWayTimestamp,
          simpleAuth: twoWayRequest.simpleAuth,
          hasSignedData: !!twoWayRequest.signedData,
          hasExtraInfo: !!twoWayRequest.extraInfo
        });
        
        const codefResponse = await this.taxCertRepository.requestTaxCertTwoWay(
          twoWayRequest
        );
        response = { 
          success: true, 
          message: '2-way 인증 요청 완료', 
          data: codefResponse 
        };
        console.log(`✅ [${requestId}] 2-way 인증 요청 완료`);
      } else {
        // 기본 요청
        console.log(`🌐 [${requestId}] 기본 납세증명서 요청 처리 시작`);
        const baseRequest = request as BaseTaxCertRequest;
        
        const codefResponse = await this.taxCertRepository.requestTaxCert(baseRequest);
        response = { 
          success: true, 
          message: '기본 요청 완료', 
          data: codefResponse 
        };
        console.log(`✅ [${requestId}] 기본 요청 완료`, codefResponse);
        
        // response 객체 구조 상세 분석
        console.log(`🔍 [${requestId}] response 객체 구조 분석:`, {
          responseType: typeof response,
          responseKeys: response ? Object.keys(response) : [],
          hasData: !!response?.data,
          dataType: typeof response?.data,
          dataKeys: response?.data ? Object.keys(response.data) : [],
          hasResult: !!response?.data?.result,
          hasDataData: !!response?.data?.data,
          resultCode: response?.data?.result?.code,
          continue2Way: (response?.data?.data as any)?.continue2Way,
          method: (response?.data?.data as any)?.method
        });
      }

      const duration = Date.now() - startTime;
      
      // 응답 데이터 분석
      console.log(`📊 [${requestId}] 응답 데이터 분석:`, response.data);

      // 2-way 인증 필요 여부 확인
      const requiresTwoWay = this.requiresTwoWayAuth(response);
      if (requiresTwoWay) {
        console.log(`⏳ [${requestId}] 2-way 인증이 필요합니다`);
        const twoWayInfo = this.extractTwoWayInfo(response);
        if (twoWayInfo) {
          console.log(`📋 [${requestId}] 2-way 인증 정보:`, twoWayInfo);
        }
      }

      console.log(`✅ [${requestId}] GetTaxCertUsecase 성공 완료 (${duration}ms)`);
      console.log("response@@@@@", response);
      return {
        success: true,
        message: '납세증명서 조회 요청이 완료되었습니다.',
        data: response.data,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error(`💥 [${requestId}] GetTaxCertUsecase 예외 발생:`, {
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined,
        requestType: this.isTwoWayRequest(request) ? '2-way' : '기본',
        organization: request.organization,
        loginType: request.loginType
      });

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '납세증명서 CODEF API 호출 중 오류가 발생했습니다.',
        duration,
      };
    } finally {
      const totalDuration = Date.now() - startTime;
      console.log(`🏁 [${requestId}] GetTaxCertUsecase 종료 (총 소요시간: ${totalDuration}ms)`);
    }
  }

  /**
   * 2-way 인증 필요 여부 확인
   */
  requiresTwoWayAuth(response: any): boolean {
    const hasErrorCode = response.data?.result?.code === 'CF-03002';
    const hasContinue2Way =
      response.data?.data &&
      'continue2Way' in response.data.data &&
      (response.data.data as { continue2Way?: boolean }).continue2Way === true;

    return hasErrorCode || Boolean(hasContinue2Way);
  }

  /**
   * 2-way 인증 정보 추출
   */
  extractTwoWayInfo(response: any): {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
    method?: string;
    extraInfo?: Record<string, unknown>;
  } | null {
    const data = response.data?.data;
    if (!data || !('continue2Way' in data)) {
      return null;
    }

    const twoWayData = data as {
      jobIndex?: number;
      threadIndex?: number;
      jti?: string;
      twoWayTimestamp?: number;
      method?: string;
      extraInfo?: Record<string, unknown>;
    };

    if (
      typeof twoWayData.jobIndex === 'number' &&
      typeof twoWayData.threadIndex === 'number' &&
      typeof twoWayData.jti === 'string' &&
      typeof twoWayData.twoWayTimestamp === 'number'
    ) {
      return {
        jobIndex: twoWayData.jobIndex,
        threadIndex: twoWayData.threadIndex,
        jti: twoWayData.jti,
        twoWayTimestamp: twoWayData.twoWayTimestamp,
        method: twoWayData.method,
        extraInfo: twoWayData.extraInfo,
      };
    }

    return null;
  }

  /**
   * API 성공 여부 확인 (CODEF 기준)
   */
  isSuccess(response: any): boolean {
    return response.data?.result?.code === 'CF-00000';
  }

  /**
   * 2-way 인증 요청인지 확인하는 private 메소드
   */
  private isTwoWayRequest(
    request: GetTaxCertRequestDto
  ): request is TaxCertTwoWayRequest {
    return (
      'is2Way' in request && (request as TaxCertTwoWayRequest).is2Way === true
    );
  }
}
