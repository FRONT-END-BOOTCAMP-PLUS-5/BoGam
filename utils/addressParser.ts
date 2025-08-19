/**
 * 주소 분해 유틸리티 함수
 */

export interface ParsedAddress {
  addrSido: string;
  addrSigungu: string;
  addrDong: string;
}

/**
 * 주소를 시도, 시군구, 동으로 분해하는 함수
 * @param address - 분해할 주소 문자열
 * @returns 분해된 주소 정보
 */
export function parseAddress(address: string): ParsedAddress {
  if (!address || typeof address !== 'string') {
    return {
      addrSido: '',
      addrSigungu: '',
      addrDong: '',
    };
  }

  // 주소에서 공백 제거 및 정규화
  const normalizedAddress = address.trim().replace(/\s+/g, ' ');

  console.log('🔍 주소 파싱 시작:', {
    originalAddress: address,
    normalizedAddress,
  });

  // 주소 정규화 (축약형을 전체명으로 변환)
  const normalizedAddressWithFullNames = normalizedAddress
    .replace(/^서울\s/, '서울특별시 ')
    .replace(/^부산\s/, '부산광역시 ')
    .replace(/^대구\s/, '대구광역시 ')
    .replace(/^인천\s/, '인천광역시 ')
    .replace(/^광주\s/, '광주광역시 ')
    .replace(/^대전\s/, '대전광역시 ')
    .replace(/^울산\s/, '울산광역시 ')
    .replace(/^세종\s/, '세종특별자치시 ')
    .replace(/^제주\s/, '제주특별자치도 ')
    .replace(/^경기\s/, '경기도 ')
    .replace(/^강원\s/, '강원도 ')
    .replace(/^충북\s/, '충청북도 ')
    .replace(/^충남\s/, '충청남도 ')
    .replace(/^전북\s/, '전라북도 ')
    .replace(/^전남\s/, '전라남도 ')
    .replace(/^경북\s/, '경상북도 ')
    .replace(/^경남\s/, '경상남도 ');

  console.log('🔍 주소 정규화 완료:', { normalizedAddressWithFullNames });

  // 시도 목록 (가장 긴 것부터 매칭)
  const sidoList = [
    '서울특별시',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '제주특별자치도',
    '경기도',
    '강원도',
    '충청북도',
    '충청남도',
    '전라북도',
    '전라남도',
    '경상북도',
    '경상남도',
  ];

  let addrSido = '';
  let addrSigungu = '';
  let addrDong = '';

  // 시도 찾기
  for (const sido of sidoList) {
    if (normalizedAddressWithFullNames.startsWith(sido)) {
      addrSido = sido;
      const remainingAddress = normalizedAddressWithFullNames
        .substring(sido.length)
        .trim();

      // 시군구 찾기 (시도 다음 부분에서 공백이나 구/군/시로 끝나는 부분)
      const sigunguMatch = remainingAddress.match(/^([^0-9\s]+(?:시|군|구))/);
      if (sigunguMatch) {
        addrSigungu = sigunguMatch[1];
        const dongPart = remainingAddress
          .substring(sigunguMatch[1].length)
          .trim();

        // 동 찾기 (읍/면/동으로 끝나는 부분)
        const dongMatch = dongPart.match(/^([^0-9\s]+(?:읍|면|동))/);
        if (dongMatch) {
          addrDong = dongMatch[1];
        } else {
          // 동이 없는 경우 나머지 부분을 동으로 설정
          addrDong = dongPart.split(' ')[0] || '';
        }
      } else {
        // 시군구가 없는 경우 나머지 부분을 시군구로 설정
        addrSigungu = remainingAddress.split(' ')[0] || '';
      }
      break;
    }
  }

  const result = {
    addrSido,
    addrSigungu,
    addrDong,
  };

  console.log('🔍 주소 파싱 결과:', result);
  return result;
}

/**
 * 주소가 유효한지 확인하는 함수
 * @param address - 확인할 주소
 * @returns 유효성 여부
 */
export function isValidAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false;
  }

  const parsed = parseAddress(address);
  return !!(parsed.addrSido && parsed.addrSigungu);
}

/**
 * 주소 분해 결과를 검증하는 함수
 * @param parsedAddress - 분해된 주소
 * @returns 검증 결과
 */
export function validateParsedAddress(parsedAddress: ParsedAddress): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!parsedAddress.addrSido) {
    errors.push('시도 정보를 찾을 수 없습니다.');
  }

  if (!parsedAddress.addrSigungu) {
    errors.push('시군구 정보를 찾을 수 없습니다.');
  }

  if (!parsedAddress.addrDong) {
    errors.push('동 정보를 찾을 수 없습니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
