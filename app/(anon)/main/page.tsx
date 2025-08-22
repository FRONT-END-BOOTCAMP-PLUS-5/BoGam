'use client';

import React, { useState } from 'react';
import AuthLanding from '@/(anon)/main/_components/AuthLanding';
import { TopSection } from '@/(anon)/main/_components/topSection/TopSection';
import { TabContainer } from '@/(anon)/main/_components/tabContainer/TabContainer';
import KakaoMapModule from '@/(anon)/main/_components/kakaoMapModule/KakaoMapModule';
import FloatingButton from '@/(anon)/main/_components/floatingButton/FloatingButton';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import { styles } from './main.styles';
import { MapPinned, Pin, House, X } from 'lucide-react';

export default function MainPage() {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState(0);

  // useMainPageModule에서 모든 상태와 함수 가져오기 (React Query 포함)
  const mainPageModule = useMainPageModule();
  const { gpsLoading, gpsError, currentLocationType } = mainPageModule;

  // 탭 변경 핸들러
  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <div>
      <div className={styles.container}>
        {/* 상단 섹션 - 사용자 정보 및 선택된 주소 */}
        <TopSection />

        {/* 하단 섹션 - 관심 지역 지도 및 탭 컨테이너 */}
        <div className={styles.bottomSection}>
          {/* 지도 헤더 - 첫 번째 탭에서만 표시 */}

          <div className={styles.mapHeader}>
            <MapPinned className={styles.mapIcon} />
            <span className={styles.mapTitle}>관심 지역 지도</span>
            {/* 위치 상태 표시 */}
            <div className={styles.locationStatus}>
              {gpsLoading ? (
                <span className={styles.locationLoading}>
                  <Pin /> 위치 확인 중...
                </span>
              ) : gpsError ? (
                <span className={styles.locationError}>
                  <X size={16} /> 위치 오류
                </span>
              ) : currentLocationType === 'gps' ? (
                <span className={styles.locationGPS}>
                  <Pin size={16} /> GPS 위치
                </span>
              ) : (
                <span className={styles.locationUser}>
                  <House size={16} /> 사용자 주소
                </span>
              )}
            </div>
          </div>

          <div className={styles.searchGuide}>
            관심 전세매물을 검색하여 전세보감의 가이드를 이용해 보세요!
          </div>

          {/* 탭 컨테이너 */}
          <TabContainer activeTab={activeTab} onTabChange={handleTabChange} />

          {/* 지도 컴포넌트 - 첫 번째 탭에서만 표시 */}
          {activeTab === 0 && (
            <div className={styles.mapContainer}>
              <KakaoMapModule showTransactionMarkers={true} />
            </div>
          )}
        </div>
        <FloatingButton />

        <div className={styles.buttonArea}></div>
      </div>
      <AuthLanding />
    </div>
  );
}
