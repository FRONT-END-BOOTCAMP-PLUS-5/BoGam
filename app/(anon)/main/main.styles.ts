export const styles = {
  // 주소 추가 및 지도 영역
  addressMapContainer:
    'bg-brand-white rounded-lg border border-brand-light-gray shadow-md p-6 max-w-md mx-auto w-full',

  // 주소 정보 헤더
  addressInfoHeader: 'mb-5',

  // 주소 정보 제목과 버튼 컨테이너
  addressInfoTitleContainer: 'flex justify-between items-center',

  // 주소 정보 제목
  addressInfoTitle: 'text-base font-semibold text-brand-black',

  // 주소 추가 버튼
  addressAddButton: '!h-8 !w-20 !text-xs !mt-0',

  // 위치 상태 표시 영역
  locationStatusContainer: 'mt-2',

  // 위치 상태 텍스트 (로딩)
  locationStatusLoading: 'text-brand-dark-gray text-sm',

  // 위치 상태 텍스트 (에러)
  locationStatusError: 'text-brand-error text-sm',

  // 위치 상태 아이콘
  locationStatusIcon: 'inline-block w-4 h-4 mr-1',
} as const;
