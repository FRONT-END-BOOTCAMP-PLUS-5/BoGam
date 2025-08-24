/**
 * TaxCertResultDisplay 컴포넌트 스타일
 */

export const styles = {
  // 메인 컨테이너
  container: "max-w-4xl mx-auto p-6",
  
  // 폼 컨테이너 (RealEstateInput과 동일)
  formContainer: "bg-brand-white p-6 rounded-lg shadow-sm border border-brand-light-gray",
  
  // 정보 그리드 (1줄에 1개씩)
  infoGrid: "grid grid-cols-1 gap-4 mb-6",
  
  // 정보 섹션
  infoSection: "space-y-4",
  
  // 정보 필드
  infoField: "flex flex-col",
  
  // 정보 라벨
  infoLabel: "text-sm font-medium text-brand-dark-gray mb-1",
  
  // 정보 값
  infoValue: "text-base font-semibold text-brand-black",
  infoValueSecondary: "text-sm text-brand-dark-gray",
  
  // 테이블 컨테이너
  tableContainer: "mb-6",
  
  // 테이블 제목
  tableTitle: "text-lg font-semibold text-brand-black mb-4",
  
  // 테이블
  table: "min-w-full border border-brand-light-gray rounded-lg overflow-hidden",
  
  // 테이블 헤더
  tableHeader: "bg-brand-light-gray",
  
  // 테이블 헤더 셀
  tableHeaderCell: "px-4 py-3 text-left text-xs font-medium text-brand-dark-gray uppercase tracking-wider border-b border-brand-light-gray",
  
  // 테이블 바디
  tableBody: "bg-brand-white divide-y divide-brand-light-gray",
  
  // 테이블 행
  tableRow: "hover:bg-brand-light-gray",
  
  // 테이블 셀
  tableCell: "px-4 py-3 text-sm text-brand-black border-b border-brand-light-gray",
  
  // 추가 스타일들
  noDataContainer: "text-center py-8 border border-brand-light-gray rounded-lg",
  noDataText: "text-brand-dark-gray",
  noDataSubText: "text-xs text-brand-dark-gray mt-2",
  
  // 아코디언 스타일
  accordionContainer: "border border-brand-light-gray rounded-lg",
  accordionButton: "w-full text-left p-4 bg-brand-light-gray hover:bg-brand-light-blue transition-colors flex justify-between items-center",
  accordionTitle: "text-lg font-semibold text-brand-black",
  accordionIcon: "text-brand-dark-gray",
  accordionContent: "p-4 border-t border-brand-light-gray space-y-6",
  
  // 섹션 스타일
  sectionTitle: "text-md font-semibold text-brand-black mb-3 border-b border-brand-light-gray pb-2",
  
  // 오버플로우 컨테이너
  overflowContainer: "overflow-x-auto",
} as const;
