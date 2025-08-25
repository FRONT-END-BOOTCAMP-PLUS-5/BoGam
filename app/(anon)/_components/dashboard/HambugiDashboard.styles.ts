export const styles = {
  container:
    'h-full w-full max-w-[480px] bg-brand-white shadow-xl flex flex-col z-10000',
  mainContent: 'flex flex-1 min-h-0',
  leftPanel: 'w-[25%] py-4',
  divider: 'w-[5%] bg-brand relative',
  dividerTriangle:
    'absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-brand-white',
  rightPanel: 'w-[70%] overflow-y-auto',
  
  // 에러 상태 스타일
  errorContainer: 'flex items-center justify-center min-h-screen',
  errorContent: 'text-center',
  errorIcon: 'text-red-500 text-6xl mb-4',
  errorTitle: 'text-xl font-bold text-brand-black mb-2',
  errorMessage: 'text-brand-dark-gray mb-4',
  errorButton: 'px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-90 transition-colors',
};
