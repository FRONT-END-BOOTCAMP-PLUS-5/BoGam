export const styles = {
  // 메인 컨테이너
  container:
    'bg-brand-white rounded-lg border border-brand-light-gray shadow-lg relative w-full',

  // 헤더 영역
  header: 'flex items-start justify-between px-4 py-3 cursor-pointer',
  headerContent: 'flex-1 min-w-0',
  headerTitle:
    'text-base font-medium text-brand-dark-gray block mb-2 opacity-70',
  selectedAddress: 'flex items-start',
  selectedAddressText:
    'text-sm text-brand-black break-words ml-1 leading-[1.4]',

  // 헤더 영역의 주소 텍스트 스타일
  addressFirstLine:
    'text-sm font-semibold text-brand-black leading-relaxed break-all leading-[1.4]',
  addressSecondLine:
    'text-xs text-brand-dark-gray leading-relaxed mt-1 break-all leading-[1.3]',

  // 확장 버튼
  expandButton:
    'flex items-center justify-center p-1 hover:bg-brand-light-blue/20 rounded transition-colors duration-200 border-none bg-transparent cursor-pointer',
  expandIcon: 'text-brand-dark-gray transition-transform duration-200 w-5 h-5',
  expandIconExpanded: 'transform rotate-180',

  // 별 아이콘 관련
  starIcon: 'flex-shrink-0 w-[18px] h-[18px]',

  // Placeholder 텍스트
  placeholderText: 'text-sm text-brand-dark-gray/60 leading-[1.4]',

  // 비활성화된 확장 버튼
  expandButtonDisabled: 'opacity-50 cursor-not-allowed',

  // 반응형 디자인
  containerMobile: 'max-w-full',
  selectedAddressTextMobile: 'text-xs',
  addressFirstLineMobile: 'text-xs',
  addressSecondLineMobile: 'text-xs',
} as const;

// 조건부 스타일 함수들
export const getExpandIconStyle = (isExpanded: boolean) =>
  `${styles.expandIcon} ${isExpanded ? styles.expandIconExpanded : ''}`;

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
});
