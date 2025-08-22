/**
 * steps URL에서 stepNumber와 detail을 파싱하는 함수
 * @param pathname - 현재 경로 (예: "/steps/1/2")
 * @returns { stepNumber: number, detail: number } | null
 */
export function parseStepUrl(pathname: string): { stepNumber: number; detail: number } | null {
  // /steps/1/2 형태의 URL 패턴 매칭
  const stepPattern = /^\/steps\/(\d+)\/(\d+)$/;
  const match = pathname.match(stepPattern);
  
  if (match) {
    const stepNumber = parseInt(match[1], 10);
    const detail = parseInt(match[2], 10);
    
    // 유효한 숫자인지 확인
    if (!isNaN(stepNumber) && !isNaN(detail)) {
      return { stepNumber, detail };
    }
  }
  
  return null;
}

/**
 * 현재 URL이 steps 페이지인지 확인하는 함수
 * @param pathname - 현재 경로
 * @returns boolean
 */
export function isStepPage(pathname: string): boolean {
  return /^\/steps\/\d+\/\d+$/.test(pathname);
}
