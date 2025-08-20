export const styles = {
  // 전체 컨테이너
  container: 'w-full max-w-4xl max-h-[70vh] overflow-x-auto overflow-y-auto',

  // 헤더 영역
  header: 'mb-4',
  title: 'text-lg font-semibold text-brand-black mb-2',
  subtitle: 'text-sm text-brand-gray mb-4',

  // 결과 목록 컨테이너
  contentContainer: 'flex-1 overflow-y-auto min-h-[300px] max-h-[400px]',

  // 로딩 상태
  loading:
    'flex flex-col items-center justify-center text-brand-gray space-y-4',
  spinner:
    'w-8 h-8 border-4 border-brand-light border-t-brand rounded-full animate-spin',

  // 에러 상태
  error: 'flex items-center justify-center text-brand-error p-4',

  // 빈 상태
  empty: 'flex items-center justify-center text-brand-gray p-4',

  // 단지 목록
  danjiList: 'space-y-2',

  // 단지 아이템
  danjiItem:
    'p-4 border border-brand-light rounded-lg hover:border-brand hover:bg-brand-light/10 cursor-pointer transition-all duration-200 hover:shadow-sm',

  // 단지명
  danjiName: 'text-lg font-semibold text-brand-black mb-2',

  // 단지 정보 컨테이너
  danjiInfo: 'space-y-1',

  // 주소 정보
  address: 'block text-sm text-brand-gray',

  // 건물코드
  buildingCode: 'block text-xs text-brand-gray/70',
} as const;
