'use client';

import React, { useState, useEffect } from 'react';
import { useTransactionManagement } from '@/hooks/main/useTransactionManagement';
import { useMainPageState } from '@/hooks/main/useMainPageState';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { parseAddressString } from '@utils/main/addressUtils';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { DanjiSerialNumberContent } from '@/(anon)/_components/common/modal/DanjiSerialNumberContent';
import Button from '@/(anon)/_components/common/button/Button';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';
import { styles } from './TransactionSearchComponent.styles';

// 실제 API 응답 구조에 맞춘 타입
interface ActualDanjiInfo {
  commBuildingCode: string;
  resBuildingName: string;
  commAddrLotNumber: string;
  resBunji: string;
  commAddrRoadName: string;
}

interface TransactionSearchComponentProps {
  onTransactionComplete?: (data: TransactionData[]) => void;
  showResults?: boolean;
  className?: string;
}

export const TransactionSearchComponent: React.FC<TransactionSearchComponentProps> = ({
  onTransactionComplete,
  showResults = true,
  className = '',
}) => {
  const [parsedAddress, setParsedAddress] = useState({
    addrSido: '',
    addrSigungu: '',
    addrDong: '',
  });
  const [complexName, setComplexName] = useState('');
  const [danjiName, setDanjiName] = useState('');
  const [selectedType, setSelectedType] = useState('0'); // 0: 아파트, 1: 연립/다세대, 2: 오피스텔
  const [showDanjiModal, setShowDanjiModal] = useState(false);

  // Hook들 사용
  const { selectedAddress } = useUserAddressStore();
  const { 
    transactionData, 
    isLoading, 
    handleMoveToAddress,
    handleBuildingSelect 
  } = useTransactionManagement();
  const { selectedYear, setSelectedYear } = useMainPageState();

  // 선택된 주소가 변경될 때마다 주소 파싱
  useEffect(() => {
    if (selectedAddress) {
      const address = selectedAddress.completeAddress || selectedAddress.roadAddress || '';
      const parsed = parseAddressString(address);
      setParsedAddress(parsed);
    }
  }, [selectedAddress]);

  // 트랜잭션 데이터가 완료되면 콜백 호출
  useEffect(() => {
    if (transactionData.length > 0 && onTransactionComplete) {
      onTransactionComplete(transactionData);
    }
  }, [transactionData, onTransactionComplete]);

  // 주소 표시 로직
  const displayAddress = selectedAddress?.roadAddress || selectedAddress?.lotAddress || '';

  const handleFetchComplex = () => {
    setShowDanjiModal(true);
  };

  const handleDanjiSelect = (danji: ActualDanjiInfo) => {
    setComplexName(danji.commBuildingCode);
    setDanjiName(danji.resBuildingName);
    setShowDanjiModal(false);
  };

  const handleTransactionSearch = () => {
    if (selectedAddress) {
      handleMoveToAddress(selectedType, complexName);
    }
  };

  const handleBuildingSelectFromList = (buildingCode: string, buildingName: string) => {
    setComplexName(buildingCode);
    setDanjiName(buildingName);
    handleBuildingSelect(buildingCode, buildingName);
  };

  const formatTransactionData = (data: TransactionData) => ({
    ...data,
    거래금액: data.거래금액 ? `${data.거래금액}만원` : '-',
    전용면적: data.전용면적 ? `${data.전용면적}㎡` : '-',
    층: data.층 ? `${data.층}층` : '-',
    건축년도: data.건축년도 || '-',
    거래일: `${data.년}-${data.월}-${data.일}`,
  });

  return (
    <div className={`transaction-search-component ${className}`}>
      {/* 검색 폼 */}
      <div className="search-form">
        <h3 className="form-title">실거래가 조회</h3>
        
        {/* 주소 정보 표시 */}
        {displayAddress && (
          <div className="address-display">
            <label className="form-label">선택된 주소:</label>
            <div className="address-value">{displayAddress}</div>
          </div>
        )}

        {/* 조회 년도 */}
        <div className="form-group">
          <label className="form-label">조회 년도:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="form-select"
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
        <div className="form-group">
          <label className="form-label">건물 타입:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-select"
          >
            <option value='0'>아파트</option>
            <option value='1'>연립/다세대</option>
            <option value='2'>오피스텔</option>
          </select>
        </div>

        {/* 단지명 */}
        <div className="form-group">
          <label className="form-label">단지명:</label>
          <div className="complex-input-group">
            <div className="complex-display">
              {danjiName || '세밀한 검색을 위한 단지명 검색'}
            </div>
            <Button 
              onClick={handleFetchComplex} 
              variant='primary'
              className="fetch-button"
            >
              가져오기
            </Button>
          </div>
          {!danjiName && (
            <p className="text-sm text-orange-600 mt-1">
              * 아파트, 연립/다세대, 오피스텔 검색을 위해서는 단지명이 필요합니다
            </p>
          )}
        </div>

        {/* 실거래가 조회 버튼 */}
        <div className="search-button-container">
          <Button
            onClick={handleTransactionSearch}
            disabled={!parsedAddress.addrSido || !parsedAddress.addrSigungu || isLoading || !complexName}
            variant='primary'
            className="search-button"
          >
            {isLoading ? '조회 중...' : '실거래가 조회하기'}
          </Button>
          {!complexName && (
            <p className="text-sm text-red-600 mt-2 text-center">
              단지명을 먼저 검색해주세요
            </p>
          )}
        </div>
      </div>

      {/* 검색 결과 */}
      {showResults && transactionData.length > 0 && (
        <div className="search-results">
          <h3 className="results-title">검색 결과 ({transactionData.length}건)</h3>
          <div className="results-grid">
            {transactionData.map((item, index) => {
              const formatted = formatTransactionData(item);
              return (
                <div key={index} className="result-card">
                  <div className="result-header">
                    <h4 className="building-name">{formatted.아파트}</h4>
                    <span className="transaction-date">{formatted.거래일}</span>
                  </div>
                  <div className="result-details">
                    <div className="detail-item">
                      <span className="label">거래금액:</span>
                      <span className="value price">{formatted.거래금액}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">전용면적:</span>
                      <span className="value">{formatted.전용면적}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">층:</span>
                      <span className="value">{formatted.층}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">건축년도:</span>
                      <span className="value">{formatted.건축년도}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">주소:</span>
                      <span className="value">{formatted.법정동} {formatted.지번}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 단지 일련번호 조회 모달 */}
      <ConfirmModal
        isOpen={showDanjiModal}
        onCancel={() => setShowDanjiModal(false)}
        title='단지 일련번호 조회'
        icon='info'
        cancelText='닫기'
        onConfirm={() => {}}
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
