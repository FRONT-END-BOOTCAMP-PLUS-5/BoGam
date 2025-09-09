export const styles = {
  // 컨테이너
  container: 'flex gap-1.5 w-full justify-center',

  // 상태 아이템 - 고정 크기로 균등 배치
  item: 'flex items-center justify-evenly px-3 py-2 rounded-2xl flex-1 min-w-[6rem] max-w-[6rem]',

  // 상태별 배경색 (tailwind.config 브랜드 색상 사용)
  match: 'bg-brand-green',
  unchecked: 'bg-brand-light-gray',
  mismatch: 'bg-brand-error',

  // 텍스트 스타일 - 굵은 폰트
  text: 'text-xs font-bold',

  // 아이콘 스타일 - 고정 크기
  icon: 'flex items-center justify-center w-4 h-4',
  matchText: 'text-white',
  uncheckedText: 'text-brand-black',
  mismatchText: 'text-white',

  // 개수 스타일 (굵은 폰트)
  count: 'font-bold text-xs',
} as const;

// 상태별 스타일 함수
export const getItemStyle = (type: 'match' | 'unchecked' | 'mismatch') => {
  const baseStyle = styles.item;
  const typeStyles = {
    match: styles.match,
    unchecked: styles.unchecked,
    mismatch: styles.mismatch,
  };
  return `${baseStyle} ${typeStyles[type]}`;
};

export const getTextStyle = (type: 'match' | 'unchecked' | 'mismatch') => {
  const baseStyle = styles.text;
  const typeStyles = {
    match: styles.matchText,
    unchecked: styles.uncheckedText,
    mismatch: styles.mismatchText,
  };
  return `${baseStyle} ${typeStyles[type]}`;
};
