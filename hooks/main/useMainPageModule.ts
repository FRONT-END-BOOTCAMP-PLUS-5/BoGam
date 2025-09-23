import { useAddressManagement } from './useAddressManagement';
import { useMapManagement } from './useMapManagement';
import { useTabManagement } from './useTabManagement';
import { useMainPageState } from './useMainPageState';
import { useLocationManager } from './useLocationManager';
import { useDaumPostcode } from './useDaumPostcode';
import { useUserAddresses } from '../useUserAddresses';
import { placesApi } from '@libs/api_front/places.api';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { DaumPostcodeData } from '@/(anon)/main/_components/types/mainPage.types';
import { useToastStore } from '@libs/stores/toastStore';

export const useMainPageModule = () => {

  // 분리된 hooks 사용
  const addressManagement = useAddressManagement();
  const mapManagement = useMapManagement();
  const tabManagement = useTabManagement();
  const mainPageState = useMainPageState();
  const locationManager = useLocationManager();
  const { isLoading: userAddressesLoading, isAuthenticated } =
    useUserAddresses();

  // 모달 스토어
  const { showError } = useToastStore();

  // Store에서 데이터 가져오기
  const {
    userAddresses: storeUserAddresses,
    addVolatileAddress,
    deleteVolatileAddress,
  } = useUserAddressStore();

  // 실거래가 데이터는 transactionManagement에서 관리

  // Daum Postcode 콜백 함수
  const handleDaumPostcodeComplete = async (data: DaumPostcodeData) => {

    try {
      // 키워드 검색으로 좌표 가져오기
      const searchData = await placesApi.searchByKeyword(data.address);
      if (searchData && searchData.length > 0) {
        const location = {
          lat: parseFloat(searchData[0].latitude),
          lng: parseFloat(searchData[0].longitude),
        };

        // 새 주소를 즉시 store에 저장 (휘발성) - 호는 빈 값으로 설정
        const newAddressData = {
          nickname: `${data.address}`,
          x: location.lng,
          y: location.lat,
          isPrimary: false,
          isVolatile: true, // 휘발성 플래그
          legalDistrictCode: data.bcode.substring(0, 5) || '',
          lotAddress: data.jibunAddress || '',
          roadAddress: data.roadAddress || '',
          completeAddress: data.address,
          dong: '', // 동은 사용자가 입력
          ho: '', // 호는 저장 시에만 사용
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
          isSelected: true, // 새로 추가된 주소를 선택된 주소로 설정
        };

        // 리팩토링된 addVolatileAddress 호출 (자동으로 isNewAddressSearch 설정됨)
        await addVolatileAddress(newAddressWithId);

        // 새로운 주소 추가 시 페이지 이동 방지
        sessionStorage.setItem('allow-navigation', 'false');

        // 메인 상태 업데이트 (호는 초기화)
        mainPageState.setRoadAddress(data.roadAddress || '');
        mainPageState.setSearchQuery(data.address || '');
        mainPageState.setSavedLawdCode(data.bcode.substring(0, 5) || '');
        mainPageState.setShowPostcode(false);

        // 새 주소 추가 시 호 초기화
        const { setHo, setDong } = useUserAddressStore.getState();
        setHo('');
        setDong('');
      } else {
        showError('주소를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('주소 검색 실패:', error);
      showError('주소 검색 중 오류가 발생했습니다.');
    }
  };

  const { execDaumPostcode, executePostcode, postcodeRef } = useDaumPostcode(
    handleDaumPostcodeComplete,
    mainPageState.setShowPostcode,
    () => {
      showError('주소 검색 중 오류가 발생했습니다.');
    }
  );

  return {
    // 상태
    userAddresses: addressManagement.userAddresses,
    selectedAddress: addressManagement.selectedAddress,
    searchQuery: mainPageState.searchQuery,
    roadAddress: mainPageState.roadAddress,
    savedLawdCode: mainPageState.savedLawdCode,
    buildingType: mainPageState.buildingType,
    selectedYear: mainPageState.selectedYear,
    selectedMonth: mainPageState.selectedMonth,
    showPostcode: mainPageState.showPostcode,
    isNewAddressSearch: addressManagement.isNewAddressSearch,

    // 새로운 주소 검색 시 사용할 dong, ho 상태
    dong: mainPageState.dong,
    ho: mainPageState.ho,

    // 위치 관리 상태
    gpsLocation: locationManager.gpsLocation,
    gpsLoading: locationManager.gpsLoading,
    gpsError: locationManager.gpsError,
    currentLocationType: locationManager.currentLocationType,

    // 상태 설정 함수
    setSearchQuery: mainPageState.setSearchQuery,
    setBuildingType: mainPageState.setBuildingType,
    setSelectedYear: mainPageState.selectedYear,
    setSelectedMonth: mainPageState.selectedMonth,
    setShowPostcode: mainPageState.setShowPostcode,

    // 새로운 주소 검색 시 사용할 dong, ho 설정 함수
    setDong: mainPageState.setDong,
    setHo: mainPageState.setHo,

    handleMoveToAddressOnly: addressManagement.handleMoveToAddressOnly,
    onSearch: execDaumPostcode,
    executePostcode,
    postcodeRef,

    // 위치 관리 액션 함수
    refreshGPSLocation: locationManager.refreshGPSLocation,

    // 주소 저장 함수
    saveAddressToUser: addressManagement.saveAddressToUser,

    // 탭 관리
    activeTab: tabManagement.activeTab,
    handleTabChange: tabManagement.handleTabChange,
    isTabActive: tabManagement.isTabActive,
    goToNextTab: tabManagement.goToNextTab,
    goToPreviousTab: tabManagement.goToPreviousTab,
    goToFirstTab: tabManagement.goToFirstTab,
    goToLastTab: tabManagement.goToLastTab,

    // 지도 관리
    mapCenter: mapManagement.mapCenter,
    searchLocationMarker: mapManagement.searchLocationMarker,
    adjustBounds: mapManagement.adjustBounds,
    handleSetMapCenter: mapManagement.handleSetMapCenter,
    handleSetSearchLocationMarker: mapManagement.handleSetSearchLocationMarker,
    handleAdjustBounds: mapManagement.handleAdjustBounds,
    handleMoveToGPSLocation: mapManagement.handleMoveToGPSLocation,
    handleMoveToAddressFromMap: mapManagement.handleMoveToAddress,

    // 기타
    userAddressesLoading,
    isAuthenticated,
  };
};
