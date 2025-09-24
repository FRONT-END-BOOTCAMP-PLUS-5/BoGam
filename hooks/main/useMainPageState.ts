import { useState } from 'react';
import { BuildingType } from '@/(anon)/main/_components/types/mainPage.types';

interface AddressSaveData {
  roadAddress: string;
  jibunAddress: string;
  legalDistrictCode: string;
}

export const useMainPageState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [dong, setDong] = useState('');
  const [ho, setHo] = useState('');
  const [savedLawdCode, setSavedLawdCode] = useState('');

  const [buildingType, setBuildingType] = useState<BuildingType>({
    category: '',
    type: '',
  });
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('12');
  const [showPostcode, setShowPostcode] = useState(false);

  const [addressSaveData, setAddressSaveData] = useState<AddressSaveData>({
    roadAddress: '',
    jibunAddress: '',
    legalDistrictCode: '',
  });

  return {
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
