export const styles = {
  // 메인 컨테이너 - 지도가 들어가는 메인 영역
  mainContainer: "relative w-full h-[400px]",
  
  // 지도 영역 - 카카오맵이 렌더링되는 영역, brand-light-gray 테두리
  map: "w-full h-full border border-brand-light-gray",
  
  // 로딩 오버레이 - 지도 로딩 중 표시되는 반투명 오버레이
  loadingOverlay: "absolute inset-0 bg-brand-light-blue/90 flex items-center justify-center z-10",
  
  // 로딩 콘텐츠 - 로딩 메시지와 정보가 표시되는 영역
  loadingContent: "text-center",
  
  // 로딩 텍스트 - 메인 로딩 메시지
  loadingText: "m-0",
  
  // 위치 정보 텍스트 - GPS 좌표나 주소 정보 표시
  locationText: "mt-1.5 mb-0 text-xs text-brand-dark-gray",
  
  // 에러 텍스트 - GPS나 주소 오류 메시지, brand-error 컬러 사용
  errorText: "mt-1.5 mb-0 text-xs text-brand-error",
  
  // 새로고침 버튼 - 위치 정보 새로고침 버튼, brand-green 배경
  refreshButton: "mt-2.5 px-2.5 py-1.5 bg-brand-green text-white border-none rounded cursor-pointer text-xs hover:bg-brand-dark-green transition-colors",
  
  // 에러 오버레이 - API 키 오류 등 심각한 오류 시 표시되는 오버레이
  errorOverlay: "absolute inset-0 bg-white/95 flex items-center justify-center z-5",
  
  // 에러 콘텐츠 - 에러 메시지와 재시도 버튼이 들어가는 영역
  errorContent: "text-center p-5",
  
  // 에러 제목 - 에러 상황을 설명하는 제목, brand-error 컬러 사용
  errorTitle: "m-0 mb-2.5 text-lg font-bold text-brand-error",
  
  // 에러 설명 - 에러 상황에 대한 자세한 설명, brand-dark-gray 컬러
  errorDescription: "m-0 mb-4 text-sm text-brand-dark-gray",
  
  // 재시도 버튼 - 에러 상황에서 다시 시도하는 버튼, brand-green 배경
  retryButton: "px-4 py-2 bg-brand-green text-white border-none rounded cursor-pointer text-sm hover:bg-brand-dark-green transition-colors"
};
