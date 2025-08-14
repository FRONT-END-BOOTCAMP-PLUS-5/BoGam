export const styles = {
  // 모달 오버레이 (배경 흐림 처리)
  overlay:
    'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn',

  // 모달 컨테이너
  modalContainer:
    'bg-brand-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-scaleIn',

  // 모달 헤더 - 간격 증가
  header: 'flex items-center gap-4 p-6 pb-6',
  title: 'text-xl font-semibold text-brand-black flex-1',

  // 제목 배경 컨테이너 (GuideResultSummary 스타일 적용) - 제목 크기 증가
  titleContainer: 'relative inline-block',
  titleTop: 'absolute top-0 left-0 right-0 h-1/2 bg-brand-white',
  titleText: 'relative z-10 text-brand-black text-xl font-semibold px-1',
  titleBottom: 'absolute bottom-0 left-0 right-0 h-1/2 opacity-30',

  // 아이콘 컨테이너 - brand 컬러 테두리 유지
  iconContainer:
    'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2',
  iconContainerWarning: 'border-brand-gold',
  iconContainerInfo: 'border-brand',
  iconContainerError: 'border-brand-error',
  iconContainerSuccess: 'border-brand-green',

  // 아이콘 스타일 - brand 컬러로 통일
  warningIcon: 'w-6 h-6 text-brand-gold',
  infoIcon: 'w-11 h-11 text-brand',
  errorIcon: 'w-11 h-11 text-brand-error',
  successIcon: 'w-6 h-6 text-brand-green',

  // 모달 본문 - 간격 증가
  content: 'px-6 pb-8',
  contentText: 'text-brand-black leading-relaxed',

  // 버튼 컨테이너 - 간격 증가
  buttonContainer: 'flex gap-3 px-6 pb-6 justify-center',

  // 텍스트 아이콘 스타일 (크기 증가)
  textIcon: 'text-2xl font-bold flex items-center justify-center',

  // 버튼 스타일
  modalButton: 'px-8 min-w-[9.5rem]',
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

// 아이콘 컨테이너 스타일 함수
export const getIconContainerStyle = (
  iconType: 'warning' | 'info' | 'error' | 'success'
) => {
  const containerStyles = {
    warning: `${styles.iconContainer} ${styles.iconContainerWarning}`,
    info: `${styles.iconContainer} ${styles.iconContainerInfo}`,
    error: `${styles.iconContainer} ${styles.iconContainerError}`,
    success: `${styles.iconContainer} ${styles.iconContainerSuccess}`,
  };
  return (
    containerStyles[iconType] ||
    `${styles.iconContainer} ${styles.iconContainerInfo}`
  );
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
