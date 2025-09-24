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

  // PDF 섹션
  pdfSection: 'mb-6',
  pdfTitle: 'font-semibold text-brand-black mb-3',
} as const;
