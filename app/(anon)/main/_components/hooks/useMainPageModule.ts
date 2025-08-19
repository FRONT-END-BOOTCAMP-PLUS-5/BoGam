import { useEffect, useState } from 'react';
import { useMainPageState } from './useMainPageState';
import { useAddressSearch } from './useAddressSearch';
import { useTransactionData } from './useTransactionData';
import { useTransactionDetail } from './useTransactionDetail';
import { useDaumPostcode } from './useDaumPostcode';
import { useLocationManager } from './useLocationManager';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { placesApi } from '@libs/api_front/places.api';
import { userAddressApi } from '@libs/api_front/userAddress.api';
import { useQueryClient } from '@tanstack/react-query';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { useMapStore } from '@libs/stores/map/mapStore';
import { useUserAddresses } from '../../../../../hooks/useUserAddresses';
import { parseAddress } from '@utils/addressParser';

export const useMainPageModule = () => {
  const queryClient = useQueryClient();

  // 새로운 주소 검색인지 추적하는 상태 추가
  const [isNewAddressSearch, setIsNewAddressSearch] = useState(false);

  // 실거래가 조회 모달 상태
  const [showTransactionSearchModal, setShowTransactionSearchModal] =
    useState(false);

  // 검색 관련 상태 관리
  const {
    searchQuery,
    roadAddress,
    dong,
    ho,
    savedLawdCode,
    buildingType,
    selectedYear,
    selectedMonth,
    showPostcode,
    addressSaveData,

    // 상태 설정 함수
    setSearchQuery,
    setRoadAddress,
    setDong,
    setHo,
    setSavedLawdCode,
    setBuildingType,
    setSelectedYear,
    setSelectedMonth,
    setShowPostcode,
    setAddressSaveData,
  } = useMainPageState();

  // React Query로 초기 데이터 로드
  const { isLoading: userAddressesLoading, isAuthenticated } =
    useUserAddresses();

  // Store에서 데이터 가져오기
  const {
    userAddresses: storeUserAddresses,
    selectedAddress: storeSelectedAddress,
    selectAddress,
    addAddress,
    deleteAddress,
    clearSelectedAddress, // 추가
  } = useUserAddressStore();

  // 지도 관련 Store
  const {
    mapCenter,
    searchLocationMarker,
    adjustBounds,
    setMapCenter,
    setSearchLocationMarker,
    setAdjustBounds,
  } = useMapStore();

  // 실거래가 데이터 Store
  const {
    transactionData,
    setTransactionData,
    clearTransactionData,
    isLoading,
  } = useTransactionDataStore();

  // 위치 관리 (GPS 또는 사용자 주소 기반)
  const {
    gpsLocation,
    gpsLoading,
    gpsError,
    refreshGPSLocation,
    currentLocationType,
  } = useLocationManager();

  // 주소 검색 관리
  const { handleDaumPostcodeResult } = useAddressSearch();

  // 실거래가 데이터 관리
  const { fetchTransactionDataByCode } = useTransactionData();
  const { fetchTransactionDetailApart, fetchTransactionDetailSingle } =
    useTransactionDetail();

  // API 호출 필요 여부 판단 기준
  const isNewAddressSearchRequired = () => {
    // 1. 새로운 주소 검색 상태이면 API 호출 필요
    if (isNewAddressSearch) return true;

    // 2. selectedAddress가 없으면 새로운 주소 검색
    if (!storeSelectedAddress) return true;

    // 3. 그 외에는 기존 저장된 주소 사용 (API 호출 불필요)
    return false;
  };

  // Daum 우편번호 관리
  const { execDaumPostcode, postcodeRef } = useDaumPostcode((data) => {
    // 새로운 주소 검색 시 selectedAddress 초기화
    clearSelectedAddress();

    // 새로운 주소 검색 시 실거래가 데이터 초기화 (단, 실거래가 조회 중이 아닐 때만)
    if (!isLoading) {
      clearTransactionData();
    }

    // 새로운 주소 검색 상태로 설정
    setIsNewAddressSearch(true);

    handleDaumPostcodeResult(
      data,
      setRoadAddress,
      setSavedLawdCode,
      setDong,
      setHo,
      setSearchQuery,
      setShowPostcode,
      setAddressSaveData
    );
  }, setShowPostcode);

  // 사용자 주소 데이터 로드 시 초기 상태 설정
  useEffect(() => {
    if (
      isAuthenticated &&
      storeUserAddresses.length > 0 &&
      !(roadAddress || '').trim() && // roadAddress가 비어있을 때만 초기화
      !(dong || '').trim() // dong이 비어있을 때만 초기화
    ) {
      // 대표 주소 또는 첫 번째 주소 선택
      const targetAddress =
        storeUserAddresses.find((addr) => addr.isPrimary) ||
        storeUserAddresses[0];

      if (targetAddress) {
        const extractedDong = targetAddress.dong || '';
        const extractedHo = targetAddress.ho || '';

        let baseAddress = '';
        if (targetAddress.roadAddress?.trim()) {
          baseAddress = targetAddress.roadAddress.trim();
        } else if (targetAddress.lotAddress?.trim()) {
          baseAddress = targetAddress.lotAddress.trim();
        } else {
          let detailPart = targetAddress.completeAddress;
          if (extractedDong) {
            detailPart = detailPart.replace(extractedDong, '').trim();
          }
          if (extractedHo) {
            detailPart = detailPart.replace(extractedHo, '').trim();
          }
          baseAddress = detailPart;
        }

        setRoadAddress(baseAddress);
        setDong(extractedDong);
        setHo(extractedHo);
        setSearchQuery(targetAddress.completeAddress);
        setSavedLawdCode(targetAddress.legalDistrictCode || '');
      }

      // 초기 상태 설정 시 실거래가 데이터 초기화 (단, 실거래가 조회 중이 아닐 때만)
      if (!isLoading) {
        clearTransactionData();
      }
    }
  }, [
    isAuthenticated,
    storeUserAddresses.length,
    storeUserAddresses.find((addr) => addr.isPrimary)?.id, // 대표 주소 ID 변경 감지
    // setter 함수들은 의존성에서 제거 (무한 루프 방지)
  ]);

  // 주소 변경 시 실거래가 데이터도 함께 가져오기
  const handleAddressChangeWithTransaction = (address: UserAddress) => {
    selectAddress(address);

    // 기존 저장된 주소 선택 상태로 설정
    setIsNewAddressSearch(false);

    // 선택된 주소 정보를 파싱하여 상태 업데이트
    if (address) {
      // 동/호 정보를 직접 사용 (정규식 추출 불필요)
      const extractedDong = address.dong || '';
      const extractedHo = address.ho || '';

      // 도로명 주소가 있으면 도로명 주소 사용, 없으면 지번 주소 사용
      let baseAddress = '';
      if (address.roadAddress && address.roadAddress.trim()) {
        baseAddress = address.roadAddress.trim();
      } else if (address.lotAddress && address.lotAddress.trim()) {
        baseAddress = address.lotAddress.trim();
      } else {
        // 둘 다 없으면 completeAddress에서 동/호 제거한 값 사용
        const detailPart = address.completeAddress;
        baseAddress = detailPart;
      }

      // 상태 설정
      setRoadAddress(baseAddress);
      setDong(extractedDong);
      setHo(extractedHo);

      setSearchQuery(address.completeAddress);
      setSavedLawdCode(address.legalDistrictCode || '');

      // 주소 변경 시 실거래가 데이터 초기화 (단, 실거래가 조회 중이 아닐 때만)
      if (!isLoading) {
        clearTransactionData();
      }

      // 선택된 주소의 좌표로 지도 이동
      if (address.x && address.y) {
        const location = {
          lat: address.y,
          lng: address.x,
        };
        setMapCenter(location);
        setSearchLocationMarker(location);
      }
    } else {
      console.error(
        '❌ handleAddressChangeWithTransaction - address가 null입니다.'
      );
    }
  };

  // 지도 이동 전용 (실거래가 데이터 없이)
  const handleMoveToAddressOnly = async () => {
    const isNewSearchRequired = isNewAddressSearchRequired();

    // ✅ 새로운 주소 검색인지 판단
    if (isNewSearchRequired) {
      // 새로운 주소 검색 - API 호출 필요
      if (!roadAddress) {
        alert('상세 주소를 입력해주세요.');
        return;
      }

      // ref를 통해 동/호 값을 가져오기
      const dongInput = document.querySelector(
        'input[placeholder="동 (예: 101)"]'
      ) as HTMLInputElement;
      const hoInput = document.querySelector(
        'input[placeholder="호 (선택사항)"]'
      ) as HTMLInputElement;

      const currentDong = dongInput ? dongInput.value.trim() : '';
      const currentHo = hoInput ? hoInput.value.trim() : '';

      if (!currentDong) {
        alert('동을 입력해주세요.');
        return;
      }

      setAdjustBounds(false); // 자동 조정 비활성화

      try {
        // API 호출로 좌표 가져오기
        const hoPart = currentHo ? ` ${currentHo}호` : '';
        const completeAddress = `${roadAddress} ${currentDong}동${hoPart}`;
        const searchData = await placesApi.searchByKeyword(completeAddress);

        if (searchData && searchData.length > 0) {
          const location = {
            lat: parseFloat(searchData[0].latitude),
            lng: parseFloat(searchData[0].longitude),
          };
          setMapCenter(location);
          setSearchLocationMarker(location);
        } else {
          alert('해당 주소를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('키워드 검색 실패 (지도 이동 전용):', error);
        alert('키워드 검색 중 오류가 발생했습니다.');
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

  // 주소 수동 저장 함수
  const saveAddressToUser = async () => {
    if (!roadAddress) {
      console.error('❌ 저장하기 실패 - 조건 불만족:', {
        roadAddress: roadAddress || 'undefined',
      });
      alert('상세 주소를 입력해주세요.');
      return;
    }

    // ref를 통해 동/호 값을 가져오기
    const dongInput = document.querySelector(
      'input[placeholder="동 (예: 101)"]'
    ) as HTMLInputElement;
    const hoInput = document.querySelector(
      'input[placeholder="호 (선택사항)"]'
    ) as HTMLInputElement;

    const currentDong = dongInput ? dongInput.value.trim() : '';
    const currentHo = hoInput ? hoInput.value.trim() : '';

    if (!currentDong) {
      alert('동을 입력해주세요.');
      return;
    }

    // savedLawdCode가 없으면 현재 선택된 주소의 legalDistrictCode 사용
    let lawdCode = savedLawdCode;
    if (!lawdCode && storeSelectedAddress?.legalDistrictCode) {
      lawdCode = storeSelectedAddress.legalDistrictCode;
    } else if (!lawdCode) {
      // legalDistrictCode도 없으면 좌표로 법정동 코드 가져오기 (임시)
      try {
        const coordData = await placesApi.coord2Address(
          storeSelectedAddress?.x || 0,
          storeSelectedAddress?.y || 0
        );
        if (coordData.success && coordData.data) {
          // coord2Address는 주소만 반환하므로, 법정동 코드는 다른 방법으로 얻어야 함
          // 임시로 기본값 사용 (실제로는 다른 API 호출 필요)
          lawdCode = '1168010100'; // 강남구 기본값
        }
      } catch (error) {
        console.error('좌표로 법정동 코드 변환 실패:', error);
        alert('법정동 코드를 가져올 수 없습니다.');
        return;
      }
    }

    if (!lawdCode) {
      alert('법정동 코드를 가져올 수 없습니다.');
      return;
    }

    try {
      // 호는 옵션으로 처리
      const hoPart = currentHo ? ` ${currentHo}호` : '';
      const completeAddress = `${roadAddress} ${currentDong}동${hoPart}`;

      // 키워드 검색으로 좌표 가져오기
      const searchData = await placesApi.searchByKeyword(completeAddress);
      if (searchData && searchData.length > 0) {
        const rawLat = parseFloat(searchData[0].latitude);
        const rawLng = parseFloat(searchData[0].longitude);

        // 좌표 유효성 검사
        if (rawLat === rawLng || isNaN(rawLat) || isNaN(rawLng)) {
          console.error('잘못된 좌표 데이터:', { lat: rawLat, lng: rawLng });
          alert('주소의 좌표를 가져올 수 없습니다. 다른 주소를 시도해주세요.');
          return;
        }

        const location = {
          lat: rawLat,
          lng: rawLng,
        };

        // 도로명 주소와 지번 주소 준비
        const roadAddressWithDetail = addressSaveData.roadAddress
          ? `${addressSaveData.roadAddress} ${currentDong}동${hoPart}`
          : completeAddress;
        const lotAddressWithDetail = addressSaveData.jibunAddress
          ? `${addressSaveData.jibunAddress} ${currentDong}동${hoPart}`
          : completeAddress;

        // 프론트엔드에서 중복 주소 체크 (선택적)
        const isDuplicate = storeUserAddresses.some(
          (address) =>
            address.completeAddress === completeAddress ||
            (address.x === location.lng && address.y === location.lat)
        );

        if (isDuplicate) {
          alert('이미 저장된 주소입니다.');
          return;
        }

        // 지번 주소 처리 개선: 비어있을 때 대체값 사용
        const lotAddress =
          addressSaveData.jibunAddress ||
          (addressSaveData.roadAddress ? '' : roadAddress); // 도로명 주소가 없으면 현재 roadAddress 사용

        // 임시 ID 생성 (addAddress에서 사용할 것과 동일)
        const tempId = Date.now();

        // 현재 주소 저장
        const addressData = {
          nickname: `주소_${storeUserAddresses.length + 1}`, // 자동 생성
          x: location.lng,
          y: location.lat,
          isPrimary: false,
          legalDistrictCode: savedLawdCode,
          lotAddress: lotAddress,
          roadAddress: addressSaveData.roadAddress,
          completeAddress: completeAddress,
          dong: currentDong, // 동 정보 추가
          ho: currentHo, // 호 정보 추가
        };

        await addAddress(addressData);

        alert('주소가 성공적으로 저장되었습니다!');

        // 주소 저장 성공 시 사용자 주소 리스트 캐시 무효화 (staleTime: 0으로 인해 즉시 refetch됨)
        await queryClient.invalidateQueries({
          queryKey: ['userAddresses'],
        });

        // 강제로 refetch하여 최신 데이터 가져오기
        await queryClient.refetchQueries({
          queryKey: ['userAddresses'],
          exact: true,
        });

        // 새로 저장된 주소를 자동으로 선택 (임시 ID로 찾기)
        const newAddress = {
          id: tempId,
          nickname: `주소_${storeUserAddresses.length + 1}`,
          x: location.lng,
          y: location.lat,
          isPrimary: false,
          legalDistrictCode: savedLawdCode,
          lotAddress: lotAddress,
          roadAddress: addressSaveData.roadAddress,
          completeAddress: completeAddress,
          dong: currentDong, // 동 정보 추가
          ho: currentHo, // 호 정보 추가
        };

        // 새로 저장된 주소를 선택하고 새로운 주소 검색 상태 해제
        selectAddress(newAddress);
        setIsNewAddressSearch(false);
      } else {
        alert('주소를 찾을 수 없어 저장할 수 없습니다.');
      }
    } catch (error) {
      console.error('주소 저장 실패:', error);
      alert('주소 저장 중 오류가 발생했습니다.');
    }
  };

  // 실거래가 조회 (새로운 API 사용)
  const handleMoveToAddress = async () => {
    // 실거래가 조회 모달 열기
    setShowTransactionSearchModal(true);
  };

  // 건물 선택 시 호출되는 함수
  const handleBuildingSelect = async (
    buildingCode: string,
    buildingName: string
  ) => {
    try {
      // buildingType을 API type으로 매핑
      const getApiType = (buildingType: string): string => {
        switch (buildingType) {
          case 'apartment':
            return '0'; // 아파트
          case 'villa':
            return '1'; // 연립/다세대
          case 'officetel':
            return '2'; // 오피스텔
          case 'detached':
            return '1'; // 단독/다가구는 연립/다세대로 분류
          case 'multi':
            return '1'; // 다세대는 연립/다세대로 분류
          default:
            return '0'; // 기본값은 아파트
        }
      };

      const apiType = getApiType(buildingType.type);

      // 건물 타입에 따라 적절한 API 호출
      if (buildingType.type === 'detached') {
        // 단독/다가구는 별도 API 사용

        // 주소 파싱
        const address = storeSelectedAddress?.completeAddress || '';
        const parsedAddress = parseAddress(address);

        await fetchTransactionDetailSingle({
          addrSido: parsedAddress.addrSido,
          addrSigungu: parsedAddress.addrSigungu,
          addrDong: parsedAddress.addrDong,
          type: apiType,
          contractYear: selectedYear,
          contractType: '0', // 전체
        });
      } else {
        // 아파트, 연립, 오피스텔 등은 buildingCode 사용
        await fetchTransactionDetailApart({
          buildingCode,
          type: apiType,
          contractYear: selectedYear,
          contractType: '0', // 전체
        });
      }
    } catch (error) {
      alert('실거래가 조회 중 오류가 발생했습니다.');
    }
  };

  return {
    // 상태
    userAddresses: storeUserAddresses,
    selectedAddress: storeSelectedAddress,
    searchQuery,
    roadAddress,
    dong,
    ho,
    savedLawdCode,
    buildingType,
    selectedYear,
    selectedMonth,
    showPostcode,
    isNewAddressSearch,

    // 위치 관리 상태
    gpsLocation,
    gpsLoading,
    gpsError,
    currentLocationType,

    // 상태 설정 함수
    setSearchQuery,
    setDong,
    setHo,
    setBuildingType,
    setSelectedYear,
    setSelectedMonth,
    setShowPostcode,

    // 액션 함수
    handleAddressChangeWithTransaction,
    handleMoveToAddress,
    handleMoveToAddressOnly,
    onSearch: execDaumPostcode,
    postcodeRef,

    // 위치 관리 액션 함수
    refreshGPSLocation,

    // 주소 저장 함수
    saveAddressToUser,

    // 실거래가 조회 모달 관련
    showTransactionSearchModal,
    setShowTransactionSearchModal,
    handleBuildingSelect,
  };
};
