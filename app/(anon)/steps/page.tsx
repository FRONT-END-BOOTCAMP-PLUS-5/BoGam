'use client';

import { useState, useEffect } from 'react';
import BookLayout from './_components/BookLayout';
import { stepsStyles } from './page.styles';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown/AddressDropDown';

export default function Steps() {
  const [isAllBooksLoaded, setIsAllBooksLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 페이지 타이틀 설정
  useEffect(() => {
    document.title = '단계별 전세사기 예방 가이드 | Bogam';
  }, []);

  const handleAllBooksLoaded = () => {
    setIsAllBooksLoaded(true);
  };

  const handleLoadingProgress = (progress: number) => {
    setLoadingProgress(progress);
  };

  return (
    <div className={stepsStyles.container}>
      {/* 주소 드롭다운 헤더 */}
      <header className={stepsStyles.header}>
        <AddressDropDown 
          title="현재 열람"
          showFavoriteToggle={true}
          showDeleteButton={true}
        />
      </header>

      {/* 메인 콘텐츠 */}
      <div className={stepsStyles.mainContent}>
        <BookLayout 
          onAllBooksLoaded={handleAllBooksLoaded}
          onLoadingProgress={handleLoadingProgress}
        />
      </div>

      {/* 로딩 오버레이 */}
      <LoadingOverlay
        isVisible={!isAllBooksLoaded}
        title="책 가져오는 중..."
        currentStep={loadingProgress}
        totalSteps={7}
      />

      {/* footer */}
    </div>
  );
}
