import { useState } from 'react';
import { BuildingType } from '@/(anon)/main/_components/types/mainPage.types';
import { useEffect } from 'react';

// 주소 저장에 필요한 데이터 타입
interface AddressSaveData {
  roadAddress: string; // 도로명 주소
  jibunAddress: string; // 지번 주소
  legalDistrictCode: string; // 법정동 코드
}

export const useMainPageState = () => {
  // 검색 관련 상태 (로컬 상태로 유지)
  const [searchQuery, setSearchQuery] = useState('');
  const [roadAddress, setRoadAddress] = useState(''); // 도로명 주소로 통일
  const [dong, setDong] = useState('');
  const [ho, setHo] = useState('');
  const [savedLawdCode, setSavedLawdCode] = useState('');

  const [buildingType, setBuildingType] = useState<BuildingType>({
    category: '',
    type: '',
  });
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('12');
  const [showPostcode, setShowPostcode] = useState(false);

  // 주소 저장에 필요한 데이터
  const [addressSaveData, setAddressSaveData] = useState<AddressSaveData>({
    roadAddress: '',
    jibunAddress: '',
    legalDistrictCode: '',
  });

  // 새로운 주소 검색 데이터 (별도 관리)
  const [newAddressData, setNewAddressData] = useState({
    roadAddress: '',
    dong: '',
    ho: '',
    searchQuery: '',
    savedLawdCode: '',
  });

  // 현재 활성화된 주소 타입 ('new' | 'dropdown')
  const [activeAddressType, setActiveAddressType] = useState<
    'new' | 'dropdown'
  >('dropdown');

  return {
    // 검색 관련 상태
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

    // 검색 관련 상태 설정 함수
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

    // 새로운 주소 관련 상태
    newAddressData,
    activeAddressType,
    setNewAddressData,
    setActiveAddressType,
  };
};
