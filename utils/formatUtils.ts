/**
 * 전화번호 포맷팅 유틸리티
 */

/**
 * 전화번호에서 숫자가 아닌 문자를 제거하고 최대 11자리로 제한
 * @param raw - 원본 전화번호 문자열
 * @returns 포맷팅된 전화번호 (숫자만, 최대 11자리)
 */
export function formatPhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 11);
}

// 숫자 포맷팅 유틸리티 함수들
// 숫자를 한글 단위로 변환하는 함수
export const formatToKoreanUnit = (value: number): string => {
  if (value === 0) return '';

  const units = [
    { value: 1000000000000, label: '조' },
    { value: 100000000, label: '억' },
    { value: 10000, label: '만' },
  ];

  let result = '';
  let remaining = value;

  for (const unit of units) {
    if (remaining >= unit.value) {
      const count = Math.floor(remaining / unit.value);
      result += count + unit.label;
      remaining %= unit.value;
    }
  }

  if (remaining > 0) {
    result += remaining;
  }

  return result + '원';
};

/**
 * 문자열에서 숫자만 추출하여 숫자로 변환
 * @param value 입력 문자열
 * @returns 추출된 숫자 (숫자가 없으면 0)
 */
export const formatNumber = (value: string): number => {
  return parseInt(value.replace(/[^\d]/g, '')) || 0;
};