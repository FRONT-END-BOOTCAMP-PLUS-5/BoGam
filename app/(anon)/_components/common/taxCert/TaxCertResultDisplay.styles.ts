/**
 * TaxCertResultDisplay 컴포넌트 스타일
 */

export const styles = {
  // 메인 컨테이너
  container: 'max-w-4xl mx-auto',

  // 메인 컨테이너 (로딩용)
  mainContainer:
    'bg-brand-white p-6 rounded-lg shadow-sm border border-brand-light-gray',

  // 헤더
  header: 'mb-6',

  // 제목
  title: 'text-lg font-semibold text-brand-black mb-4',

  // 상태 컨테이너
  statusContainer: 'p-4 rounded-lg mb-4',
  statusWarning: 'bg-brand-warning border border-brand-warning',

  // 상태 텍스트
  statusText: 'text-sm font-medium',
  statusTextWarning: 'text-brand-warning-dark',

  // 빈 상태
  emptyContainer: 'text-center py-12 text-brand-dark-gray',
  emptyText: 'text-brand-dark-gray',

  // 원본 데이터 컨테이너
  originalDataContent:
    'bg-brand-light-gray border border-brand-light-gray rounded-lg p-4',
  originalDataTitle: 'text-lg font-semibold text-brand-black mb-3',

  // 정보 그리드
  infoGrid: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-6',

  // 정보 섹션
  infoSection: 'space-y-4',

  // 정보 필드
  infoField: 'flex flex-col',

  // 정보 라벨
  infoLabel: 'text-sm font-medium text-brand-dark-gray mb-1',

  // 정보 값
  infoValue: 'text-base font-semibold text-brand-black',
  infoValueSecondary: 'text-sm text-brand-dark-gray',

  // 테이블 컨테이너
  tableContainer: 'mb-6',

  // 테이블 제목
  tableTitle: 'text-lg font-semibold text-brand-black mb-4',

  // 테이블
  table: 'min-w-full border border-brand-light-gray rounded-lg overflow-hidden',

  // 테이블 헤더
  tableHeader: 'bg-brand-light-gray',

  // 테이블 헤더 셀
  tableHeaderCell:
    'px-4 py-3 text-left text-xs font-medium text-brand-dark-gray uppercase tracking-wider border-b border-brand-light-gray',

  // 테이블 바디
  tableBody: 'bg-brand-white divide-y divide-brand-light-gray',

  // 테이블 행
  tableRow: 'hover:bg-brand-light-gray',

  // 테이블 셀
  tableCell:
    'px-4 py-3 text-sm text-brand-black border-b border-brand-light-gray',

  // 원본 데이터 컨테이너
  originalDataContainer: 'space-y-4',

  // 원본 데이터 필드
  originalDataField:
    'bg-brand-light-gray border border-brand-light-gray rounded-lg p-4',

  // 원본 데이터 헤더
  originalDataHeader: 'flex justify-between items-center mb-3',

  // 원본 데이터 라벨
  originalDataLabel: 'text-sm font-medium text-brand-dark-gray',

  // 복사 버튼
  copyButton:
    'px-3 py-1 text-xs font-medium text-brand bg-brand-light-blue border border-brand rounded hover:bg-brand-90 transition-colors',

  // PDF 섹션
  pdfSection: 'mb-6',
  pdfTitle: 'font-semibold text-brand-black mb-3',
} as const;
