export const styles = {
  // 모달 오버레이 (배경 흐림 처리)
  overlay:
    'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn',

  // 모달 컨테이너
  modalContainer:
    'bg-brand-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scaleIn',

  // 모달 헤더
  header: 'flex items-center gap-3 p-6 pb-4',
  title: 'text-lg font-semibold text-brand-black flex-1',

  // 제목 배경 컨테이너 (GuideResultSummary 스타일 적용)
  titleContainer: 'relative inline-block',
  titleTop: 'absolute top-0 left-0 right-0 h-1/2 bg-brand-white',
  titleText: 'relative z-10 text-brand-black text-lg font-semibold px-1',
  titleBottom: 'absolute bottom-0 left-0 right-0 h-1/2 opacity-30',

  // 아이콘 스타일
  iconContainer: 'flex-shrink-0',
  warningIcon: 'w-6 h-6 text-brand-gold',
  infoIcon: 'w-6 h-6 text-brand',
  errorIcon: 'w-6 h-6 text-brand-error',
  successIcon: 'w-6 h-6 text-brand-green',

  // 모달 본문
  content: 'px-6 pb-6',
  contentText: 'text-brand-black leading-relaxed',

  // 버튼 컨테이너
  buttonContainer: 'flex gap-3 px-6 pb-6',

  // 버튼 스타일
  cancelButton:
    'flex-1 px-4 py-3 text-brand-dark-gray bg-brand-white border border-brand-light-gray rounded-lg font-medium transition-colors hover:bg-brand-light-blue/10 focus:outline-none focus:ring-2 focus:ring-brand-light-gray',
  confirmButton:
    'flex-1 px-4 py-3 text-brand-white bg-brand border border-brand rounded-lg font-medium transition-colors hover:bg-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-brand/30',

  // 비활성화된 버튼
  disabledButton: 'opacity-50 cursor-not-allowed',

  // 에러 관련 스타일
  errorContainer: 'space-y-3',
  errorBox: 'p-3 bg-brand-error/10 border border-brand-error/20 rounded-lg',
  errorTitle: 'text-brand-error text-sm font-medium',
  errorMessage: 'text-brand-error/80 text-sm mt-1',
} as const;

// 아이콘 타입별 스타일 함수
export const getIconStyle = (
  iconType: 'warning' | 'info' | 'error' | 'success'
) => {
  const iconStyles = {
    warning: styles.warningIcon,
    info: styles.infoIcon,
    error: styles.errorIcon,
    success: styles.successIcon,
  };
  return iconStyles[iconType] || styles.infoIcon;
};

// 아이콘 타입별 제목 배경색 함수
export const getTitleBackgroundColor = (
  iconType: 'warning' | 'info' | 'error' | 'success'
) => {
  const backgroundColors = {
    warning: 'bg-brand-gold',
    info: 'bg-brand',
    error: 'bg-brand-error',
    success: 'bg-brand-green',
  };
  return backgroundColors[iconType] || 'bg-brand';
};
