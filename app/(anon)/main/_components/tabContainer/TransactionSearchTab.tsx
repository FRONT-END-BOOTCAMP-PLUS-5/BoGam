'use client';

import React, { useEffect, useState } from 'react';
import { useTransactionManagement } from '@/hooks/main/useTransactionManagement';
import { useMainPageState } from '@/hooks/main/useMainPageState';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { parseAddressString } from '@utils/main/addressUtils';
import { styles } from '@/(anon)/main/_components/tabContainer/TransactionSearchTab.styles';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { DanjiSerialNumberContent } from '@/(anon)/_components/common/modal/DanjiSerialNumberContent';
import Button from '@/(anon)/_components/common/button/Button';


// 실제 API 응답 구조에 맞춘 타입
interface ActualDanjiInfo {
  commBuildingCode: string;
  resBuildingName: string;
  commAddrLotNumber: string;
  resBunji: string;
  commAddrRoadName: string;
}

interface TransactionSearchTabProps {
  onTabChange?: (tabIndex: number) => void;
}

export const TransactionSearchTab: React.FC<TransactionSearchTabProps> = ({
  onTabChange,
}) => {
  const [parsedAddress, setParsedAddress] = useState({
    addrSido: '',
    addrSigungu: '',
    addrDong: '',
  });
  const [complexName, setComplexName] = useState('');
  const [danjiName, setDanjiName] = useState('');
  const [selectedType, setSelectedType] = useState('0'); // 0: 아파트, 1: 연립/다세대, 2: 오피스텔
  // const [searchGbn, setSearchGbn] = useState('1'); // 0: 지번주소, 1: 도로명주소 - 사용하지 않음
  const [showDanjiModal, setShowDanjiModal] = useState(false);

  // 새로운 Hook들 사용
  const { selectedAddress } = useUserAddressStore();
  const { handleTransactionSearch: handleMoveToAddress } =
    useTransactionManagement();

  // useMainPageState에서 상태와 setter 함수들 가져오기
  const { selectedYear, setSelectedYear } = useMainPageState();

  // 선택된 주소가 변경될 때마다 주소 파싱
  useEffect(() => {
    if (selectedAddress) {
      const address =
        selectedAddress.completeAddress || selectedAddress.roadAddress || '';
      const parsed = parseAddressString(address);
      setParsedAddress(parsed);
    }
  }, [selectedAddress]);

  // 주소 표시 로직
  const displayAddress =
    selectedAddress?.roadAddress || selectedAddress?.lotAddress || '';

  const handleFetchComplex = () => {
    setShowDanjiModal(true);
  };

  const handleDanjiSelect = (danji: ActualDanjiInfo) => {
    setComplexName(danji.commBuildingCode); // 건물코드를 input에 설정
    setDanjiName(danji.resBuildingName);
    setShowDanjiModal(false);
  };

  const handleTransactionSearch = () => {
    // 실거래가 조회 API 요청 (선택된 타입과 건물 코드 전달)
    if (selectedAddress) {
      handleMoveToAddress(selectedType, complexName);
    }
    // 세 번째 탭으로 이동
    onTabChange?.(2);
  };

  return (
    <div className={styles.container}>
      {/* 안내 메시지 */}
      <div className={styles.instructionContainer}>
        <div className={styles.instruction}>
          조회 하고자 하는 주소를 확인 해주세요!
        </div>
      </div>

      {/* 주소 정보 표시 */}
      {displayAddress && (
        <div className={styles.addressContainer}>
          <span className={styles.addressValue}>{displayAddress}</span>
        </div>
      )}

      {/* 조회 년도 */}
      <div className={styles.yearContainer}>
        <label className={styles.label}>조회 년도:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={styles.select}
        >
          <option value='2025'>2025</option>
          <option value='2024'>2024</option>
          <option value='2023'>2023</option>
          <option value='2022'>2022</option>
          <option value='2021'>2021</option>
          <option value='2020'>2020</option>
        </select>
      </div>

      {/* 건물 타입 */}
      <div className={styles.buildingTypeContainer}>
        <label className={styles.label}>건물 타입:</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className={styles.select}
        >
          <option value='0'>아파트</option>
          <option value='1'>연립/다세대</option>
          <option value='2'>오피스텔</option>
        </select>
      </div>

      {/* 단지명 */}
      <div className={styles.complexContainer}>
        <label className={styles.label}>단지명:</label>
        <div className={styles.complexInputGroup}>
          <div className={styles.addressContainer}>
            <span className={styles.addressValue}>{danjiName || '세밀한 검색을 위한 단지명 검색'}</span>
          </div>
          <Button 
            onClick={handleFetchComplex} 
            variant='primary'
            className={styles.fetchButton}
          >
            가져오기
          </Button>
        </div>
      </div>

      {/* 실거래가 조회 버튼 */}
      <div className={styles.searchButtonContainer}>
        <Button
          onClick={handleTransactionSearch}
          disabled={!parsedAddress.addrSido || !parsedAddress.addrSigungu}
          variant='primary'
          className={styles.searchButton}
        >
          실거래가 조회하기
        </Button>
      </div>

      {/* 단지 일련번호 조회 모달 */}
      <ConfirmModal
        isOpen={showDanjiModal}
        onCancel={() => setShowDanjiModal(false)}
        title='단지 일련번호 조회'
        icon='info'
        cancelText='닫기'
        onConfirm={() => {}} // 빈 함수로 설정 (확인 버튼 숨김)
      >
        <DanjiSerialNumberContent
          searchParams={{
            addrSido: parsedAddress.addrSido,
            addrSigungu: parsedAddress.addrSigungu,
            addrDong: parsedAddress.addrDong,
          }}
          onSelect={handleDanjiSelect}
        />
      </ConfirmModal>
    </div>
  );
};
