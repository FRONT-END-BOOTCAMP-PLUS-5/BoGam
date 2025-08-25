import React, { useRef, useEffect } from 'react';
import {
  BuildingType,
  UserAddress,
} from '@/(anon)/main/_components/types/mainPage.types';
import { styles } from './SearchSection.styles';
import { DropDown } from '@/(anon)/_components/common/dropdown/DropDown';

interface SearchSectionProps {
  searchQuery: string;
  roadAddress: string;
  dong: string;
  ho: string;
  buildingType: BuildingType;
  selectedYear: string;
  selectedMonth: string;
  showPostcode: boolean;
  selectedAddress?: UserAddress | null;
  isNewAddressSearch: boolean;
  onSearchQueryChange: (value: string) => void;
  onDongChange: (value: string) => void;
  onHoChange: (value: string) => void;
  onBuildingTypeChange: (type: BuildingType) => void;
  onSelectedYearChange: (value: string) => void;
  onSelectedMonthChange: (value: string) => void;
  onSearch: () => void;
  onMoveToAddress: () => void;
  onMoveToAddressOnly: () => void;
  onSaveAddress: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  roadAddress,
  dong,
  ho,
  buildingType,
  selectedYear,
  selectedMonth,
  selectedAddress,
  isNewAddressSearch,
  onSearchQueryChange,
  onDongChange,
  onHoChange,
  onBuildingTypeChange,
  onSelectedYearChange,
  onSelectedMonthChange,
  onSearch,
  onMoveToAddress,
  onMoveToAddressOnly,
  onSaveAddress,
}) => {
  const dongInputRef = useRef<HTMLInputElement>(null);
  const hoInputRef = useRef<HTMLInputElement>(null);

  // 드롭다운 선택 시 ref 업데이트
  useEffect(() => {

    // 주소 드롭다운에서 선택된 주소가 있고, 새 주소 검색이 아닌 경우
    if (!isNewAddressSearch && selectedAddress) {
      if (dongInputRef.current) {
        dongInputRef.current.value = selectedAddress.dong || '';
      }
      if (hoInputRef.current) {
        hoInputRef.current.value = selectedAddress.ho || '';
      }
    }
  }, [selectedAddress, isNewAddressSearch, roadAddress, dong, ho, searchQuery]);

  // selectedAddress가 변경될 때마다 ref 업데이트
  useEffect(() => {

    // selectedAddress가 있고, 새 주소 검색이 아닌 경우
    if (selectedAddress && !isNewAddressSearch) {
      if (dongInputRef.current) {
        dongInputRef.current.value = selectedAddress.dong || '';
      }
      if (hoInputRef.current) {
        hoInputRef.current.value = selectedAddress.ho || '';
      }
    }
  }, [selectedAddress, isNewAddressSearch]);

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

  // 새로운 주소 검색 결과인지 확인
  const hasNewSearchResult =
    isNewAddressSearch && roadAddress && roadAddress.trim() !== '';

  // 주소 표시 로직 - selectedAddress 우선
  const displayAddress =
    selectedAddress?.roadAddress || selectedAddress?.lotAddress || roadAddress;
  const displayRoadAddress = selectedAddress?.roadAddress || roadAddress || '';
  const displayLotAddress = selectedAddress?.lotAddress || '';
  const displaySearchQuery =
    selectedAddress?.completeAddress || searchQuery || '';

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchRow}>
        <input
          type='text'
          placeholder='주소를 검색하려면 버튼을 클릭하세요!'
          value={displaySearchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className={styles.searchInput}
          readOnly
        />
        <button onClick={onSearch} className={styles.searchButton}>
          주소 검색
        </button>
      </div>

      {/* 동/호 입력 및 지도 이동 */}
      {(displayAddress || roadAddress) && (
        <div className={styles.addressDetailRow}>
          <div className={styles.addressInfo}>
            <span className={styles.addressLabel}>선택된 주소:</span>
            <span className={styles.addressValue}>
              {displayAddress || roadAddress}
            </span>
          </div>
          {(selectedAddress || hasNewSearchResult) && (
            <div className={styles.addressInfo}>
              <div className={styles.addressInfo}>
                <span className={styles.addressLabel}>도로명 주소:</span>
                <span className={styles.addressValue}>
                  {displayRoadAddress}
                </span>
              </div>
              <div className={styles.addressInfo}>
                <span className={styles.addressLabel}>지번 주소:</span>
                <span className={styles.addressValue}>{displayLotAddress}</span>
              </div>
              {/* 현재 사용 중인 주소 타입 표시 */}
              {hasNewSearchResult && (
                <div className={styles.addressInfo}>
                  <span className={styles.addressLabel}>현재 사용 중:</span>
                  <span className={styles.addressValue}>
                    {selectedAddress?.roadAddress ? '도로명 주소' : '지번 주소'}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className={styles.buildingInfoContainer}>
            {/* 건물 유형 선택 */}
            <div className={styles.buildingTypeContainer}>
              <label className={styles.buildingTypeLabel}>건물 유형:</label>
              <DropDown
                options={[
                  { value: '', label: '선택하세요' },
                  { value: 'residential', label: '주거용' },
                  { value: 'commercial', label: '상업용' }
                ]}
                value={buildingType.category}
                onChange={handleBuildingCategoryChange}
                placeholder="건물 유형을 선택하세요"
              />

              {buildingType.category === 'residential' && (
                <DropDown
                  options={[
                    { value: '', label: '주거용 건물 선택' },
                    { value: 'apartment', label: '아파트' },
                    { value: 'villa', label: '연립/다세대' },
                    { value: 'officetel', label: '오피스텔' }
                  ]}
                  value={buildingType.type}
                  onChange={handleBuildingTypeChange}
                  placeholder="주거용 건물을 선택하세요"
                />
              )}

              {buildingType.category === 'commercial' && (
                <DropDown
                  options={[
                    { value: '', label: '상업용 건물 선택' },
                    { value: 'detached', label: '단독' },
                    { value: 'multi', label: '다가구' }
                  ]}
                  value={buildingType.type}
                  onChange={handleBuildingTypeChange}
                  placeholder="상업용 건물을 선택하세요"
                />
              )}
            </div>

            {/* 동/호 입력 */}
            <div className={styles.dongHoInput}>
              <div className={styles.dongHoRow}>
                <input
                  type='text'
                  placeholder='동 (예: 101)'
                  onChange={(e) => onDongChange(e.target.value)}
                  className={styles.dongField}
                  ref={dongInputRef}
                />
                <span className={styles.dongHoSeparator}>동</span>
                <input
                  type='text'
                  placeholder='호 (선택사항)'
                  onChange={(e) => onHoChange(e.target.value)}
                  className={styles.hoField}
                  ref={hoInputRef}
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
                  실거래가 조회
                </button>
                <button
                  onClick={onSaveAddress}
                  disabled={!dong.trim()}
                  className={styles.saveButton}
                >
                  저장하기
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
        <DropDown
          id='yearSelect'
          options={[
            { value: '2025', label: '2025년' },
            { value: '2024', label: '2024년' },
            { value: '2023', label: '2023년' },
            { value: '2022', label: '2022년' },
            { value: '2021', label: '2021년' },
            { value: '2020', label: '2020년' }
          ]}
          value={selectedYear}
          onChange={onSelectedYearChange}
          placeholder="연도를 선택하세요"
        />
        <DropDown
          id='monthSelect'
          options={[
            { value: '12', label: '12월' },
            { value: '11', label: '11월' },
            { value: '10', label: '10월' },
            { value: '9', label: '9월' },
            { value: '8', label: '8월' },
            { value: '7', label: '7월' },
            { value: '6', label: '6월' },
            { value: '5', label: '5월' },
            { value: '4', label: '4월' },
            { value: '3', label: '3월' },
            { value: '2', label: '2월' },
            { value: '1', label: '1월' }
          ]}
          value={selectedMonth}
          onChange={onSelectedMonthChange}
          placeholder="월을 선택하세요"
        />
      </div>
    </div>
  );
};
