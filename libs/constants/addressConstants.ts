/**
 * 주소 관리 관련 상수들
 */

// 스토리지 키
export const STORAGE_KEYS = {
  ALLOW_NAVIGATION: 'allow-navigation',
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  NO_ADDRESS_SELECTED: '저장할 주소가 선택되지 않았습니다.',
  DONG_REQUIRED: '동을 입력해주세요.',
  ROAD_ADDRESS_REQUIRED: '상세 주소를 입력해주세요.',
  DUPLICATE_ADDRESS: '이미 저장된 주소입니다.',
  ADDRESS_NOT_FOUND: '해당 주소를 찾을 수 없습니다.',
  SEARCH_FAILED: '키워드 검색 중 오류가 발생했습니다.',
  SAVE_FAILED: '주소 저장 중 오류가 발생했습니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  ADDRESS_SAVED: '주소가 성공적으로 저장되었습니다!',
} as const;

// 타입 정의
export interface AddressSearchData {
  longitude: string;
  latitude: string;
  legalDistrictCode?: string;
  lotAddress?: string;
  roadAddress?: string;
  address: string;
}
