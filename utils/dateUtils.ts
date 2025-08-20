/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * 현재 날짜를 YYYYMM 형식으로 반환
 * @returns 현재 년월 (예: "202508")
 */
export function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}${month}`;
}

/**
 * 시작 계약년월부터 현재까지의 모든 계약년월 배열 생성
 * @param startDealYmd 시작 계약년월 (YYYYMM 형식)
 * @returns 계약년월 배열 (예: ["202404", "202405", ..., "202508"])
 */
export function generateDealYearMonthRange(startDealYmd: string): string[] {
  const months: string[] = [];

  // 시작 년월 파싱
  const startYear = parseInt(startDealYmd.substring(0, 4));
  const startMonth = parseInt(startDealYmd.substring(4, 6));

  // 현재 년월 파싱
  const currentYearMonth = getCurrentYearMonth();
  const endYear = parseInt(currentYearMonth.substring(0, 4));
  const endMonth = parseInt(currentYearMonth.substring(4, 6));

  let currentYear = startYear;
  let currentMonth = startMonth;

  while (
    currentYear < endYear ||
    (currentYear === endYear && currentMonth <= endMonth)
  ) {
    const yearMonth = `${currentYear}${String(currentMonth).padStart(2, '0')}`;
    months.push(yearMonth);

    // 다음 월로 이동
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return months;
}

/**
 * 계약년월이 유효한지 검증
 * @param dealYmd 계약년월 (YYYYMM 형식)
 * @returns 유효성 여부
 */
export function isValidDealYearMonth(dealYmd: string): boolean {
  if (!dealYmd || dealYmd.length !== 6) {
    return false;
  }

  const year = parseInt(dealYmd.substring(0, 4));
  const month = parseInt(dealYmd.substring(4, 6));

  // 년도 범위 검증 (2000년 ~ 현재년도 + 1)
  const currentYear = new Date().getFullYear();
  if (year < 2000 || year > currentYear + 1) {
    return false;
  }

  // 월 범위 검증
  if (month < 1 || month > 12) {
    return false;
  }

  return true;
}

/**
 * 계약년월을 사람이 읽기 쉬운 형식으로 변환
 * @param dealYmd 계약년월 (YYYYMM 형식)
 * @returns 읽기 쉬운 형식 (예: "2024년 4월")
 */
export function formatDealYearMonth(dealYmd: string): string {
  const year = dealYmd.substring(0, 4);
  const month = parseInt(dealYmd.substring(4, 6));
  return `${year}년 ${month}월`;
}
