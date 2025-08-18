'use client';

import { useState } from 'react';
import BookLayout from './_components/BookLayout';
import { stepsStyles } from './page.styles';

export default function Steps() {
  const [isAllBooksLoaded, setIsAllBooksLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleBookClick = (bookId: number) => {
    console.log(`📚 ${bookId}단계 클릭됨!`);
  };

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
          onBookClick={handleBookClick} 
          onAllBooksLoaded={handleAllBooksLoaded}
          onLoadingProgress={handleLoadingProgress}
        />
      </div>

      {/* 로딩 오버레이 */}
      {!isAllBooksLoaded && (
        <div className={stepsStyles.loadingOverlay}>
          <div className={stepsStyles.loadingContent}>
            <div className="mb-6">
              <div className={stepsStyles.loadingSpinner}></div>
              <h2 className={stepsStyles.loadingTitle}>책 가져오는 중...</h2>
              
              {/* 진행률 바 */}
              <div className={stepsStyles.progressBarContainer}>
                <div 
                  className={stepsStyles.progressBar}
                  style={{ width: `${(loadingProgress / 7) * 100}%` }}
                ></div>
              </div>
              
              {/* 진행률 텍스트 */}
              <p className={stepsStyles.progressText}>{loadingProgress}/7 완료</p>
            </div>
          </div>
        </div>
      )}

      {/* footer */}
    </div>
  );
}
