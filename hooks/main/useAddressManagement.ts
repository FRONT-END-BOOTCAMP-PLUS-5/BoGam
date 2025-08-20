import { useEffect, useRef } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useMainPageState } from './useMainPageState';
import { useMapStore } from '@libs/stores/map/mapStore';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import {
  extractBaseAddress,
  extractDongHo,
  isSameAddress,
  createUserAddressFromSearch,
} from '@utils/main/addressUtils';
import { createLocationFromCoordinates } from '@utils/main/mapUtils';

export const useAddressManagement = () => {
  // 무한 루프 방지를 위한 ref
  const lastProcessedAddressId = useRef<number | null>(null);

  // Store에서 데이터 가져오기
  const {
    userAddresses: storeUserAddresses,
    selectedAddress: storeSelectedAddress,
    selectAddress,
    addAddress,
    deleteAddress,
    addVolatileAddress,
    deleteVolatileAddress,
  } = useUserAddressStore();

  // 메인 페이지 상태
  const {
    roadAddress,
    dong,
    ho,
    searchQuery,
    savedLawdCode,
    setRoadAddress,
    setDong,
    setHo,
    setSearchQuery,
    setSavedLawdCode,
  } = useMainPageState();

  // 지도 관련 Store
  const { setMapCenter, setSearchLocationMarker } = useMapStore();

  // 실거래가 데이터 Store
  const { clearTransactionData, isLoading } = useTransactionDataStore();

  // storeSelectedAddress가 변경될 때마다 상태 업데이트 (드롭다운 선택 시)
  useEffect(() => {
    if (storeSelectedAddress) {
      console.log(
        '🔍 storeSelectedAddress 변경 감지, 드롭다운 주소로 전환:',
        storeSelectedAddress
      );

      // 이미 같은 주소가 선택되어 있다면 상태 업데이트하지 않음
      const currentAddress = `${roadAddress} ${dong}동 ${ho}호`.trim();
      const newAddress = storeSelectedAddress.completeAddress;

      if (isSameAddress(currentAddress, newAddress)) {
        console.log('🔍 같은 주소가 이미 선택되어 있음, 상태 업데이트 건너뜀');
        return;
      }

      // 무한 루프 방지를 위한 추가 검증
      const currentSelectedId = storeSelectedAddress.id;

      if (lastProcessedAddressId.current === currentSelectedId) {
        console.log('🔍 이미 처리된 주소 ID, 상태 업데이트 건너뜀');
        return;
      }

      lastProcessedAddressId.current = currentSelectedId;

      // 드롭다운 주소 선택

      // 동/호 정보를 직접 사용
      const { dong: extractedDong, ho: extractedHo } =
        extractDongHo(storeSelectedAddress);

      // 도로명 주소가 있으면 도로명 주소 사용, 없으면 지번 주소 사용
      const baseAddress = extractBaseAddress(storeSelectedAddress);

      // 드롭다운 주소로 메인 상태 업데이트
      console.log('드롭다운 주소 선택 시 메인 상태 업데이트:', {
        baseAddress,
        extractedDong,
        extractedHo,
        completeAddress: storeSelectedAddress.completeAddress,
      });
      setRoadAddress(baseAddress);
      setDong(extractedDong);
      setHo(extractedHo);
      setSearchQuery(storeSelectedAddress.completeAddress);
      setSavedLawdCode(storeSelectedAddress.legalDistrictCode || '');

      // 주소 변경 시 실거래가 데이터 초기화는 제거
      // 실거래가 조회 후에는 데이터를 유지하도록 함
      if (!isLoading) {
        clearTransactionData();
      }

      // 선택된 주소의 좌표로 지도 이동
      if (storeSelectedAddress.x && storeSelectedAddress.y) {
        const location = createLocationFromCoordinates(
          storeSelectedAddress.x,
          storeSelectedAddress.y
        );
        setMapCenter(location);
        setSearchLocationMarker(location);
      }
    }
  }, [storeSelectedAddress?.id, clearTransactionData, isLoading]);

  // 주소 선택 핸들러
  const handleAddressSelect = (address: UserAddress) => {
    selectAddress(address);
  };

  // 주소 검색 핸들러
  const handleAddressSearch = (searchData: {
    longitude: string;
    latitude: string;
    legalDistrictCode?: string;
    lotAddress?: string;
    roadAddress?: string;
    address: string;
  }) => {
    console.log('🔍 새로운 주소 검색 시작:', searchData);

    // 새로운 주소 검색 시 실거래가 데이터 초기화
    if (!isLoading) {
      clearTransactionData();
    }

    // 새로운 주소를 휘발성 주소로 추가
    const newAddress = createUserAddressFromSearch(searchData);

    addVolatileAddress(newAddress);
    console.log('새 주소가 성공적으로 저장되고 선택되었습니다.');
  };

  // 주소 저장 핸들러
  const handleAddressSave = async (addressData: Omit<UserAddress, 'id'>) => {
    try {
      await addAddress(addressData);
      console.log('주소가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('주소 저장 실패:', error);
    }
  };

  return {
    // 상태
    selectedAddress: storeSelectedAddress,
    userAddresses: storeUserAddresses,
    roadAddress,
    dong,
    ho,
    searchQuery,
    savedLawdCode,

    // 핸들러
    handleAddressSelect,
    handleAddressSearch,
    handleAddressSave,

    // 기타
    selectAddress,
    addAddress,
    deleteAddress,
    addVolatileAddress,
    deleteVolatileAddress,
  };
};
