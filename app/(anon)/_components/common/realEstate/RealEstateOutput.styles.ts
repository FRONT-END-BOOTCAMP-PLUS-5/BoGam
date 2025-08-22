export const styles = {
  // 컨테이너
  container: 'max-w-4xl mx-auto',

  // 메인 컨테이너
  mainContainer:
    'bg-brand-white p-6 rounded-lg shadow-sm border border-brand-light-gray',

  // 제목
  title: 'text-lg font-semibold text-brand-black mb-4',

  // 로딩 상태
  loadingContainer: 'flex flex-col items-center justify-center py-12',
  loadingSpinner:
    'animate-spin rounded-full h-8 w-8 border-b-2 border-brand mb-4',
  loadingText: 'text-brand-dark-gray text-center',
  loadingSubText: 'text-sm text-brand-dark-gray mt-2',

  // 빈 상태
  emptyContainer: 'text-center py-12 text-brand-dark-gray',
  emptyText: 'text-brand-dark-gray',

  // 응답 상태 박스
  responseBox: 'p-4 rounded-lg mb-6',
  responseBoxSuccess: 'bg-brand-green/10 border border-brand-green/20',
  responseBoxError: 'bg-brand-error/10 border border-brand-error/20',

  // 응답 헤더
  responseHeader: 'flex items-center justify-between mb-3',
  responseStatus: 'font-medium',
  responseStatusSuccess: 'text-brand-green',
  responseStatusError: 'text-brand-error',
  responseCode: 'text-sm text-brand-dark-gray',

  // 응답 내용
  responseContent: 'text-sm',
  responseMessage: 'text-sm',
  responseError: 'text-sm mt-2',
  responseWarning: 'text-sm mt-2',

  // 2-way 인증 정보
  twoWayContainer:
    'bg-brand-light-blue p-4 rounded-lg mb-6 border border-brand-blue',
  twoWayTitle: 'font-semibold text-brand-dark-blue mb-3',
  twoWayGrid: 'grid grid-cols-1 md:grid-cols-2 gap-2 text-sm',
  twoWayItem: 'text-sm',

  // DB 저장 정보
  dbContainer:
    'bg-brand-light-gray/50 p-4 rounded-lg mb-6 border border-brand-light-gray',
  dbTitle: 'font-semibold text-brand-black mb-3',
  dbGrid: 'grid grid-cols-1 md:grid-cols-3 gap-2 text-sm',
  dbItem: 'text-sm',

  // PDF 섹션
  pdfSection: 'mb-6',
  pdfTitle: 'font-semibold text-brand-black mb-3',

  // 문자열 필드 섹션
  stringFieldsSection: 'mb-6',
  stringFieldsTitle: 'font-semibold text-brand-black mb-3',
  stringFieldsContainer:
    'bg-brand-light-gray/50 p-4 rounded-lg border border-brand-light-gray',
  stringFieldsEmpty: 'text-brand-dark-gray',
  stringFieldsList: 'space-y-2',
  stringFieldItem:
    'flex flex-col sm:flex-row sm:items-center border-b border-brand-light-gray pb-2 last:border-b-0',
  stringFieldKey: 'font-medium text-brand-black min-w-[200px] text-sm',
  stringFieldValue: 'text-brand-black break-all',

  // JSON 데이터 섹션
  jsonSection: '',
  jsonTitle: 'font-semibold text-brand-black mb-3',
  jsonContainer:
    'bg-brand-black text-brand-green p-4 rounded-lg overflow-x-auto',
  jsonPre: 'text-sm whitespace-pre-wrap',

  // 위험 단어 검색 결과
  dangerousWordsSection: 'mb-6',
  dangerousWordsTitle: 'font-semibold text-brand-black mb-3',

  // 안전 상태
  safeContainer:
    'bg-brand-green/10 p-6 rounded-lg border border-brand-green/20 text-center',
  safeIcon: 'text-4xl mb-3',
  safeText: 'text-xl font-semibold text-brand-green mb-2',
  safeSubText: 'text-brand-dark-gray',

  // 위험 상태
  dangerousContainer:
    'bg-brand-error/10 p-6 rounded-lg border border-brand-error/20',
  dangerousIcon: 'text-4xl mb-3 text-center',
  dangerousText: 'text-xl font-semibold text-brand-error mb-4 text-center',
  dangerousResults: 'space-y-4',
  dangerousItem: 'bg-brand-white p-4 rounded-lg border border-brand-error/30',
  dangerousField: 'text-sm text-brand-dark-gray mb-2',
  dangerousValue: 'text-sm text-brand-black mb-2 break-all',
  dangerousMatches: 'text-sm',
  dangerousWord:
    'inline-block bg-brand-error text-brand-white px-2 py-1 rounded text-xs mr-2 mb-1',
} as const;
