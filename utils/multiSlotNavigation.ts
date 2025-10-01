/**
 * 멀티 슬롯 네비게이션을 위한 유틸리티 함수들
 */

/**
 * 프로그래밍 라우팅을 위한 세션 스토리지 플래그 설정
 */
export const setProgrammaticNavigationFlag = (): void => {
  sessionStorage.setItem('programmatic-navigation', 'true');
  sessionStorage.setItem('navigation-timestamp', Date.now().toString());
};

/**
 * 프로그래밍 라우팅 플래그 제거
 */
export const clearProgrammaticNavigationFlag = (): void => {
  sessionStorage.removeItem('programmatic-navigation');
  sessionStorage.removeItem('navigation-timestamp');
};

/**
 * 프로그래밍 라우팅인지 확인
 */
export const isProgrammaticNavigation = (): boolean => {
  const isProgrammatic = sessionStorage.getItem('programmatic-navigation');
  const navigationTimestamp = sessionStorage.getItem('navigation-timestamp');
  const currentTime = Date.now();

  // 타임스탬프가 5초 이내이고 플래그가 있으면 프로그래밍 라우팅으로 간주
  const isRecentNavigation =
    navigationTimestamp && currentTime - parseInt(navigationTimestamp) < 5000;

  return isProgrammatic === 'true' && !!isRecentNavigation;
};

/**
 * URL 패턴이 steps/[step-number]/[detail] 형식인지 확인
 */
export const isStepDetailUrl = (pathname: string): boolean => {
  const stepPattern = /^\/steps\/(\d+)\/(\d+)$/;
  return stepPattern.test(pathname);
};

/**
 * URL 패턴이 main/[detail] 형식인지 확인
 */
export const isMainDetailUrl = (pathname: string): boolean => {
  const mainPattern = /^\/main\/(\d+)$/;
  return mainPattern.test(pathname);
};

/**
 * 메인 steps 페이지 URL인지 확인 (steps/[step-number] 형식)
 */
export const isMainStepsPage = (pathname: string): boolean => {
  const mainStepsPattern = /^\/steps\/(\d+)$/;
  return mainStepsPattern.test(pathname);
};

/**
 * 멀티 슬롯을 열기 위한 네비게이션 함수
 * @param router Next.js router 인스턴스
 * @param path 이동할 경로 (예: '/steps/5/1')
 */
export const navigateToMultiSlot = (
  router: { push: (path: string) => void },
  path: string
): void => {
  // 프로그래밍 라우팅 플래그 설정
  setProgrammaticNavigationFlag();

  // 해당 경로로 이동
  router.push(path);
};

/**
 * 멀티 슬롯 닫기 함수
 * @param router Next.js router 인스턴스
 * @param setShouldShow 슬롯 표시 상태를 변경하는 함수
 */
export const closeMultiSlot = (
  router: { back: () => void },
  setShouldShow: (show: boolean) => void
): void => {
  setShouldShow(false);
  router.back();
};
