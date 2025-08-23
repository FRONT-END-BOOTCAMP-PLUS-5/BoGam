export const styles = {
  // 컨테이너
  container: 'flex gap-1.5 w-full justify-center',

  // 상태 아이템 - 고정 크기로 균등 배치
  item: 'flex items-center justify-evenly px-3 py-2 rounded-2xl flex-1 min-w-[6rem] max-w-[6rem]',

  // 상태별 배경색 (tailwind.config 브랜드 색상 사용)
  completed: 'bg-brand-green',
  unconfirmed: 'bg-brand-light-gray',
  warning: 'bg-brand-error',

  // 텍스트 스타일 - 굵은 폰트
  text: 'text-xs font-bold',

  // 아이콘 스타일 - 고정 크기
  icon: 'flex items-center justify-center w-4 h-4',
  completedText: 'text-white',
  unconfirmedText: 'text-brand-black',
  warningText: 'text-white',

  // 개수 스타일 (굵은 폰트)
  count: 'font-bold text-xs',
} as const;

// 상태별 스타일 함수
export const getItemStyle = (type: 'completed' | 'unconfirmed' | 'warning') => {
  const baseStyle = styles.item;
  const typeStyles = {
    completed: styles.completed,
    unconfirmed: styles.unconfirmed,
    warning: styles.warning,
  };
  return `${baseStyle} ${typeStyles[type]}`;
};

export const getTextStyle = (type: 'completed' | 'unconfirmed' | 'warning') => {
  const baseStyle = styles.text;
  const typeStyles = {
    completed: styles.completedText,
    unconfirmed: styles.unconfirmedText,
    warning: styles.warningText,
  };
  return `${baseStyle} ${typeStyles[type]}`;
};
