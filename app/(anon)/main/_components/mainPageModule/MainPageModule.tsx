'use client';

import React, { useMemo } from 'react';
import { TopSection } from '@/(anon)/main/_components/topSection/TopSection';
import { SearchSection } from '@/(anon)/main/_components/searchSection/SearchSection';
import { TransactionList } from '@/(anon)/main/_components/transactionList/TransactionList';
import { DaumPostcodeModal } from '@/(anon)/main/_components/daumPostcodeModal/DaumPostcodeModal';
import KakaoMapModule from '@/(anon)/main/_components/kakaoMapModule/KakaoMapModule';

import { styles } from './MainPageModule.styles';

interface MainPageModuleProps {
  state: ReturnType<
    typeof import('../hooks/useMainPageModule').useMainPageModule
  >;
}

const MainPageModule: React.FC<MainPageModuleProps> = ({ state }) => {
  const {
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

    // 상태 설정 함수
    setSearchQuery,
    setDong,
    setHo,
    setBuildingType,
    setMapCenter,
    setSearchLocationMarker,
    setSelectedYear,
    setSelectedMonth,
    setIsLoading,
    setShowPostcode,

    // 액션 함수
    handleAddressChangeWithTransaction,
    handleMoveToAddress,
    handleMoveToAddressOnly,
    handleTransactionClick,
    execDaumPostcode,
    postcodeRef,
    adjustBounds,
  } = state;

  return (
    <div className={styles.container}>
      {/* 상단 섹션 - 사용자 정보 및 선택된 주소 */}
      <TopSection
        userAddresses={userAddresses}
        selectedAddress={selectedAddress}
        onAddressChange={handleAddressChangeWithTransaction}
      />

      {/* 하단 섹션 - 관심 지역 지도 및 검색 */}
      <div className={styles.bottomSection}>
        <div className={styles.mapHeader}>
          <span className={styles.mapIcon}>🗺️</span>
          <span className={styles.mapTitle}>관심 지역 지도</span>
        </div>

        <div className={styles.searchGuide}>
          주소와 키워드로 전세매물을 찾아보세요!
        </div>

        {/* 검색 섹션 */}
        <SearchSection
          searchQuery={searchQuery}
          detailAddress={detailAddress}
          dong={dong}
          ho={ho}
          buildingType={buildingType}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          isLoading={isLoading}
          showPostcode={showPostcode}
          onSearchQueryChange={setSearchQuery}
          onDongChange={setDong}
          onHoChange={setHo}
          onBuildingTypeChange={setBuildingType}
          onSelectedYearChange={setSelectedYear}
          onSelectedMonthChange={setSelectedMonth}
          onSearch={execDaumPostcode}
          onMoveToAddress={handleMoveToAddress}
          onMoveToAddressOnly={handleMoveToAddressOnly}
        />

        {/* 지도 컴포넌트 */}
        <div className={styles.mapContainer}>
          <KakaoMapModule
            center={mapCenter}
            level={3}
            useGPSFirst={false}
            showCurrentLocationMarker={false}
            showAddressInfo={false}
            transactionData={transactionData}
            searchLocationMarker={searchLocationMarker}
            adjustBounds={adjustBounds}
          />
        </div>

        {/* 실거래가 데이터 목록 */}
        <TransactionList
          transactionData={transactionData}
          onTransactionClick={handleTransactionClick}
        />

        {/* Daum 우편번호 검색 모달 */}
        <DaumPostcodeModal
          showPostcode={showPostcode}
          postcodeRef={postcodeRef}
          onClose={() => setShowPostcode(false)}
        />
      </div>
    </div>
  );
};

export default MainPageModule;
