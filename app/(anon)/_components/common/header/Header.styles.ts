export const styles = {
  wrapper:
    'sticky top-0 z-50 w-full h-16 flex items-center justify-between border-b bg-brand-white px-[max(var(--page-x),env(safe-area-inset-left))]',
  backButton: 'text-base',
  
  // 헤더 레이아웃 스타일
  headerLayout: 'flex items-center justify-between w-full',
  leftSection: 'flex items-center',
  centerSection: 'flex-1 flex justify-center',
  rightSection: 'flex items-center',
  
  // 대시보드 슬라이드 패널 스타일
  slidePanel: 'fixed top-0 left-[50%] h-full w-full max-w-[480px] bg-white shadow-lg transform transition-transform duration-500 ease-in-out z-[60] -translate-x-1/2',
  slidePanelOpen: '-translate-x-1/2',
  slidePanelClosed: 'translate-x-1/2'
};
