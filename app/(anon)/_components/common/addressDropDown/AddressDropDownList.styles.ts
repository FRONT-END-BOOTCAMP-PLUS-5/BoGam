export const styles = {
  // 드롭다운 컨테이너
  dropdownContainer:
    'absolute top-[calc(100%+1rem)] left-0 right-0 z-10 bg-brand-white rounded-lg border border-brand-light-gray shadow-lg max-h-0 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out opacity-0',
  dropdownContainerExpanded: 'max-h-[300px] opacity-100',

  // 드롭다운 목록
  dropdownList: 'max-h-64 overflow-y-auto',
  
  // 스크롤바 스타일
  scrollbar:
    'scrollbar-thin scrollbar-track-brand-light-gray/20 scrollbar-thumb-brand-dark-gray/30 scrollbar-thumb-rounded-full hover:scrollbar-thumb-brand-dark-gray/50',

  // 빈 상태
  emptyState: 'text-center text-brand-dark-gray text-sm py-8',
} as const;

// 조건부 스타일 함수들
export const getDropdownContainerStyle = (isExpanded: boolean) =>
  `${styles.dropdownContainer} ${
    isExpanded ? styles.dropdownContainerExpanded : ''
  }`;
