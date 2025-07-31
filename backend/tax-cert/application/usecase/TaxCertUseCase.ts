import { TaxCertRepository } from '../../domain/repository/TaxCertRepository';
import { TaxCertRequest, TaxCertTwoWayRequest, CodefResponse, TaxCertRequestDto, TaxCertResponseDto, TaxCertValidationDto } from '../dtos/TaxCertDto';

export class TaxCertUseCase {
  constructor(private taxCertRepository: TaxCertRepository) {}

  private validateRequest(request: TaxCertRequestDto): TaxCertValidationDto {
    const errors: string[] = [];
    const missingFields: string[] = [];

    // 기본 필수 필드 검증
    const requiredFields = ['organization', 'loginType', 'isIdentityViewYN', 'proofType', 'submitTargets'];
    const missingRequiredFields = requiredFields.filter(field => !request[field as keyof TaxCertRequest]);
    
    if (missingRequiredFields.length > 0) {
      missingFields.push(...missingRequiredFields);
      errors.push(`필수 필드가 누락되었습니다: ${missingRequiredFields.join(', ')}`);
    }

    // 로그인 타입별 필수 필드 검증
    if (!request.is2Way) {
      const loginType = request.loginType;
      let loginTypeErrors: string[] = [];
      
      switch (loginType) {
        case '0': // 회원 인증서로그인
        case '2': // 비회원 인증서로그인
          if (!request.certType) {
            loginTypeErrors.push('인증서 구분');
          }
          if (request.certType === '1') {
            if (!request.certFile) loginTypeErrors.push('인증서 파일');
            if (!request.keyFile) loginTypeErrors.push('키 파일');
            if (!request.certPassword) loginTypeErrors.push('인증서 비밀번호');
          }
          break;
        case '1': // 회원 아이디로그인
          if (!request.userId) loginTypeErrors.push('아이디');
          if (!request.userPassword) loginTypeErrors.push('비밀번호');
          break;
        case '5': // 회원 간편인증
        case '6': // 비회원 간편인증
          if (!request.userName) loginTypeErrors.push('사용자 이름');
          if (!request.loginIdentity) loginTypeErrors.push('사용자 주민번호');
          if (!request.loginTypeLevel) loginTypeErrors.push('간편인증 로그인 구분');
          if (!request.phoneNo) loginTypeErrors.push('전화번호');
          if (request.loginTypeLevel === '5' && !request.telecom) {
            loginTypeErrors.push('통신사');
          }
          break;
      }

      if (loginTypeErrors.length > 0) {
        errors.push(`로그인 타입별 필수 필드가 누락되었습니다: ${loginTypeErrors.join(', ')}`);
        missingFields.push(...loginTypeErrors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      missingFields
    };
  }

  async requestTaxCert(request: TaxCertRequestDto): Promise<TaxCertResponseDto> {
    const startTime = Date.now();
    
    try {
      console.log('🚀 납세증명서 요청 시작:', {
        is2Way: request.is2Way,
        loginType: request.loginType,
        requestDataKeys: Object.keys(request),
      });

      // 요청 데이터 검증
      const validation = this.validateRequest(request);
      if (!validation.isValid) {
        console.error('❌ 요청 데이터 검증 실패:', validation.errors);
        return {
          success: false,
          error: validation.errors.join('; '),
          duration: Date.now() - startTime
        };
      }

      let response: CodefResponse;

      if (request.is2Way) {
        // 추가인증 요청
        const twoWayRequest = request as TaxCertTwoWayRequest;
        response = await this.taxCertRepository.requestTaxCertTwoWay(twoWayRequest);
      } else {
        // 기본 요청
        const { is2Way, ...requestData } = request;
        response = await this.taxCertRepository.requestTaxCert(requestData as TaxCertRequest);
      }

      const duration = Date.now() - startTime;

      console.log('✅ 납세증명서 요청 성공:', {
        duration: `${duration}ms`,
        resultCode: response?.result?.code,
        resultMessage: response?.result?.message,
        continue2Way: response?.data?.continue2Way,
        hasResIssueNo: !!response?.data?.resIssueNo,
        transactionId: response?.result?.transactionId,
      });

      return {
        success: true,
        data: response,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.error('❌ 납세증명서 요청 오류:', {
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : '납세증명서 API 호출 중 오류가 발생했습니다.',
        duration
      };
    }
  }
} 