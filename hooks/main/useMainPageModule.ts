import { useEffect, useState, useRef } from 'react';
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
import { useUserAddresses } from '../useUserAddresses';
import { parseAddress } from '@utils/addressParser';

export const useMainPageModule = () => {
  const queryClient = useQueryClient();

  // 무한 루프 방지를 위한 ref
  const lastProcessedAddressId = useRef<number | null>(null);

  // 새로운 주소 검색인지 추적하는 상태 추가
  const [isNewAddressSearch, setIsNewAddressSearch] = useState(false);

  // 앱 초기화 완료 여부를 추적하는 플래그
  const [isInitialized, setIsInitialized] = useState(false);

  // 세션 종료 시 휘발성 주소 정리
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 휘발성 주소들 삭제
      const volatileAddresses = storeUserAddresses.filter(
        (addr) => addr.isVolatile
      );
      volatileAddresses.forEach((addr) => {
        deleteAddress(addr.id);
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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

  // React Query로 초기 데이터 로드 (useCallback으로 최적화됨)
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
    addVolatileAddress, // 휘발성 주소 추가
    deleteVolatileAddress, // 휘발성 주소 삭제
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

  // storeSelectedAddress가 변경될 때마다 상태 업데이트 (드롭다운 선택 시)
  useEffect(() => {
    if (storeSelectedAddress) {
      // 이미 같은 주소가 선택되어 있다면 상태 업데이트하지 않음
      const currentAddress = `${roadAddress} ${dong}동 ${ho}호`.trim();
      const newAddress = storeSelectedAddress.completeAddress;

      if (currentAddress === newAddress) {
        return;
      }

      // 무한 루프 방지를 위한 추가 검증
      const currentSelectedId = storeSelectedAddress.id;

      if (lastProcessedAddressId.current === currentSelectedId) {
        return;
      }

      lastProcessedAddressId.current = currentSelectedId;

      // 동/호 정보를 직접 사용
      const extractedDong = storeSelectedAddress.dong || '';
      const extractedHo = storeSelectedAddress.ho || '';

      // 도로명 주소가 있으면 도로명 주소 사용, 없으면 지번 주소 사용
      let baseAddress = '';
      if (
        storeSelectedAddress.roadAddress &&
        storeSelectedAddress.roadAddress.trim()
      ) {
        baseAddress = storeSelectedAddress.roadAddress.trim();
      } else if (
        storeSelectedAddress.lotAddress &&
        storeSelectedAddress.lotAddress.trim()
      ) {
        baseAddress = storeSelectedAddress.lotAddress.trim();
      } else {
        baseAddress = storeSelectedAddress.completeAddress;
      }

      // 드롭다운 주소로 메인 상태 업데이트
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
        const location = {
          lat: storeSelectedAddress.y,
          lng: storeSelectedAddress.x,
        };
        setMapCenter(location);
        setSearchLocationMarker(location);
      }
    }
  }, [storeSelectedAddress?.id, clearTransactionData, isLoading]); // 필요한 의존성만 포함

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
  const { execDaumPostcode, postcodeRef } = useDaumPostcode(async (data) => {
    // 새로운 주소 검색 시 실거래가 데이터 초기화
    if (!isLoading) {
      clearTransactionData();
    }

    try {
      // 키워드 검색으로 좌표 가져오기
      const searchData = await placesApi.searchByKeyword(data.address);
      if (searchData && searchData.length > 0) {
        const location = {
          lat: parseFloat(searchData[0].latitude),
          lng: parseFloat(searchData[0].longitude),
        };

        // 새 주소를 즉시 store에 저장 (휘발성)
        const newAddressData = {
          nickname: '새 주소',
          x: location.lng,
          y: location.lat,
          isPrimary: false,
          isVolatile: true, // 휘발성 플래그
          legalDistrictCode: data.bcode.substring(0, 5) || '',
          lotAddress: data.jibunAddress || '',
          roadAddress: data.roadAddress || '',
          completeAddress: data.address,
          dong: '',
          ho: '',
        };

        // 기존 휘발성 주소가 있으면 삭제 (최신 주소만 유지)
        const existingVolatileAddress = storeUserAddresses.find(
          (addr) => addr.isVolatile
        );
        if (existingVolatileAddress) {
          deleteVolatileAddress(existingVolatileAddress.id);
        }

        // 새 주소를 store에만 저장 (DB 저장 없음)
        const tempId = Date.now();
        const newAddressWithId = {
          ...newAddressData,
          id: tempId,
        };
        addVolatileAddress(newAddressWithId);

        // 새로 저장된 주소를 자동으로 선택
        selectAddress(newAddressWithId);

        // 메인 상태 업데이트
        setRoadAddress(data.roadAddress || '');
        setDong('');
        setHo('');
        setSearchQuery(data.address || '');
        setSavedLawdCode(data.bcode.substring(0, 5) || '');

        // 새 주소 검색 상태 설정
        setIsNewAddressSearch(true);

        // 주소 저장 데이터 설정
        const addressSaveData = {
          roadAddress: data.roadAddress || '',
          jibunAddress: data.jibunAddress || '',
          legalDistrictCode: data.bcode.substring(0, 5) || '',
        };
        setAddressSaveData(addressSaveData);
        setShowPostcode(false);

        // 새 주소 검색 완료 후 상태 초기화 (다음 검색을 위해)
        setTimeout(() => {
          setIsNewAddressSearch(false);
        }, 100);
      } else {
        alert('주소를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('주소 검색 실패:', error);
      alert('주소 검색 중 오류가 발생했습니다.');
    }
  }, setShowPostcode);

  // 사용자 주소 데이터 로드 시 초기 상태 설정 (앱 최초 로드 시에만)
  useEffect(() => {
    console.log('🔍 초기화 useEffect 조건 확인:', {
      isAuthenticated,
      storeUserAddressesLength: storeUserAddresses.length,
      roadAddress: roadAddress || '',
      dong: dong || '',
      storeSelectedAddress: !!storeSelectedAddress,
      userAddressesLoading,
    });

    // 초기화 로직 완전 비활성화 (탭 이동 시 문제 해결)
    if (false) {
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

        // 초기 주소 선택
        selectAddress(targetAddress);
      }

      // 초기 상태 설정 시 실거래가 데이터 초기화는 제거
      // 앱 초기 로드 시에는 기존 데이터를 유지
      if (!isLoading) {
        clearTransactionData();
      }

      // 초기화 완료 플래그 설정
      setIsInitialized(true);
    }
  }, [
    isAuthenticated,
    userAddressesLoading,
    isInitialized, // 초기화 플래그 추가
    // storeUserAddresses.length 제거 - 새 주소 추가 시 불필요한 초기화 방지
    // setter 함수들은 의존성에서 제거 (무한 루프 방지)
  ]);

  // 주소 변경 시 실거래가 데이터도 함께 가져오기
  const handleAddressChangeWithTransaction = (address: UserAddress) => {
    console.log('handleAddressChangeWithTransaction 호출됨:', {
      address,
    });

    // 주소 선택 (상태 업데이트는 useEffect에서 처리)
    selectAddress(address);
  };

  // 지도 이동 전용 (실거래가 데이터 없이)
  const handleMoveToAddressOnly = async (
    currentDong?: string,
    currentHo?: string
  ) => {
    console.log('handleMoveToAddressOnly 호출됨:', { currentDong, currentHo });

    // 전달받은 동/호 값 사용 (없으면 DOM에서 가져오기)
    const dongValue = currentDong || dong || '';
    const hoValue = currentHo || ho || '';

    console.log('동/호 값:', { dongValue, hoValue, roadAddress });

    if (!dongValue) {
      alert('동을 입력해주세요.');
      return;
    }

    // 동/호가 변경되었는지 확인
    const isDongChanged =
      storeSelectedAddress && storeSelectedAddress.dong !== dongValue;
    const isHoChanged =
      storeSelectedAddress && storeSelectedAddress.ho !== hoValue;
    const needsNewSearch = isNewAddressSearch || isDongChanged || isHoChanged;

    console.log('검색 필요 여부:', {
      isDongChanged,
      isHoChanged,
      needsNewSearch,
    });

    // ✅ 새로운 주소 검색이거나 동/호가 변경된 경우 API 호출
    if (needsNewSearch) {
      // 새로운 주소 검색 - API 호출 필요
      if (!roadAddress) {
        alert('상세 주소를 입력해주세요.');
        return;
      }

      setAdjustBounds(false); // 자동 조정 비활성화

      try {
        // API 호출로 좌표 가져오기
        const hoPart = hoValue ? ` ${hoValue}호` : '';
        const completeAddress = `${roadAddress} ${dongValue}동${hoPart}`;
        console.log('검색할 주소:', completeAddress);
        const searchData = await placesApi.searchByKeyword(completeAddress);
        console.log('검색 결과:', searchData);

        if (searchData && searchData.length > 0) {
          const location = {
            lat: parseFloat(searchData[0].latitude),
            lng: parseFloat(searchData[0].longitude),
          };
          console.log('지도 이동할 위치:', location);
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

  // 주소 수동 저장 함수 (DB에 실제 저장)
  const saveAddressToUser = async () => {
    if (!storeSelectedAddress) {
      alert('저장할 주소가 선택되지 않았습니다.');
      return;
    }

    // 현재 상태에서 동/호 값 가져오기
    const currentDong = dong || '';
    const currentHo = ho || '';

    if (!currentDong) {
      alert('동을 입력해주세요.');
      return;
    }

    try {
      // 호는 옵션으로 처리
      const hoPart = currentHo ? ` ${currentHo}호` : '';
      const completeAddress = `${storeSelectedAddress.roadAddress} ${currentDong}동${hoPart}`;

      // 중복 주소 체크
      const isDuplicate = storeUserAddresses.some(
        (address) =>
          address.id !== storeSelectedAddress.id &&
          address.completeAddress === completeAddress
      );

      if (isDuplicate) {
        alert('이미 저장된 주소입니다.');
        return;
      }

      // 휘발성 주소인 경우 DB에 실제 저장
      if (storeSelectedAddress.isVolatile) {
        const addressData = {
          nickname: storeSelectedAddress.nickname,
          x: storeSelectedAddress.x,
          y: storeSelectedAddress.y,
          isPrimary: false,
          legalDistrictCode: storeSelectedAddress.legalDistrictCode || '',
          dong: currentDong,
          ho: currentHo,
          lotAddress: storeSelectedAddress.lotAddress,
          roadAddress: storeSelectedAddress.roadAddress,
          completeAddress,
        };

        console.log('🔄 휘발성 주소를 DB에 저장:', addressData);

        // DB에 저장
        await addAddress(addressData);

        // 휘발성 주소 삭제
        deleteVolatileAddress(storeSelectedAddress.id);

        // 쿼리 무효화하여 최신 데이터 가져오기
        await queryClient.invalidateQueries({
          queryKey: ['userAddresses'],
        });

        alert('주소가 성공적으로 저장되었습니다!');
      } else {
        // 기존 주소의 동/호 정보만 업데이트하는 경우
        // TODO: 기존 주소 업데이트 API 호출 필요
        const updatedAddress = {
          ...storeSelectedAddress,
          completeAddress,
          dong: currentDong,
          ho: currentHo,
        };

        selectAddress(updatedAddress);
        alert('주소 정보가 업데이트되었습니다!');
      }
    } catch (error) {
      console.error('주소 저장 실패:', error);
      alert('주소 저장 중 오류가 발생했습니다.');
    }
  };

  // 실거래가 조회 (새로운 API 사용)
  const handleMoveToAddress = (
    selectedType: string = '0',
    buildingCode?: string
  ) => {
    try {
      console.log('🔍 실거래가 조회 시작 - 기존 데이터 초기화');

      // 실거래가 조회 시작 시 기존 데이터 초기화
      clearTransactionData();

      // 주소 파싱
      const address = storeSelectedAddress?.completeAddress || '';

      const parsedAddress = parseAddress(address);

      // 선택된 타입에 따라 API 타입 결정
      // 0: 아파트, 1: 연립/다세대, 2: 오피스텔
      const apiType = selectedType;

      // 건물 코드가 있고 아파트/연립/오피스텔인 경우 fetchTransactionDetailApart 사용
      if (
        buildingCode &&
        (apiType === '0' || apiType === '1' || apiType === '2')
      ) {
        fetchTransactionDetailApart({
          buildingCode,
          type: apiType,
          contractYear: selectedYear,
          contractType: '0', // 전체
        });
      } else {
        // 건물 코드가 없거나 단독/다가구인 경우 fetchTransactionDetailSingle 사용
        fetchTransactionDetailSingle({
          addrSido: parsedAddress.addrSido,
          addrSigungu: parsedAddress.addrSigungu,
          addrDong: parsedAddress.addrDong,
          type: apiType,
          contractYear: selectedYear,
          contractType: '0', // 전체
        });
      }
    } catch (error) {
      console.error('실거래가 조회 실패:', error);
      alert('실거래가 조회 중 오류가 발생했습니다.');
    }
  };

  // 건물 선택 시 호출되는 함수
  const handleBuildingSelect = async (
    buildingCode: string,
    buildingName: string
  ) => {
    try {
      console.log('🔍 건물 선택 - 실거래가 조회 시작 - 기존 데이터 초기화');

      // 실거래가 조회 시작 시 기존 데이터 초기화
      clearTransactionData();

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

  // 현재 선택된 주소 (단순화된 로직)
  const currentSelectedAddress = storeSelectedAddress;

  return {
    // 상태
    userAddresses: storeUserAddresses,
    selectedAddress: currentSelectedAddress,
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
