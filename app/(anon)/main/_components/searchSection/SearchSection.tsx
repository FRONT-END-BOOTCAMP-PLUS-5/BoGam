import React from 'react';
import { BuildingType } from '@/(anon)/main/_components/types/mainPage.types';
import { styles } from './SearchSection.styles';

interface SearchSectionProps {
  searchQuery: string;
  detailAddress: string;
  dong: string;
  ho: string;
  buildingType: BuildingType;
  selectedYear: string;
  selectedMonth: string;
  isLoading: boolean;
  showPostcode: boolean;
  onSearchQueryChange: (value: string) => void;
  onDongChange: (value: string) => void;
  onHoChange: (value: string) => void;
  onBuildingTypeChange: (type: BuildingType) => void;
  onSelectedYearChange: (value: string) => void;
  onSelectedMonthChange: (value: string) => void;
  onSearch: () => void;
  onMoveToAddress: () => void;
  onMoveToAddressOnly: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  detailAddress,
  dong,
  ho,
  buildingType,
  selectedYear,
  selectedMonth,
  isLoading,
  onSearchQueryChange,
  onDongChange,
  onHoChange,
  onBuildingTypeChange,
  onSelectedYearChange,
  onSelectedMonthChange,
  onSearch,
  onMoveToAddress,
  onMoveToAddressOnly,
}) => {
  const handleBuildingCategoryChange = (category: string) => {
    onBuildingTypeChange({
      category: category as BuildingType['category'],
      type: '',
    });
  };

  const handleBuildingTypeChange = (type: string) => {
    onBuildingTypeChange({
      ...buildingType,
      type: type as BuildingType['type'],
    });
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchRow}>
        <input
          type='text'
          placeholder='주소를 검색하려면 버튼을 클릭하세요!'
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className={styles.searchInput}
          readOnly
        />
        <button
          onClick={onSearch}
          disabled={isLoading}
          className={styles.searchButton}
        >
          {isLoading ? '검색 중...' : '주소 검색'}
        </button>
      </div>

      {/* 동/호 입력 및 지도 이동 */}
      {detailAddress && (
        <div className={styles.addressDetailRow}>
          <div className={styles.addressInfo}>
            <span className={styles.addressLabel}>상세 주소:</span>
            <span className={styles.addressValue}>{detailAddress}</span>
          </div>
          <div className={styles.buildingInfoContainer}>
            {/* 건물 유형 선택 */}
            <div className={styles.buildingTypeContainer}>
              <label className={styles.buildingTypeLabel}>건물 유형:</label>
              <select
                value={buildingType.category}
                onChange={(e) => handleBuildingCategoryChange(e.target.value)}
                className={styles.buildingTypeSelect}
              >
                <option value=''>선택하세요</option>
                <option value='residential'>주거용</option>
                <option value='commercial'>상업용</option>
              </select>

              {buildingType.category === 'residential' && (
                <select
                  value={buildingType.type}
                  onChange={(e) => handleBuildingTypeChange(e.target.value)}
                  className={styles.buildingTypeSelect}
                >
                  <option value=''>주거용 건물 선택</option>
                  <option value='apartment'>아파트</option>
                  <option value='villa'>연립/다세대</option>
                  <option value='officetel'>오피스텔</option>
                </select>
              )}

              {buildingType.category === 'commercial' && (
                <select
                  value={buildingType.type}
                  onChange={(e) => handleBuildingTypeChange(e.target.value)}
                  className={styles.buildingTypeSelect}
                >
                  <option value=''>상업용 건물 선택</option>
                  <option value='detached'>단독</option>
                  <option value='multi'>다가구</option>
                </select>
              )}
            </div>

            {/* 동/호 입력 */}
            <div className={styles.dongHoInput}>
              <div className={styles.dongHoRow}>
                <input
                  type='text'
                  placeholder='동 (예: 101)'
                  value={dong}
                  onChange={(e) => onDongChange(e.target.value)}
                  className={styles.dongField}
                />
                <span className={styles.dongHoSeparator}>동</span>
                <input
                  type='text'
                  placeholder='호 (선택사항)'
                  value={ho}
                  onChange={(e) => onHoChange(e.target.value)}
                  className={styles.hoField}
                />
                <span className={styles.dongHoSeparator}>호</span>
              </div>
              <div className={styles.buttonRow}>
                <button
                  onClick={onMoveToAddressOnly}
                  disabled={!dong.trim()}
                  className={styles.moveButtonOnly}
                >
                  지도 이동
                </button>
                <button
                  onClick={onMoveToAddress}
                  disabled={!dong.trim()}
                  className={styles.moveButton}
                >
                  지도 이동 & 실거래가 조회
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.dateContainer}>
        <label htmlFor='yearSelect' className={styles.dateLabel}>
          실거래가 조회 기간:
        </label>
        <select
          id='yearSelect'
          value={selectedYear}
          onChange={(e) => onSelectedYearChange(e.target.value)}
          className={styles.dateSelect}
        >
          <option value='2025'>2025년</option>
          <option value='2024'>2024년</option>
          <option value='2023'>2023년</option>
          <option value='2022'>2022년</option>
          <option value='2021'>2021년</option>
          <option value='2020'>2020년</option>
        </select>
        <select
          id='monthSelect'
          value={selectedMonth}
          onChange={(e) => onSelectedMonthChange(e.target.value)}
          className={styles.dateSelect}
        >
          <option value='12'>12월</option>
          <option value='11'>11월</option>
          <option value='10'>10월</option>
          <option value='9'>9월</option>
          <option value='8'>8월</option>
          <option value='7'>7월</option>
          <option value='6'>6월</option>
          <option value='5'>5월</option>
          <option value='4'>4월</option>
          <option value='3'>3월</option>
          <option value='2'>2월</option>
          <option value='1'>1월</option>
        </select>
      </div>
    </div>
  );
};
