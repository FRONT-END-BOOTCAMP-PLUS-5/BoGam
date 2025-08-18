'use client';

import React from 'react';
import { TopSection } from '@/(anon)/main/_components/topSection/TopSection';
import { SearchSection } from '@/(anon)/main/_components/searchSection/SearchSection';
import { TransactionList } from '@/(anon)/main/_components/transactionList/TransactionList';
import { DaumPostcodeModal } from '@/(anon)/main/_components/daumPostcodeModal/DaumPostcodeModal';
import KakaoMapModule from '@/(anon)/main/_components/kakaoMapModule/KakaoMapModule';
import { useMainPageModule } from '@/(anon)/main/_components/hooks/useMainPageModule';
import { styles } from './main.styles';
import { useMainPageState } from '@/(anon)/main/_components/hooks/useMainPageState';
import AuthLanding from '@/(anon)/main/_components/AuthLanding';

export default function MainPage() {
  const {
    userAddresses,
    selectedAddress,
    searchQuery,
    roadAddress,
    dong,
    ho,
    savedLawdCode,
    buildingType,
    selectedYear,
    selectedMonth,
    showPostcode,
    isNewAddressSearch,
    gpsLocation,
    gpsLoading,
    gpsError,
    currentLocationType,

    // 상태 설정 함수
    setSearchQuery,
    setBuildingType,
    setSelectedYear,
    setSelectedMonth,
    setShowPostcode,

    // 액션 함수
    handleAddressChangeWithTransaction,
    handleMoveToAddress,
    handleMoveToAddressOnly,
    onSearch,
    postcodeRef,

    // 위치 관리 액션 함수
    refreshGPSLocation,

    // 주소 저장 함수
    saveAddressToUser,
  } = useMainPageModule();

  // useMainPageState에서 setDong과 setHo를 직접 가져오기
  const { setDong, setHo } = useMainPageState();

  return (
    <div className={styles.containerMobile}>
      <div className={styles.container}>
        {/* 상단 섹션 - 사용자 정보 및 선택된 주소 */}
        <TopSection />

        {/* 하단 섹션 - 관심 지역 지도 및 검색 */}
        <div className={styles.bottomSection}>
          <div className={styles.mapHeader}>
            <span className={styles.mapIcon}>🗺️</span>
            <span className={styles.mapTitle}>관심 지역 지도</span>
            {/* 위치 상태 표시 */}
            <div className={styles.locationStatus}>
              {gpsLoading ? (
                <span className={styles.locationLoading}>
                  📍 위치 확인 중...
                </span>
              ) : gpsError ? (
                <span className={styles.locationError}>❌ 위치 오류</span>
              ) : currentLocationType === 'gps' ? (
                <span className={styles.locationGPS}>📍 GPS 위치</span>
              ) : (
                <span className={styles.locationUser}>🏠 사용자 주소</span>
              )}
            </div>
          </div>

          <div className={styles.searchGuide}>
            주소와 키워드로 전세매물을 찾아보세요!
          </div>

          {/* 검색 섹션 */}
          <SearchSection
            searchQuery={searchQuery}
            roadAddress={roadAddress}
            dong={dong}
            ho={ho}
            buildingType={buildingType}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            showPostcode={showPostcode}
            selectedAddress={selectedAddress}
            isNewAddressSearch={isNewAddressSearch}
            onSearchQueryChange={setSearchQuery}
            onDongChange={setDong}
            onHoChange={setHo}
            onBuildingTypeChange={setBuildingType}
            onSelectedYearChange={setSelectedYear}
            onSelectedMonthChange={setSelectedMonth}
            onSearch={onSearch}
            onMoveToAddress={handleMoveToAddress}
            onMoveToAddressOnly={handleMoveToAddressOnly}
            onSaveAddress={saveAddressToUser}
          />

          {/* 지도 컴포넌트 */}
          <div className={styles.mapContainer}>
            <KakaoMapModule showTransactionMarkers={true} />
          </div>

          {/* 실거래가 데이터 목록 */}
          <TransactionList />

          {/* Daum 우편번호 검색 모달 */}
          <DaumPostcodeModal
            postcodeRef={postcodeRef}
            showPostcode={showPostcode}
            onClose={() => setShowPostcode(false)}
          />
        </div>
      </div>
      <AuthLanding />
    </div>
  );
}
