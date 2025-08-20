'use client';

import React, { useState } from 'react';
import { TopSection } from '@/(anon)/main/_components/topSection/TopSection';
import { TabContainer } from '@/(anon)/main/_components/tabContainer/TabContainer';
import { TransactionSearchModal } from '@/(anon)/main/_components/transactionSearchModal/TransactionSearchModal';
import KakaoMapModule from '@/(anon)/main/_components/kakaoMapModule/KakaoMapModule';
import { useMainPageModule } from '@/(anon)/main/_components/hooks/useMainPageModule';
import { styles } from './main.styles';
import { useMainPageState } from '@/(anon)/main/_components/hooks/useMainPageState';
import AuthLanding from '@/(anon)/main/_components/AuthLanding';

export default function MainPage() {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState(0);

  const {
    selectedAddress,
    searchQuery,
    roadAddress,
    dong,
    ho,
    buildingType,
    selectedYear,
    selectedMonth,
    isNewAddressSearch,
    gpsLoading,
    gpsError,
    currentLocationType,
    postcodeRef,
    showPostcode,
    setShowPostcode,

    // 상태 설정 함수
    setSearchQuery,
    setBuildingType,
    setSelectedYear,
    setSelectedMonth,

    // 액션 함수
    handleAddressChangeWithTransaction,
    handleMoveToAddress,
    handleMoveToAddressOnly,
    onSearch,

    // 위치 관리 액션 함수
    // refreshGPSLocation,

    // 주소 저장 함수
    saveAddressToUser,

    // 실거래가 조회 모달 관련
    showTransactionSearchModal,
    setShowTransactionSearchModal,
    handleBuildingSelect,
  } = useMainPageModule();

  // useMainPageState에서 상태와 setter 함수들을 가져오기
  const {
    searchQuery: searchQueryState,
    roadAddress: roadAddressState,
    dong: dongState,
    ho: hoState,
    buildingType: buildingTypeState,
    selectedYear: selectedYearState,
    selectedMonth: selectedMonthState,
    setSearchQuery: setSearchQueryState,
    setRoadAddress: setRoadAddressState,
    setDong: setDongState,
    setHo: setHoState,
    setBuildingType: setBuildingTypeState,
    setSelectedYear: setSelectedYearState,
    setSelectedMonth: setSelectedMonthState,
  } = useMainPageState();

  // 탭 변경 핸들러
  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className={styles.containerMobile}>
      <div className={styles.container}>
        {/* 상단 섹션 - 사용자 정보 및 선택된 주소 */}
        <TopSection />

        {/* 하단 섹션 - 관심 지역 지도 및 탭 컨테이너 */}
        <div className={styles.bottomSection}>
          {/* 지도 헤더 - 첫 번째 탭에서만 표시 */}
          {activeTab === 0 && (
            <>
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
            </>
          )}

          {/* 탭 컨테이너 */}
          <TabContainer activeTab={activeTab} onTabChange={handleTabChange} />

          {/* 지도 컴포넌트 - 첫 번째 탭에서만 표시 */}
          {activeTab === 0 && (
            <div className={styles.mapContainer}>
              <KakaoMapModule showTransactionMarkers={true} />
            </div>
          )}

          {/* 실거래가 조회 모달 */}
          <TransactionSearchModal
            isOpen={showTransactionSearchModal}
            onClose={() => setShowTransactionSearchModal(false)}
            selectedAddress={selectedAddress}
            onBuildingSelect={handleBuildingSelect}
          />
        </div>
      </div>
      <AuthLanding />
    </div>
  );
}
