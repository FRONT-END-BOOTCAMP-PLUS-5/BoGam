export const styles = {
  // 리스트 아이템
  listItem:
    'flex items-start justify-between px-4 py-2 hover:bg-brand-light-blue/10 transition-colors duration-200 border-b border-brand-light-gray/50 opacity-0 -translate-y-[10px] animate-[fadeInSlide_0.3s_ease-out_forwards]',
  listItemLast: 'border-b-0',
  listItemActive: 'bg-brand-light-blue/20 border-l-4 border-l-brand pl-4',
  listItemVolatile: 'bg-brand-light-yellow/20 border-l-4 border-l-brand-yellow',

  // 주소 컨텐츠 영역
  addressContent: 'flex items-start flex-1 min-w-0 cursor-pointer',

  // 별 아이콘 관련
  starButton:
    'flex-shrink-0 mr-2 p-1 hover:bg-brand-light-blue/30 rounded transition-colors duration-200 border-none bg-transparent cursor-pointer self-center',

  // 주소 텍스트 컨테이너
  addressTextContainer: 'flex-1 min-w-0',

  // 주소 텍스트 스타일
  addressTextActive: 'font-medium text-brand-black',

  // 주소 텍스트 라인
  addressFirstLine:
    'text-sm text-brand-black leading-relaxed break-all leading-[1.4]',
  addressSecondLine:
    'text-xs text-brand-dark-gray leading-relaxed mt-1 break-all leading-[1.3]',

  // 삭제 버튼
  deleteButton:
    'text-brand-error text-xs hover:text-brand-error/80 transition-colors duration-200 ml-2 flex-shrink-0 px-2 py-1 rounded hover:bg-brand-error/10 border-none bg-transparent cursor-pointer font-medium',

  // 반응형 디자인
  deleteButtonMobile: 'text-xs px-1',
} as const;

// 조건부 스타일 함수들
export const getListItemStyle = (isActive: boolean, isVolatile: boolean) =>
  `${styles.listItem} ${isActive ? styles.listItemActive : ''} ${
    isVolatile ? styles.listItemVolatile : ''
  }`;

export const getAddressTextStyle = (isActive: boolean) =>
  `${isActive ? styles.addressTextActive : ''}`;

// 반응형 스타일 함수
export const getResponsiveStyles = (isMobile: boolean) => ({
  deleteButton: `${styles.deleteButton} ${
    isMobile ? styles.deleteButtonMobile : ''
  }`,
});
