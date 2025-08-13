export const styles = {
  // 컨테이너
  container: 'flex gap-1.5 w-full',

  // 상태 아이템
  item: 'flex items-center justify-center gap-1 px-2 py-1.5 rounded-2xl flex-1',

  // 상태별 배경색
  completed: 'bg-green-500',
  unconfirmed: 'bg-gray-200',
  warning: 'bg-red-600',

  // 아이콘 스타일
  icon: 'w-3.5 h-3.5',
  completedIcon: 'text-white',
  unconfirmedIcon: 'text-red-500',
  warningIcon: 'text-white',

  // 텍스트 스타일
  text: 'flex items-center gap-1 text-xs',
  completedText: 'text-white',
  unconfirmedText: 'text-gray-700',
  warningText: 'text-white',

  // 개수 스타일
  count: 'text-black font-medium',
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

export const getIconStyle = (type: 'completed' | 'unconfirmed' | 'warning') => {
  const baseStyle = styles.icon;
  const typeStyles = {
    completed: styles.completedIcon,
    unconfirmed: styles.unconfirmedIcon,
    warning: styles.warningIcon,
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
