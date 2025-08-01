import {
  DanJiRequest,
  DanJiApiResponse,
  DanJiValidationDto,
} from '../../backend/danJi/applications/dtos/DanJiDto';

/**
 * 단지목록 조회 검증 유틸리티
 */
export class DanJiValidator {
  /**
   * 단지목록 조회 요청 데이터 검증
   * @param request 요청 데이터
   * @returns 검증 결과
   */
  static validateRequest(request: DanJiRequest): DanJiValidationDto {
    const errors: string[] = [];

    // 필수 필드 검증
    if (!request.organization || request.organization.trim() === '') {
      errors.push('기관코드는 필수입니다.');
    }

    if (!request.addrSido || request.addrSido.trim() === '') {
      errors.push('주소_시/도는 필수입니다.');
    }

    if (!request.addrSigun || request.addrSigun.trim() === '') {
      errors.push('주소_시군구는 필수입니다.');
    }

    if (!request.addrDong || request.addrDong.trim() === '') {
      errors.push('주소_읍면동은 필수입니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 단지목록 조회 응답 데이터 검증
   * @param response API 응답
   * @returns 검증 결과
   */
  static validateResponse(response: DanJiApiResponse): {
    isValid: boolean;
    message: string;
  } {
    if (!response.data) {
      return {
        isValid: false,
        message: '응답 데이터가 올바르지 않습니다.',
      };
    }

    if (response.result.code !== 'CF-00000') {
      return {
        isValid: false,
        message: response.result.message || 'API 호출에 실패했습니다.',
      };
    }

    return {
      isValid: true,
      message: '단지목록 조회가 성공적으로 완료되었습니다.',
    };
  }
}
