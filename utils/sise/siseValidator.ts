import {
  SiseRequest,
  SiseTwoWayRequest,
  SiseValidationDto,
} from '../../backend/sise/applications/dtos/SiseDto';

/**
 * 시세정보 요청 데이터 검증 유틸리티
 */
export class SiseValidator {
  /**
   * 시세정보 요청 데이터 검증
   * @param request 요청 데이터
   * @returns 검증 결과
   */
  static validateRequest(
    request: SiseRequest | SiseTwoWayRequest
  ): SiseValidationDto {
    const errors: string[] = [];

    // 기본 필수 필드 검증
    if (!request.organization || request.organization.trim() === '') {
      errors.push('기관코드는 필수입니다.');
    }

    if (!request.searchGbn || request.searchGbn.trim() === '') {
      errors.push('조회구분은 필수입니다.');
    }

    if (!request.complexNo || request.complexNo.trim() === '') {
      errors.push('단지 일련번호는 필수입니다.');
    }

    // searchGbn에 따른 조건부 검증
    if (request.searchGbn === '0' || request.searchGbn === '2') {
      if (!request.dong || request.dong.trim() === '') {
        errors.push('동 정보는 필수입니다. (searchGbn이 0 또는 2인 경우)');
      }
      if (!request.ho || request.ho.trim() === '') {
        errors.push('호 정보는 필수입니다. (searchGbn이 0 또는 2인 경우)');
      }
    }

    // 추가인증 요청인 경우 검증
    if ('is2Way' in request && request.is2Way) {
      if (!request.twoWayInfo) {
        errors.push('추가인증 정보는 필수입니다.');
      } else {
        if (request.twoWayInfo.jobIndex === undefined) {
          errors.push('잡 인덱스는 필수입니다.');
        }
        if (request.twoWayInfo.threadIndex === undefined) {
          errors.push('스레드 인덱스는 필수입니다.');
        }
        if (!request.twoWayInfo.jti || request.twoWayInfo.jti.trim() === '') {
          errors.push('트랜잭션 아이디는 필수입니다.');
        }
        if (!request.twoWayInfo.twoWayTimestamp) {
          errors.push('추가 인증 시간은 필수입니다.');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
