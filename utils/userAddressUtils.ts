import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';

/**
 * 사용자 주소 관련 유틸리티 함수들
 */

// 유틸리티 함수들
export const addressUtils = {
  // 휘발성 주소 필터링
  filterVolatileAddresses: (addresses: UserAddress[]) =>
    addresses.filter((addr) => addr.isVolatile),

  filterPersistentAddresses: (addresses: UserAddress[]) =>
    addresses.filter((addr) => !addr.isVolatile),

  // 주소 닉네임 생성
  createAddressNickname: (address: UserAddress) => {
    const dongPart = address.dong ? ` ${address.dong}동` : '';
    const hoPart = address.ho ? ` ${address.ho}호` : '';
    return `${address.roadAddress}${dongPart}${hoPart}`;
  },

  // API 요청 데이터 변환
  createApiRequestData: (address: UserAddress) => ({
    addressNickname: addressUtils.createAddressNickname(address),
    latitude: address.y,
    longitude: address.x,
    legalDistrictCode: address.legalDistrictCode || '',
    dong: address.dong || '',
    ho: address.ho || '',
    lotAddress: address.lotAddress,
    roadAddress: address.roadAddress,
  }),

  // 주소 선택 우선순위 결정
  determineSelectedAddress: (
    currentSelected: UserAddress | null,
    dbAddresses: UserAddress[]
  ) => {
    // 1. 현재 선택된 주소가 휘발성 주소라면 우선 유지
    if (currentSelected?.isVolatile) {
      return currentSelected;
    }

    // 2. DB에서 isSelected=true인 주소 선택
    const selectedFromDB = dbAddresses.find((addr) => addr.isSelected);
    if (selectedFromDB) {
      return selectedFromDB;
    }

    // 3. 대표 주소 선택
    const primaryAddress = dbAddresses.find((addr) => addr.isPrimary);
    if (primaryAddress) {
      return primaryAddress;
    }

    return null;
  },

  // 휘발성 주소 추가 시 상태 업데이트
  createVolatileAddressState: (
    state: {
      userAddresses: UserAddress[];
      selectedAddress: UserAddress | null;
      isNewAddressSearch: boolean;
    },
    newAddress: UserAddress
  ) => {
    const persistentAddresses = addressUtils.filterPersistentAddresses(
      state.userAddresses
    );

    return {
      userAddresses: [...persistentAddresses, newAddress],
      selectedAddress: newAddress,
      isNewAddressSearch: true,
    };
  },
};
