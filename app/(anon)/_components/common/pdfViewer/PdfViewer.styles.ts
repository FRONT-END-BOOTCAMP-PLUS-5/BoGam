export const styles = {
  // 로딩 상태 스타일
  loadingContainer: 'flex flex-col items-center justify-center py-8',
  loadingSpinner:
    'animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-4',
  loadingText: 'text-brand-dark-gray',

  // 에러 상태 스타일
  errorContainer: 'bg-red-50 border border-red-200 rounded-lg p-4',
  errorText: 'text-brand-error text-sm',

  // 빈 데이터 상태 스타일
  emptyContainer:
    'bg-brand-light-gray border border-brand-light-gray rounded-lg p-4',
  emptyText: 'text-brand-dark-gray text-sm',

  // 메인 컨테이너 스타일
  mainContainer: 'space-y-4',

  // PDF 미리보기 스타일
  pdfPreviewContainer:
    'border border-brand-light-gray rounded-lg overflow-hidden',
  pdfPreviewHeader:
    'bg-brand-light-gray px-4 py-2 border-b border-brand-light-gray',
  pdfPreviewTitle: 'font-medium text-brand-black',
  pdfIframe: {
    width: '100%',
    height: '600px',
    border: 'none',
  },

  // 다운로드 버튼 스타일
  downloadButtonContainer: 'flex justify-center',
} as const;
