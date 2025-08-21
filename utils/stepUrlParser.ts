/**
 * steps URL에서 mainNum과 subNum을 파싱하는 함수
 * @param pathname - 현재 경로 (예: "/steps/1/2")
 * @returns { mainNum: number, subNum: number } | null
 */
export function parseStepUrl(pathname: string): { mainNum: number; subNum: number } | null {
  // /steps/1/2 형태의 URL 패턴 매칭
  const stepPattern = /^\/steps\/(\d+)\/(\d+)$/;
  const match = pathname.match(stepPattern);
  
  if (match) {
    const mainNum = parseInt(match[1], 10);
    const subNum = parseInt(match[2], 10);
    
    // 유효한 숫자인지 확인
    if (!isNaN(mainNum) && !isNaN(subNum)) {
      return { mainNum, subNum };
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
