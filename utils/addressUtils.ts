/**
 * 주소 관련 유틸리티 함수들
 */

/**
 * 주소 텍스트를 첫 번째 쉼표에서 분할하는 함수
 * @param address - 분할할 주소 문자열
 * @returns 첫 번째 부분과 두 번째 부분을 포함한 객체
 */
export const formatAddress = (address: string) => {
  const commaIndex = address.indexOf(',');
  if (commaIndex !== -1) {
    const firstPart = address.substring(0, commaIndex);
    const secondPart = address.substring(commaIndex + 1).trim();
    return { firstPart, secondPart };
  }
  return { firstPart: address, secondPart: '' };
};
