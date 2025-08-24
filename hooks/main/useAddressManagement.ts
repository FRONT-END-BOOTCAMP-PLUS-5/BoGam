import { useEffect, useRef, useState } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useMainPageState } from './useMainPageState';
import { useMapStore } from '@libs/stores/map/mapStore';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { useQueryClient } from '@tanstack/react-query';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { placesApi } from '@libs/api_front/places.api';
import { useModalStore } from '@libs/stores/modalStore';
import {
  extractBaseAddress,
  extractDongHo,
  isSameAddress,
  createUserAddressFromSearch,
} from '@utils/main/addressUtils';
import { createLocationFromCoordinates } from '@utils/main/mapUtils';

export const useAddressManagement = () => {
  const queryClient = useQueryClient();
  const { openModal } = useModalStore();

  // 무한 루프 방지를 위한 ref
  const lastProcessedAddressId = useRef<number | null>(null);

  // 새로운 주소 검색인지 추적하는 상태 추가
  const [isNewAddressSearch, setIsNewAddressSearch] = useState(false);

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
    searchQuery,
    savedLawdCode,
    setRoadAddress,
    setSearchQuery,
    setSavedLawdCode,
  } = useMainPageState();

  // UserAddressStore에서 동/호 상태 가져오기
  const { dong, ho, setDong, setHo } = useUserAddressStore();

  // 지도 관련 Store
  const { setMapCenter, setSearchLocationMarker, setAdjustBounds } =
    useMapStore();

  // 실거래가 데이터 Store
  const { clearTransactionData, isLoading } = useTransactionDataStore();

  // storeSelectedAddress가 변경될 때마다 상태 업데이트 (드롭다운 선택 시)
  useEffect(() => {
    if (storeSelectedAddress) {
      // 이미 같은 주소가 선택되어 있다면 상태 업데이트하지 않음
      const currentAddress = `${roadAddress} ${dong}동`.trim();
      const newAddress = storeSelectedAddress.completeAddress;

      if (isSameAddress(currentAddress, newAddress)) {
        return;
      }

      // 무한 루프 방지를 위한 추가 검증
      const currentSelectedId = storeSelectedAddress.id;

      if (lastProcessedAddressId.current === currentSelectedId) {
        return;
      }

      lastProcessedAddressId.current = currentSelectedId;

      // 동 정보만 사용 (호는 저장 시에만 사용)
      const { dong: extractedDong } = extractDongHo(storeSelectedAddress);

      // 도로명 주소가 있으면 도로명 주소 사용, 없으면 지번 주소 사용
      const baseAddress = extractBaseAddress(storeSelectedAddress);

      // 드롭다운 주소로 메인 상태 업데이트
      setRoadAddress(baseAddress);
      // 동만 업데이트 (호는 기존 값 유지)
      setDong(extractedDong || '');
      setHo('');
      setSearchQuery(storeSelectedAddress.completeAddress);
      setSavedLawdCode(storeSelectedAddress.legalDistrictCode || '');

      // 주소 변경 시 실거래가 데이터 초기화
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
    // 새로운 주소 검색 시 실거래가 데이터 초기화
    if (!isLoading) {
      clearTransactionData();
    }

    // 새로운 주소를 휘발성 주소로 추가
    const newAddress = createUserAddressFromSearch(searchData);
    addVolatileAddress(newAddress);
  };

  // 주소 저장 핸들러
  const handleAddressSave = async (addressData: Omit<UserAddress, 'id'>) => {
    try {
      await addAddress(addressData);
    } catch (error) {
      console.error('주소 저장 실패:', error);
    }
  };

  // 주소 수동 저장 함수 (DB에 실제 저장) - 호 데이터 사용
  const saveAddressToUser = async (dongValue?: string, hoValue?: string) => {
    if (!storeSelectedAddress) {
      openModal({
        title: '알림',
        content: '저장할 주소가 선택되지 않았습니다.',
        icon: 'warning',
      });
      return;
    }

    // 전달받은 값 우선 사용, 없으면 store의 상태값 사용
    const currentDong = dongValue || dong || '';
    const currentHo = hoValue || ho || '';

    if (!currentDong) {
      openModal({
        title: '알림',
        content: '동을 입력해주세요.',
        icon: 'warning',
      });
      return;
    }

    try {
      // 호는 옵션으로 처리 (저장 시에만 사용)
      const hoPart = currentHo ? ` ${currentHo}호` : '';

      const completeAddress = `${storeSelectedAddress.roadAddress} ${currentDong}동${hoPart}`;

      // 중복 주소 체크
      const isDuplicate = storeUserAddresses.some(
        (address) =>
          address.id !== storeSelectedAddress.id &&
          address.completeAddress === completeAddress
      );

      if (isDuplicate) {
        openModal({
          title: '알림',
          content: '이미 저장된 주소입니다.',
          icon: 'warning',
        });
        return;
      }

      // 휘발성 주소인 경우 DB에 실제 저장
      if (storeSelectedAddress.isVolatile) {
        const addressData = {
          nickname: `${storeSelectedAddress.nickname} ${currentDong}동${currentHo}호`,
          x: storeSelectedAddress.x,
          y: storeSelectedAddress.y,
          isPrimary: false,
          legalDistrictCode: storeSelectedAddress.legalDistrictCode || '',
          dong: currentDong,
          ho: currentHo, // 호 데이터는 저장 시에만 사용
          lotAddress: storeSelectedAddress.lotAddress,
          roadAddress: storeSelectedAddress.roadAddress,
          completeAddress,
        };

        // DB에 저장
        await addAddress(addressData);

        // 휘발성 주소 삭제
        deleteVolatileAddress(storeSelectedAddress.id);

        // 쿼리 무효화하여 최신 데이터 가져오기
        await queryClient.invalidateQueries({
          queryKey: ['userAddresses'],
        });

        openModal({
          title: '성공',
          content: '주소가 성공적으로 저장되었습니다!',
          icon: 'success',
        });
      } else {
        // 기존 주소의 동/호 정보만 업데이트하는 경우
        // TODO: 기존 주소 업데이트 API 호출 필요
        const updatedAddress = {
          ...storeSelectedAddress,
          completeAddress,
          dong: currentDong,
          ho: currentHo, // 호 데이터는 저장 시에만 사용
        };

        selectAddress(updatedAddress);
        openModal({
          title: '성공',
          content: '주소 정보가 업데이트되었습니다!',
          icon: 'success',
        });
      }
    } catch (error) {
      console.error('주소 저장 실패:', error);
      openModal({
        title: '오류',
        content: '주소 저장 중 오류가 발생했습니다.',
        icon: 'error',
      });
    }
  };

  // 지도 이동 전용 (실거래가 데이터 없이) - 호 데이터 사용하지 않음
  const handleMoveToAddressOnly = async (currentDong?: string) => {
    // 전달받은 동 값 사용 (없으면 store의 상태값 사용)
    const dongValue = currentDong || dong || '';

    if (!dongValue) {
      openModal({
        title: '알림',
        content: '동을 입력해주세요.',
        icon: 'warning',
      });
      return;
    }

    // 동이 변경되었는지 확인 (호는 고려하지 않음)
    const isDongChanged =
      storeSelectedAddress && storeSelectedAddress.dong !== dongValue;
    const needsNewSearch = isNewAddressSearch || isDongChanged;

    // ✅ 새로운 주소 검색이거나 동이 변경된 경우 API 호출
    if (needsNewSearch) {
      // 새로운 주소 검색 - API 호출 필요
      if (!roadAddress) {
        openModal({
          title: '알림',
          content: '상세 주소를 입력해주세요.',
          icon: 'warning',
        });
        return;
      }

      setAdjustBounds(false); // 자동 조정 비활성화

      try {
        // API 호출로 좌표 가져오기 (호는 사용하지 않음)
        const completeAddress = `${roadAddress} ${dongValue}동`;
        const searchData = await placesApi.searchByKeyword(completeAddress);

        if (searchData && searchData.length > 0) {
          const location = {
            lat: parseFloat(searchData[0].latitude),
            lng: parseFloat(searchData[0].longitude),
          };
          setMapCenter(location);
          setSearchLocationMarker(location);
        } else {
          openModal({
            title: '알림',
            content: '해당 주소를 찾을 수 없습니다.',
            icon: 'warning',
          });
        }
      } catch (error) {
        console.error('키워드 검색 실패 (지도 이동 전용):', error);
        openModal({
          title: '오류',
          content: '키워드 검색 중 오류가 발생했습니다.',
          icon: 'error',
        });
      }
    } else {
      // ✅ 기존 저장된 주소 사용 - API 호출 불필요
      if (storeSelectedAddress) {
        const location = {
          lat: storeSelectedAddress.y,
          lng: storeSelectedAddress.x,
        };
        setMapCenter(location);
        setSearchLocationMarker(location);
      }
    }
  };

  // 주소 변경 시 실거래가 데이터도 함께 가져오기
  const handleAddressChangeWithTransaction = (address: UserAddress) => {
    // 주소 선택 (상태 업데이트는 useEffect에서 처리)
    selectAddress(address);
  };

  return {
    // 상태
    selectedAddress: storeSelectedAddress,
    userAddresses: storeUserAddresses,
    roadAddress,
    dong,
    ho, // 호는 저장 시에만 사용하지만 상태는 유지
    searchQuery,
    savedLawdCode,
    isNewAddressSearch,

    // 핸들러
    handleAddressSelect,
    handleAddressSearch,
    handleAddressSave,
    saveAddressToUser,
    handleMoveToAddressOnly,
    handleAddressChangeWithTransaction,

    // 기타
    selectAddress,
    addAddress,
    deleteAddress,
    addVolatileAddress,
    deleteVolatileAddress,
  };
};
