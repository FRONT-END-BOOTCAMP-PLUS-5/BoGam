'use client';

import { useState } from 'react';
import BookLayout from './_components/BookLayout';
import { stepsStyles } from './page.styles';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';

export default function Steps() {
  const [isAllBooksLoaded, setIsAllBooksLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);



  const handleAllBooksLoaded = () => {
    setIsAllBooksLoaded(true);
  };

  const handleLoadingProgress = (progress: number) => {
    setLoadingProgress(progress);
  };

  return (
    <div className={stepsStyles.container}>
      {/* header */}

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
        stepLabel="완료"
      />

      {/* footer */}
    </div>
  );
}
