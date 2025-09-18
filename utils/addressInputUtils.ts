/**
 * 주소 입력 관련 유틸리티 함수들
 */

export interface DongHoInputResult {
  dong: string;
  ho: string;
  displayValue: string;
}

/**
 * 동-호 형식의 입력값을 파싱하고 유효성 검사를 수행합니다.
 * @param inputValue - 사용자가 입력한 값 (예: "101-1102")
 * @returns 파싱된 동, 호 값과 표시용 값
 */
export const parseDongHoInput = (inputValue: string): DongHoInputResult => {
  // 하이픈을 기준으로 분리
  const parts = inputValue.split('-');

  if (parts.length === 1) {
    // 하이픈이 없으면 동만 설정
    const dong = parts[0].replace(/[^0-9]/g, '');
    return {
      dong,
      ho: '',
      displayValue: dong,
    };
  } else if (parts.length === 2) {
    // 하이픈이 있으면 동과 호 설정
    const dong = parts[0].replace(/[^0-9]/g, '');
    const ho = parts[1].replace(/[^0-9]/g, '');
    return {
      dong,
      ho,
      displayValue: `${dong}${dong && ho ? '-' : ''}${ho}`,
    };
  }

  // 예상치 못한 경우 (하이픈이 2개 이상)
  return {
    dong: '',
    ho: '',
    displayValue: '',
  };
};

/**
 * 동-호 입력값의 유효성을 검사합니다.
 * @param dong - 동 번호
 * @param ho - 호 번호
 * @returns 유효성 검사 결과
 */
export const validateDongHoInput = (
  dong: string,
  ho: string
): {
  isValid: boolean;
  errorMessage?: string;
} => {
  if (!dong.trim()) {
    return {
      isValid: false,
      errorMessage: '동을 입력해주세요.',
    };
  }

  if (!ho.trim()) {
    return {
      isValid: false,
      errorMessage: '호를 입력해주세요.',
    };
  }

  // 동 번호 유효성 검사 (1-999)
  const dongNum = parseInt(dong, 10);
  if (isNaN(dongNum) || dongNum < 1 || dongNum > 999) {
    return {
      isValid: false,
      errorMessage: '동 번호는 1-999 사이의 숫자여야 합니다.',
    };
  }

  // 호 번호 유효성 검사 (1-9999)
  const hoNum = parseInt(ho, 10);
  if (isNaN(hoNum) || hoNum < 1 || hoNum > 9999) {
    return {
      isValid: false,
      errorMessage: '호 번호는 1-9999 사이의 숫자여야 합니다.',
    };
  }

  return {
    isValid: true,
  };
};

/**
 * 동-호 입력값을 포맷팅합니다.
 * @param dong - 동 번호
 * @param ho - 호 번호
 * @returns 포맷팅된 문자열
 */
export const formatDongHoDisplay = (dong: string, ho: string): string => {
  if (!dong && !ho) return '';
  if (!dong) return ho;
  if (!ho) return dong;
  return `${dong}-${ho}`;
};

/**
 * 사용자 입력값을 그대로 유지하면서 동-호만 파싱합니다.
 * @param inputValue - 사용자가 입력한 원본 값
 * @returns 파싱된 동, 호 값
 */
export const parseDongHoInputOnly = (
  inputValue: string
): {
  dong: string;
  ho: string;
} => {
  // 하이픈을 기준으로 분리
  const parts = inputValue.split('-');

  if (parts.length === 1) {
    // 하이픈이 없으면 동만 설정
    const dong = parts[0].replace(/[^0-9]/g, '');
    return { dong, ho: '' };
  } else if (parts.length === 2) {
    // 하이픈이 있으면 동과 호 설정
    const dong = parts[0].replace(/[^0-9]/g, '');
    const ho = parts[1].replace(/[^0-9]/g, '');
    return { dong, ho };
  }

  // 예상치 못한 경우
  return { dong: '', ho: '' };
};
