import { useState, useCallback } from 'react';
import { Location } from '@/(anon)/main/_components/types/map.types';
import {
  UserAddress,
  TransactionData,
  BuildingType,
} from '@/(anon)/main/_components/types/mainPage.types';

export const useMainPageState = () => {
  // 상태 정의
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [dong, setDong] = useState('');
  const [ho, setHo] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [savedLawdCode, setSavedLawdCode] = useState('');
  const [buildingType, setBuildingType] = useState<BuildingType>({
    category: '',
    type: '',
  });
  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 37.5665,
    lng: 126.978,
  });
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [searchLocationMarker, setSearchLocationMarker] =
    useState<Location | null>(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('12');
  const [isLoading, setIsLoading] = useState(false);
  const [showPostcode, setShowPostcode] = useState(false);
  const [adjustBounds, setAdjustBounds] = useState(true);

  // 주소 변경 처리
  const handleAddressChange = useCallback((address: UserAddress) => {
    setSelectedAddress(address);
    setMapCenter({ lat: address.y, lng: address.x });
  }, []);

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

    // 액션 함수
    handleAddressChange,
  };
};
