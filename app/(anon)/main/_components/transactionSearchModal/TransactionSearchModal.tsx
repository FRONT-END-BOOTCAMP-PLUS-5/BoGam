'use client';

import React, { useState, useEffect } from 'react';
import { styles } from './TransactionSearchModal.styles';
import { parseAddress, validateParsedAddress } from '@utils/addressParser';
import {
  danjiSerialNumberApi,
  DanjiInfo,
} from '@libs/api_front/danjiSerialNumber.api';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';

interface TransactionSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddress: UserAddress | null;
  onBuildingSelect: (buildingCode: string, buildingName: string) => void;
}

export const TransactionSearchModal: React.FC<TransactionSearchModalProps> = ({
  isOpen,
  onClose,
  selectedAddress,
  onBuildingSelect,
}) => {
  const [addrSido, setAddrSido] = useState('');
  const [addrSigungu, setAddrSigungu] = useState('');
  const [addrDong, setAddrDong] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [buildingType, setBuildingType] = useState('0'); // 0: 아파트, 1: 연립/다세대, 2: 오피스텔
  const [searchGbn, setSearchGbn] = useState('1'); // 0: 지번주소, 1: 도로명주소
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const [danjiList, setDanjiList] = useState<DanjiInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 선택된 주소가 변경되면 자동으로 주소 분해
  useEffect(() => {
    if (selectedAddress && isOpen) {
      const address =
        selectedAddress.roadAddress ||
        selectedAddress.lotAddress ||
        selectedAddress.completeAddress;
      const parsed = parseAddress(address);

      setAddrSido(parsed.addrSido);
      setAddrSigungu(parsed.addrSigungu);
      setAddrDong(parsed.addrDong);

      // 검증
      const validation = validateParsedAddress(parsed);
      if (!validation.isValid) {
        setError(`주소 분해 오류: ${validation.errors.join(', ')}`);
      } else {
        setError('');
      }
    }
  }, [selectedAddress, isOpen]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setDanjiList([]);
      setError('');
      setBuildingName('');
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!addrSido || !addrSigungu || !addrDong) {
      setError('주소 정보를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await danjiSerialNumberApi.getDanjiSerialNumber({
        organization: '0010',
        year,
        type: '0',
        searchGbn: '1',
        addrSido,
        addrSigungu,
        addrDong,
        complexName: buildingName || undefined,
      });

      console.log('response', response);

      if (response.data && response.data) {
        setDanjiList(response.data);
        if (response.data.length === 0) {
          setError('해당 조건에 맞는 단지가 없습니다.');
        }
      } else {
        setError('단지 검색에 실패했습니다.');
      }
    } catch (err) {
      console.error('단지 검색 오류:', err);
      setError('단지 검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuildingSelect = (danji: DanjiInfo) => {
    onBuildingSelect(danji.commBuildingCode, danji.resBuildingName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>실거래가 조회</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* 검색 조건 입력 */}
          <div className={styles.searchSection}>
            <h4 className={styles.sectionTitle}>검색 조건</h4>

            <div className={styles.inputGroup}>
              <label className={styles.label}>시도</label>
              <input
                type='text'
                value={addrSido}
                onChange={(e) => setAddrSido(e.target.value)}
                className={styles.input}
                placeholder='예: 서울특별시'
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>시군구</label>
              <input
                type='text'
                value={addrSigungu}
                onChange={(e) => setAddrSigungu(e.target.value)}
                className={styles.input}
                placeholder='예: 강남구'
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>동</label>
              <input
                type='text'
                value={addrDong}
                onChange={(e) => setAddrDong(e.target.value)}
                className={styles.input}
                placeholder='예: 역삼동'
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>건물 유형</label>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className={styles.select}
              >
                <option value='0'>아파트</option>
                <option value='1'>연립/다세대</option>
                <option value='2'>오피스텔</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>조회 구분</label>
              <select
                value={searchGbn}
                onChange={(e) => setSearchGbn(e.target.value)}
                className={styles.select}
              >
                <option value='0'>지번주소</option>
                <option value='1'>도로명주소</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>기준년도</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={styles.select}
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const yearValue = new Date().getFullYear() - i;
                  return (
                    <option key={yearValue} value={yearValue.toString()}>
                      {yearValue}년
                    </option>
                  );
                })}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>단지명 (선택사항)</label>
              <input
                type='text'
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                className={styles.input}
                placeholder='단지명을 입력하세요'
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={styles.searchButton}
            >
              {isLoading ? '검색 중...' : '단지 검색'}
            </button>
          </div>

          {/* 오류 메시지 */}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* 검색 결과 */}
          {danjiList.length > 0 && (
            <div className={styles.resultSection}>
              <h4 className={styles.sectionTitle}>검색 결과</h4>
              <div className={styles.danjiList}>
                {danjiList.map((danji, index) => (
                  <div
                    key={index}
                    className={styles.danjiItem}
                    onClick={() => handleBuildingSelect(danji)}
                  >
                    <div className={styles.danjiName}>
                      {danji.resBuildingName || danji.danjiName}
                    </div>
                    <div className={styles.danjiAddress}>{danji.address}</div>
                    <div className={styles.danjiInfo}>
                      <span>건물코드: {danji.commBuildingCode}</span>
                      <span>지번: {danji.commAddrLotNumber}</span>
                      <span>도로명: {danji.commAddrRoadName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
