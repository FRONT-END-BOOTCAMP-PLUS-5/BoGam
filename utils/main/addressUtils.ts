import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';

/**
 * 주소에서 기본 주소 부분을 추출합니다.
 * @param address - 주소 객체
 * @returns 기본 주소 문자열
 */
export const extractBaseAddress = (address: UserAddress): string => {
  if (address.roadAddress && address.roadAddress.trim()) {
    return address.roadAddress.trim();
  } else if (address.lotAddress && address.lotAddress.trim()) {
    return address.lotAddress.trim();
  } else {
    return address.completeAddress;
  }
};

/**
 * 주소에서 동/호 정보를 추출합니다.
 * @param address - 주소 객체
 * @returns { dong: string, ho: string }
 */
export const extractDongHo = (
  address: UserAddress
): { dong: string; ho: string } => {
  return {
    dong: address.dong || '',
    ho: address.ho || '',
  };
};

/**
 * 현재 주소와 새 주소가 같은지 비교합니다.
 * @param currentAddress - 현재 주소 문자열
 * @param newAddress - 새 주소 문자열
 * @returns boolean
 */
export const isSameAddress = (
  currentAddress: string,
  newAddress: string
): boolean => {
  return currentAddress === newAddress;
};

/**
 * 주소 검색 결과를 UserAddress 형식으로 변환합니다.
 * @param searchData - 주소 검색 결과
 * @returns UserAddress 객체
 */
export const createUserAddressFromSearch = (searchData: {
  longitude: string;
  latitude: string;
  legalDistrictCode?: string;
  lotAddress?: string;
  roadAddress?: string;
  address: string;
}): UserAddress => {
  return {
    id: Date.now(), // 임시 ID
    nickname: '새 주소',
    x: parseFloat(searchData.longitude),
    y: parseFloat(searchData.latitude),
    isPrimary: false,
    isVolatile: true,
    legalDistrictCode: searchData.legalDistrictCode || '',
    lotAddress: searchData.lotAddress || '',
    roadAddress: searchData.roadAddress || '',
    completeAddress: searchData.address,
    dong: '',
    ho: '',
  };
};

/**
 * 주소 문자열을 파싱하여 시/도, 시/군/구, 동으로 분리합니다.
 * @param address - 주소 문자열
 * @returns 파싱된 주소 객체
 */
export const parseAddressString = (
  address: string
): {
  addrSido: string;
  addrSigungu: string;
  addrDong: string;
} => {
  const parts = address.split(' ');
  return {
    addrSido: parts[0] || '',
    addrSigungu: parts[1] || '',
    addrDong: parts[2] || '',
  };
};
