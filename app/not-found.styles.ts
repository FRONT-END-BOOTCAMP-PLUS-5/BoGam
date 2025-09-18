export const styles = {
  // 메인 컨테이너
  container: 'min-h-screen bg-brand-white flex items-center justify-center p-4',
  
  // 콘텐츠 영역
  content: 'p-8 max-w-md w-full text-center relative',
  
  // 404 에러 코드
  errorCode: 'text-8xl font-bold text-brand-black mb-4 relative inline-block',
  
  // 404 에러 코드 아래쪽
  errorCodeBottom: 'absolute bottom-0 left-0 right-0 h-2/5 opacity-30 bg-brand-error z-0',
  
  // 제목
  title: 'text-2xl font-bold text-brand-black mb-4',
  
  // 설명 텍스트
  description: 'text-brand-dark-gray mb-8 leading-relaxed',
  
  // 버튼 그룹
  buttonGroup: 'flex justify-center',
} as const;
