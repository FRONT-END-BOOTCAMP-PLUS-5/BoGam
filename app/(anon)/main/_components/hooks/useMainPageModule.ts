import { useMainPageState } from './useMainPageState';
import { useUserAddresses } from './useUserAddresses';
import { useAddressSearch } from './useAddressSearch';
import { useTransactionData } from './useTransactionData';
import { useDaumPostcode } from './useDaumPostcode';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { placesApi } from '@libs/api_front';

export const useMainPageModule = () => {
  // 상태 관리
  const {
    // 상태
    userAddresses,
    selectedAddress,
    searchQuery,
    detailAddress,
    dong,
    ho,
    fullAddress,
    savedLawdCode,
    buildingType,
    mapCenter,
    transactionData,
    searchLocationMarker,
    selectedYear,
    selectedMonth,
    isLoading,
    showPostcode,
    adjustBounds,

    // 상태 설정 함수
    setUserAddresses,
    setSelectedAddress,
    setSearchQuery,
    setDetailAddress,
    setDong,
    setHo,
    setFullAddress,
    setSavedLawdCode,
    setBuildingType,
    setMapCenter,
    setTransactionData,
    setSearchLocationMarker,
    setSelectedYear,
    setSelectedMonth,
    setIsLoading,
    setShowPostcode,
    setAdjustBounds,
  } = useMainPageState();

  // 사용자 주소 관리
  useUserAddresses(setUserAddresses, setSelectedAddress, setMapCenter);

  // 주소 검색 관리
  const { addressToCoordinates, moveToAddress, handleDaumPostcodeResult } =
    useAddressSearch(setMapCenter, setSearchLocationMarker, setFullAddress);

  // 실거래가 데이터 관리
  const { fetchTransactionData, fetchTransactionDataByCode } =
    useTransactionData(setTransactionData, addressToCoordinates);

  // Daum 우편번호 관리
  const { postcodeRef, execDaumPostcode } = useDaumPostcode((data) => {
    handleDaumPostcodeResult(
      data,
      setDetailAddress,
      setSavedLawdCode,
      setDong,
      setHo,
      setFullAddress,
      setSearchQuery,
      setShowPostcode
    );
  }, setShowPostcode);

  // 주소 변경 시 실거래가 데이터도 함께 가져오기
  const handleAddressChangeWithTransaction = (address: UserAddress) => {
    setSelectedAddress(address);
    if (address.x && address.y) {
      const newCenter = { lat: address.y, lng: address.x };
      setMapCenter(newCenter);
      setAdjustBounds(true); // 새로운 데이터 로드 시 자동 조정 활성화

      // 실거래가 데이터 가져오기
      fetchTransactionData(newCenter, selectedYear, selectedMonth);
    }
  };

  // 지도 이동 전용 (실거래가 데이터 없이)
  const handleMoveToAddressOnly = async () => {
    if (!detailAddress || !dong.trim()) {
      alert('상세 주소와 동을 입력해주세요.');
      return;
    }

    setAdjustBounds(false); // 자동 조정 비활성화

    try {
      // 호는 옵션으로 처리
      const hoPart = ho.trim() ? ` ${ho.trim()}호` : '';
      const completeAddress = `${detailAddress} ${dong.trim()}동${hoPart}`;

      // 키워드 검색으로 지도 이동 (건물명, 장소명 등)
      const searchData = await placesApi.searchByKeyword(completeAddress);
      console.log('키워드 검색 API 응답 (지도 이동 전용):', searchData);

      if (searchData && searchData.length > 0) {
        const location = {
          lat: parseFloat(searchData[0].latitude),
          lng: parseFloat(searchData[0].longitude),
        };
        console.log('검색된 좌표 (지도 이동 전용):', location);
        setMapCenter(location);
        setSearchLocationMarker(location);
      } else {
        alert('해당 주소를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('키워드 검색 실패 (지도 이동 전용):', error);
      alert('키워드 검색 중 오류가 발생했습니다.');
    }
  };

  // 지도 이동 및 실거래가 조회
  const handleMoveToAddress = async () => {
    if (!detailAddress || !dong.trim()) {
      alert('상세 주소와 동을 입력해주세요.');
      return;
    }

    setAdjustBounds(true); // 새로운 데이터 로드 시 자동 조정 활성화

    const onTransactionDataFetch = async () => {
      if (savedLawdCode) {
        await fetchTransactionDataByCode(
          savedLawdCode,
          selectedYear,
          selectedMonth
        );
      }
    };

    await moveToAddress(
      detailAddress,
      dong,
      ho,
      savedLawdCode,
      onTransactionDataFetch
    );
  };

  // 거래 데이터 클릭 시 지도 이동
  const handleTransactionClick = (location: Location) => {
    setAdjustBounds(false); // 자동 조정 비활성화
    setMapCenter(location);
  };

  return {
    // 상태
    userAddresses,
    selectedAddress,
    searchQuery,
    detailAddress,
    dong,
    ho,
    fullAddress,
    savedLawdCode,
    buildingType,
    mapCenter,
    transactionData,
    searchLocationMarker,
    selectedYear,
    selectedMonth,
    isLoading,
    showPostcode,
    adjustBounds,

    // 상태 설정 함수
    setSearchQuery,
    setDong,
    setHo,
    setBuildingType,
    setMapCenter,
    setSearchLocationMarker,
    setSelectedYear,
    setSelectedMonth,
    setIsLoading,
    setShowPostcode,

    // 액션 함수
    handleAddressChangeWithTransaction,
    handleMoveToAddress,
    handleMoveToAddressOnly,
    handleTransactionClick,
    execDaumPostcode,
    postcodeRef,
  };
};
