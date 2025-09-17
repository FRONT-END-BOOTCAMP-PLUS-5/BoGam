import { useEffect, useCallback } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useMainPageState } from './useMainPageState';
import { useMapStore } from '@libs/stores/map/mapStore';
import { useQueryClient } from '@tanstack/react-query';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import {
  extractBaseAddress,
  extractDongHo,
  isSameAddress,
  createUserAddressFromSearch,
  MapLocation,
  buildCompleteAddress,
  checkDuplicateAddress,
  moveToDBAddress,
  moveToNewAddress,
} from '@utils/main/addressUtils';
import { createLocationFromCoordinates } from '@utils/main/mapUtils';
import { useToastStore } from '@libs/stores/toastStore';
import {
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  AddressSearchData,
} from '@libs/constants/addressConstants';

export const useAddressManagement = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastStore();

  // Store에서 데이터 가져오기
  const {
    userAddresses: storeUserAddresses,
    selectedAddress: storeSelectedAddress,
    selectAddress,
    addAddress,
    deleteAddress,
    addVolatileAddress,
    deleteVolatileAddress,
    isNewAddressSearch,
    setIsNewAddressSearch,
  } = useUserAddressStore();

  // 메인 페이지 상태 (새로 검색한 주소 정보)
  const {
    roadAddress,
    searchQuery,
    savedLawdCode,
    setRoadAddress,
    setSearchQuery,
    setSavedLawdCode,
  } = useMainPageState();

  // UserAddressStore에서 동/호 상태 가져오기
  const { dong, ho, setDong } = useUserAddressStore();

  // 지도 관련 Store
  const { setMapCenter, setSearchLocationMarker, setAdjustBounds } =
    useMapStore();

  /**
   * 선택된 주소의 상태를 업데이트합니다.
   */
  const updateAddressState = useCallback(
    (address: UserAddress) => {
      // 동 정보 추출
      const { dong: extractedDong } = extractDongHo(address);

      // 기본 주소 추출
      const baseAddress = extractBaseAddress(address);

      // 상태 업데이트
      setRoadAddress(baseAddress);
      setDong(extractedDong || '');
      setSearchQuery(address.completeAddress);
      setSavedLawdCode(address.legalDistrictCode || '');

      // 선택된 주소의 좌표로 지도 이동
      if (address.x && address.y) {
        const location = createLocationFromCoordinates(address.x, address.y);
        setMapCenter(location);
        setSearchLocationMarker(location);
      }
    },
    [
      setDong,
      setMapCenter,
      setRoadAddress,
      setSavedLawdCode,
      setSearchLocationMarker,
      setSearchQuery,
    ]
  );

  // 선택된 주소가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (!storeSelectedAddress) return;

    // 이미 같은 주소가 선택되어 있다면 상태 업데이트하지 않음
    const currentAddress = `${roadAddress} ${dong}동`.trim();
    const newAddress = storeSelectedAddress.completeAddress;

    if (isSameAddress(currentAddress, newAddress)) {
      return;
    }

    updateAddressState(storeSelectedAddress);
  }, [storeSelectedAddress, updateAddressState, roadAddress, dong]);

  // ===== 주소 선택 및 검색 관련 함수들 =====

  /**
   * 주소 선택 핸들러
   */
  const handleAddressSelect = useCallback(
    (address: UserAddress) => {
      selectAddress(address);
    },
    [selectAddress]
  );

  /**
   * 주소 검색 핸들러
   */
  const handleAddressSearch = useCallback(
    (searchData: AddressSearchData) => {
      // 새로운 주소를 휘발성 주소로 추가
      const newAddress = createUserAddressFromSearch(searchData);
      addVolatileAddress(newAddress);
    },
    [addVolatileAddress]
  );

  /**
   * 주소 저장 핸들러 (기본)
   */
  const handleAddressSave = useCallback(
    async (addressData: Omit<UserAddress, 'id'>) => {
      try {
        await addAddress(addressData);
      } catch (error) {
        console.error('주소 저장 실패:', error);
        showError(ERROR_MESSAGES.SAVE_FAILED);
      }
    },
    [addAddress, showError]
  );

  // ===== 주소 저장 관련 함수들 =====

  /**
   * 휘발성 주소를 DB에 저장합니다.
   */
  const saveVolatileAddressToDB = useCallback(
    async (address: UserAddress, dong: string, ho: string) => {
      const completeAddress = buildCompleteAddress(
        address.roadAddress,
        dong,
        ho
      );

      const addressData = {
        nickname: `${address.nickname} ${dong}동${ho}호`,
        x: address.x,
        y: address.y,
        isPrimary: false,
        isSelected: true,
        legalDistrictCode: address.legalDistrictCode || '',
        dong,
        ho,
        lotAddress: address.lotAddress,
        roadAddress: address.roadAddress,
        completeAddress,
      };

      await addAddress(addressData);
      deleteVolatileAddress(address.id);
      setIsNewAddressSearch(false);

      // 페이지 이동 허용
      sessionStorage.setItem(STORAGE_KEYS.ALLOW_NAVIGATION, 'true');

      // 쿼리 무효화
      await queryClient.invalidateQueries({
        queryKey: ['userAddresses'],
      });

      showSuccess(SUCCESS_MESSAGES.ADDRESS_SAVED);
    },
    [
      addAddress,
      deleteVolatileAddress,
      setIsNewAddressSearch,
      queryClient,
      showSuccess,
    ]
  );

  /**
   * 기존 주소의 동/호 정보를 업데이트합니다.
   */
  const updateExistingAddress = useCallback(
    (address: UserAddress, dong: string, ho: string) => {
      const completeAddress = buildCompleteAddress(
        address.roadAddress,
        dong,
        ho
      );

      const updatedAddress = {
        ...address,
        completeAddress,
        dong,
        ho,
      };

      selectAddress(updatedAddress);

      // 페이지 이동 허용
      sessionStorage.setItem(STORAGE_KEYS.ALLOW_NAVIGATION, 'true');

      showSuccess(SUCCESS_MESSAGES.ADDRESS_SAVED);
    },
    [selectAddress, showSuccess]
  );

  /**
   * 주소를 사용자 DB에 저장합니다.
   */
  const saveAddressToUser = useCallback(
    async (dongValue?: string, hoValue?: string) => {
      if (!storeSelectedAddress) {
        showError(ERROR_MESSAGES.NO_ADDRESS_SELECTED);
        return;
      }

      // 전달받은 값 우선 사용, 없으면 store의 상태값 사용
      const currentDong = dongValue || dong || '';
      const currentHo = hoValue || ho || '';

      if (!currentDong) {
        showError(ERROR_MESSAGES.DONG_REQUIRED);
        return;
      }

      try {
        const completeAddress = buildCompleteAddress(
          storeSelectedAddress.roadAddress,
          currentDong,
          currentHo
        );

        // 중복 주소 체크
        if (
          checkDuplicateAddress(
            storeUserAddresses,
            storeSelectedAddress,
            completeAddress
          )
        ) {
          showError(ERROR_MESSAGES.DUPLICATE_ADDRESS);
          return;
        }

        if (storeSelectedAddress.isVolatile) {
          await saveVolatileAddressToDB(
            storeSelectedAddress,
            currentDong,
            currentHo
          );
        } else {
          updateExistingAddress(storeSelectedAddress, currentDong, currentHo);
        }
      } catch (error) {
        console.error('주소 저장 실패:', error);
        showError(ERROR_MESSAGES.SAVE_FAILED);
      }
    },
    [
      storeSelectedAddress,
      dong,
      ho,
      showError,
      storeUserAddresses,
      saveVolatileAddressToDB,
      updateExistingAddress,
    ]
  );

  // ===== 지도 이동 관련 함수들 =====

  /**
   * 새 주소로 지도 이동을 시도합니다.
   */
  const moveToNewAddressWithValidation = useCallback(
    async (dongValue: string): Promise<MapLocation | null> => {
      if (!roadAddress) {
        showError(ERROR_MESSAGES.ROAD_ADDRESS_REQUIRED);
        return null;
      }

      return await moveToNewAddress(
        roadAddress,
        dongValue,
        storeSelectedAddress?.lotAddress
      );
    },
    [roadAddress, storeSelectedAddress, showError]
  );

  /**
   * 지도 이동 전용 (실거래가 데이터 없이)
   */
  const handleMoveToAddressOnly = useCallback(
    async (currentDong?: string) => {
      const dongValue = currentDong || dong || storeSelectedAddress?.dong || '';

      if (!dongValue) {
        showError(ERROR_MESSAGES.DONG_REQUIRED);
        return;
      }

      setAdjustBounds(false);

      console.log('storeSelectedAddress', storeSelectedAddress);

      try {
        let location: MapLocation | null = null;

        if (storeSelectedAddress && !storeSelectedAddress.isVolatile) {
          // DB 주소인 경우
          location = await moveToDBAddress(storeSelectedAddress, dongValue);
        } else {
          // 새 주소인 경우
          location = await moveToNewAddressWithValidation(dongValue);
        }

        if (location) {
          setMapCenter(location);
          setSearchLocationMarker(location);
        } else {
          showError(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
        }
      } catch (error) {
        console.error('지도 이동 실패:', error);
        showError(ERROR_MESSAGES.SEARCH_FAILED);
      }
    },
    [
      dong,
      storeSelectedAddress,
      showError,
      setAdjustBounds,
      setMapCenter,
      setSearchLocationMarker,
      moveToNewAddressWithValidation,
    ]
  );

  // ===== 기타 함수들 =====

  /**
   * 주소 변경 핸들러
   */
  const handleAddressChange = useCallback(
    (address: UserAddress) => {
      selectAddress(address);
    },
    [selectAddress]
  );

  // ===== 반환 객체 =====
  return {
    // 상태
    selectedAddress: storeSelectedAddress,
    userAddresses: storeUserAddresses,
    roadAddress,
    dong,
    ho,
    searchQuery,
    savedLawdCode,
    isNewAddressSearch,

    // 핸들러
    handleAddressSelect,
    handleAddressSearch,
    handleAddressSave,
    saveAddressToUser,
    handleMoveToAddressOnly,
    handleAddressChange,

    // Store 액션들
    selectAddress,
    addAddress,
    deleteAddress,
    addVolatileAddress,
    deleteVolatileAddress,
    setIsNewAddressSearch,
  };
};
