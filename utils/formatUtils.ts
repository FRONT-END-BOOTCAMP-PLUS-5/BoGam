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
