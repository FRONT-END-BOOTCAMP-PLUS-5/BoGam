/**
 * 탭 인덱스가 유효한지 검증합니다.
 * @param tabIndex - 탭 인덱스
 * @param maxTabs - 최대 탭 수
 * @returns boolean
 */
export const isValidTabIndex = (
  tabIndex: number,
  maxTabs: number = 3
): boolean => {
  return tabIndex >= 0 && tabIndex < maxTabs;
};

/**
 * 다음 탭 인덱스를 계산합니다.
 * @param currentTab - 현재 탭 인덱스
 * @param maxTabs - 최대 탭 수
 * @returns 다음 탭 인덱스
 */
export const getNextTabIndex = (
  currentTab: number,
  maxTabs: number = 3
): number => {
  return Math.min(currentTab + 1, maxTabs - 1);
};

/**
 * 이전 탭 인덱스를 계산합니다.
 * @param currentTab - 현재 탭 인덱스
 * @returns 이전 탭 인덱스
 */
export const getPreviousTabIndex = (currentTab: number): number => {
  return Math.max(currentTab - 1, 0);
};

/**
 * 첫 번째 탭 인덱스를 반환합니다.
 * @returns 첫 번째 탭 인덱스
 */
export const getFirstTabIndex = (): number => {
  return 0;
};

/**
 * 마지막 탭 인덱스를 계산합니다.
 * @param maxTabs - 최대 탭 수
 * @returns 마지막 탭 인덱스
 */
export const getLastTabIndex = (maxTabs: number = 3): number => {
  return maxTabs - 1;
};

/**
 * 탭 변경이 유효한지 검증합니다.
 * @param fromTab - 현재 탭 인덱스
 * @param toTab - 이동할 탭 인덱스
 * @param maxTabs - 최대 탭 수
 * @returns boolean
 */
export const isValidTabChange = (
  fromTab: number,
  toTab: number,
  maxTabs: number = 3
): boolean => {
  return (
    isValidTabIndex(fromTab, maxTabs) &&
    isValidTabIndex(toTab, maxTabs) &&
    fromTab !== toTab
  );
};
