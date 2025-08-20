import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';

/**
 * 아파트용 API 호출 매개변수를 생성합니다.
 * @param buildingType - 건물 타입
 * @param complexName - 건물명
 * @returns 아파트 API 호출 매개변수
 */
export const createApartmentParams = (
  buildingType: string,
  complexName: string
) => {
  return {
    buildingCode: complexName,
    type: buildingType,
    contractYear: '2024',
  };
};

/**
 * 단독/다가구용 API 호출 매개변수를 생성합니다.
 * @param buildingType - 건물 타입
 * @param selectedAddress - 선택된 주소
 * @returns 단독/다가구 API 호출 매개변수
 */
export const createSingleParams = (
  buildingType: string,
  selectedAddress: UserAddress
) => {
  const addressParts = selectedAddress?.completeAddress?.split(' ') || [];
  return {
    addrSido: addressParts[0] || '',
    addrSigungu: addressParts[1] || '',
    addrDong: addressParts[2] || '',
    type: buildingType,
    contractYear: '2024',
  };
};

/**
 * 건물 타입이 유효한지 검증합니다.
 * @param buildingType - 건물 타입
 * @returns boolean
 */
export const isValidBuildingType = (buildingType: string): boolean => {
  return ['0', '1', '2'].includes(buildingType);
};

/**
 * 법정동 코드가 유효한지 검증합니다.
 * @param lawdCode - 법정동 코드
 * @returns boolean
 */
export const isValidLawdCode = (lawdCode?: string): boolean => {
  return !!lawdCode && lawdCode.trim().length > 0;
};

/**
 * 실거래가 조회 전 유효성 검사를 수행합니다.
 * @param selectedAddress - 선택된 주소
 * @param buildingType - 건물 타입
 * @param complexName - 건물명
 * @returns 검증 결과
 */
export const validateTransactionSearch = (
  selectedAddress: UserAddress | null,
  buildingType: string,
  complexName: string
): { isValid: boolean; error?: string } => {
  if (!selectedAddress) {
    return { isValid: false, error: '선택된 주소가 없습니다.' };
  }

  if (!isValidLawdCode(selectedAddress.legalDistrictCode)) {
    return { isValid: false, error: '법정동 코드가 없습니다.' };
  }

  if (!isValidBuildingType(buildingType)) {
    return { isValid: false, error: '지원하지 않는 건물 타입입니다.' };
  }

  if (!complexName || complexName.trim().length === 0) {
    return { isValid: false, error: '건물명을 입력해주세요.' };
  }

  return { isValid: true };
};
