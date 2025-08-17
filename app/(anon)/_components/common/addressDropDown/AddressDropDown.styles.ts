export const styles = {
  // 메인 컨테이너
  container:
    'bg-brand-white rounded-lg border border-brand-light-gray shadow-lg relative w-full',

  // 헤더 영역
  header: 'flex items-start justify-between px-4 py-3 cursor-pointer',
  headerContent: 'flex-1 min-w-0',
  headerTitle: 'text-base font-medium text-brand-dark-gray block mb-2',
  selectedAddress: 'flex items-start',
  selectedAddressText:
    'text-sm text-brand-black break-words ml-1 leading-[1.4]',

  // 헤더 영역의 주소 텍스트 스타일
  addressFirstLine:
    'text-sm text-brand-black leading-relaxed break-all leading-[1.4]',
  addressSecondLine:
    'text-xs text-brand-dark-gray leading-relaxed mt-1 break-all leading-[1.3]',

  // 확장 버튼
  expandButton:
    'flex items-center justify-center p-1 hover:bg-brand-light-blue/20 rounded transition-colors duration-200 border-none bg-transparent cursor-pointer',
  expandIcon: 'text-brand-dark-gray transition-transform duration-200 w-5 h-5',
  expandIconExpanded: 'transform rotate-180',

  // 드롭다운 컨테이너
  dropdownContainer:
    'absolute top-[calc(100%+3rem)] left-0 right-0 z-10 bg-brand-white rounded-lg border border-brand-light-gray shadow-lg max-h-0 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out opacity-0',
  dropdownContainerExpanded: 'max-h-[300px] opacity-100',

  // 드롭다운 목록
  dropdownList: 'max-h-64 overflow-y-auto',
  listItem:
    'flex items-start justify-between px-4 py-3 hover:bg-brand-light-blue/10 transition-colors duration-200 border-b border-brand-light-gray/50 opacity-0 -translate-y-[10px] animate-[fadeInSlide_0.3s_ease-out_forwards]',
  listItemLast: 'border-b-0',
  listItemActive: 'bg-brand-light-blue/20 border-l-4 border-l-brand pl-4',

  // 주소 컨텐츠 영역
  addressContent: 'flex items-start flex-1 min-w-0 cursor-pointer',

  // 별 아이콘 관련
  starButton:
    'flex-shrink-0 mr-2 p-1 hover:bg-brand-light-blue/30 rounded transition-colors duration-200 border-none bg-transparent cursor-pointer self-center',
  starIcon: 'flex-shrink-0 w-[18px] h-[18px]',

  // 주소 텍스트 컨테이너
  addressTextContainer: 'flex-1 min-w-0',

  // 주소 텍스트 스타일
  addressTextActive: 'font-medium text-brand-black',


  deleteButton:
    'text-brand-error text-xs hover:text-brand-error/80 transition-colors duration-200 ml-2 flex-shrink-0 px-2 py-1 rounded hover:bg-brand-error/10 border-none bg-transparent cursor-pointer font-medium',

  // 스크롤바 스타일
  scrollbar:
    'scrollbar-thin scrollbar-track-brand-light-gray/20 scrollbar-thumb-brand-dark-gray/30 scrollbar-thumb-rounded-full hover:scrollbar-thumb-brand-dark-gray/50',

  // Placeholder 텍스트
  placeholderText: 'text-sm text-brand-dark-gray/60 italic leading-[1.4]',

  // 빈 상태
  emptyState: 'text-center text-brand-dark-gray text-sm py-8',

  // 비활성화된 확장 버튼
  expandButtonDisabled: 'opacity-50 cursor-not-allowed',

  // 반응형 디자인
  containerMobile: 'max-w-full',
  selectedAddressTextMobile: 'text-xs',
  addressFirstLineMobile: 'text-xs',
  addressSecondLineMobile: 'text-xs',
  deleteButtonMobile: 'text-xs px-1',
} as const;

// 조건부 스타일 함수들
export const getExpandIconStyle = (isExpanded: boolean) =>
  `${styles.expandIcon} ${isExpanded ? styles.expandIconExpanded : ''}`;

export const getDropdownContainerStyle = (isExpanded: boolean) =>
  `${styles.dropdownContainer} ${
    isExpanded ? styles.dropdownContainerExpanded : ''
  }`;

export const getListItemStyle = (isActive: boolean, isLast: boolean) =>
  `${styles.listItem} ${isActive ? styles.listItemActive : ''} ${
    isLast ? styles.listItemLast : ''
  }`;

export const getAddressTextStyle = (isActive: boolean) =>
  `${isActive ? styles.addressTextActive : ''}`;

export const getExpandButtonStyle = (isDisabled: boolean) =>
  `${styles.expandButton} ${isDisabled ? styles.expandButtonDisabled : ''}`;

// 반응형 스타일 함수
export const getResponsiveStyles = (isMobile: boolean) => ({
  container: `${styles.container} ${isMobile ? styles.containerMobile : ''}`,
  selectedAddressText: `${styles.selectedAddressText} ${
    isMobile ? styles.selectedAddressTextMobile : ''
  }`,
  addressFirstLine: `${styles.addressFirstLine} ${
    isMobile ? styles.addressFirstLineMobile : ''
  }`,
  addressSecondLine: `${styles.addressSecondLine} ${
    isMobile ? styles.addressSecondLineMobile : ''
  }`,
  deleteButton: `${styles.deleteButton} ${
    isMobile ? styles.deleteButtonMobile : ''
  }`,
});
