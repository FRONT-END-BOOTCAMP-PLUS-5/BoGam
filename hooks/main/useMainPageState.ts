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
  };
};
