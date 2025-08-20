'use client';

import React, { useEffect, useState } from 'react';
import { useMainPageModule } from '@/(anon)/main/_components/hooks/useMainPageModule';
import { useMainPageState } from '@/(anon)/main/_components/hooks/useMainPageState';
import { parseAddress } from '@utils/addressParser';
import { styles } from '@/(anon)/main/_components/tabContainer/TransactionSearchTab.styles';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { DanjiSerialNumberContent } from '@/(anon)/_components/common/modal/DanjiSerialNumberContent';
import { DanjiInfo } from '@libs/api_front/danjiSerialNumber.api';

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
  const [selectedType, setSelectedType] = useState('0'); // 0: 아파트, 1: 연립/다세대, 2: 오피스텔
  const [searchGbn, setSearchGbn] = useState('1'); // 0: 지번주소, 1: 도로명주소
  const [showDanjiModal, setShowDanjiModal] = useState(false);

  // useMainPageModule에서 필요한 함수들 가져오기
  const {
    selectedAddress,
    isNewAddressSearch,
    activeAddressType,
    handleMoveToAddress,
  } = useMainPageModule();

  // useMainPageState에서 상태와 setter 함수들 가져오기
  const { selectedYear, setSelectedYear, newAddressData } = useMainPageState();

  // 선택된 주소가 변경될 때마다 주소 파싱
  useEffect(() => {
    // activeAddressType이 'new'일 때는 selectedAddress를 사용하지 않음
    if (activeAddressType === 'new' && newAddressData.roadAddress) {
      const address = newAddressData.roadAddress || '';
      const parsed = parseAddress(address);
      setParsedAddress(parsed);
    } else if (selectedAddress && activeAddressType === 'dropdown') {
      const address = selectedAddress.completeAddress || '';
      const parsed = parseAddress(address);
      setParsedAddress(parsed);
    }
  }, [selectedAddress, activeAddressType, newAddressData]);

  // 주소 표시 로직
  const displayAddress = (() => {
    // activeAddressType이 'new'일 때는 빈 문자열 반환
    if (activeAddressType === 'new') {
      return '';
    }
    return selectedAddress?.roadAddress || selectedAddress?.lotAddress || '';
  })();

  const handleFetchComplex = () => {
    setShowDanjiModal(true);
  };

  const handleDanjiSelect = (danji: ActualDanjiInfo) => {
    setComplexName(danji.commBuildingCode); // 건물코드를 input에 설정
    setShowDanjiModal(false);
  };

  const handleTransactionSearch = () => {
    // 실거래가 조회 API 요청 (선택된 타입과 건물 코드 전달)
    handleMoveToAddress(selectedType, complexName);
    // 세 번째 탭으로 이동
    onTabChange?.(2);
  };

  return (
    <div className={styles.container}>
      {/* 안내 메시지 */}
      <div className={styles.instruction}>
        조회 하고자 하는 주소를 확인 해주세요!
      </div>

      {/* 주소 정보 표시 */}
      {displayAddress && (
        <div className={styles.addressDisplay}>
          <span className={styles.addressLabel}>선택된 주소:</span>
          <span className={styles.addressValue}>{displayAddress}</span>
        </div>
      )}

      {/* 주소 입력 폼 */}
      <div className={styles.formContainer}>
        <div className={styles.formRow}>
          <label className={styles.label}>시/도:</label>
          <input
            type='text'
            value={parsedAddress.addrSido}
            onChange={(e) =>
              setParsedAddress((prev) => ({
                ...prev,
                addrSido: e.target.value,
              }))
            }
            className={styles.input}
            placeholder='서울특별시'
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>시/군/구:</label>
          <input
            type='text'
            value={parsedAddress.addrSigungu}
            onChange={(e) =>
              setParsedAddress((prev) => ({
                ...prev,
                addrSigungu: e.target.value,
              }))
            }
            className={styles.input}
            placeholder='중구'
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>도로명(혹은 읍/면/동):</label>
          <input
            type='text'
            value={parsedAddress.addrDong}
            onChange={(e) =>
              setParsedAddress((prev) => ({
                ...prev,
                addrDong: e.target.value,
              }))
            }
            className={styles.input}
            placeholder='뭐시기 동(도로명)'
          />
        </div>

        <div className={styles.formRow}>
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

        <div className={styles.formRow}>
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

        <div className={styles.formRow}>
          <label className={styles.label}>단지명:</label>
          <div className={styles.complexInputGroup}>
            <input
              type='text'
              value={complexName}
              onChange={(e) => setComplexName(e.target.value)}
              className={styles.complexInput}
              placeholder='세밀한 검색을 위한 단지명 검색'
            />
            <button onClick={handleFetchComplex} className={styles.fetchButton}>
              가져오기
            </button>
          </div>
        </div>
      </div>

      {/* 실거래가 조회 버튼 */}
      <div className={styles.buttonContainer}>
        <button
          onClick={handleTransactionSearch}
          disabled={!parsedAddress.addrSido || !parsedAddress.addrSigungu}
          className={styles.searchButton}
        >
          실거래가 조회하기
        </button>
      </div>

      {/* 단지 일련번호 조회 모달 */}
      <ConfirmModal
        isOpen={showDanjiModal}
        onCancel={() => setShowDanjiModal(false)}
        title='단지 일련번호 조회'
        icon='info'
        confirmText=''
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
