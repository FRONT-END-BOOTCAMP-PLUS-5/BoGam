'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import FlipBook, { FlipBookInstance } from './FlipBook';
import PageIndicator from './PageIndicator';
import { styles } from './FlipBookSection.styles';

interface FlipBookSectionProps {
  flipPages: ReactNode[];
  stepNumber: string;
}

export default function FlipBookSection({ 
  flipPages, 
  stepNumber
}: FlipBookSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipBookReady, setIsFlipBookReady] = useState(false);
  const flipBookRef = useRef<FlipBookInstance | null>(null);
  
  // 세션 스토리지에서 페이지 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPage = sessionStorage.getItem('saved-page');
      if (savedPage !== null) {
        const pageIndex = parseInt(savedPage);
        if (!isNaN(pageIndex) && pageIndex >= 0) {
          setCurrentPage(pageIndex);
        }
      }
      // 복원 후 플래그 제거
      sessionStorage.removeItem('saved-page');
    }
  }, [typeof window !== 'undefined' ? sessionStorage.getItem('saved-page') : null]);

  return (
    <div className={styles.flipBookSection}>
      <div className={styles.flipBook}>
        <FlipBook
          flipPages={flipPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onFlipBookInit={() => {
            setIsFlipBookReady(true);
          }}
          flipBookRef={flipBookRef}
        />
      </div>

      <div className={styles.pageIndicator}>
        <PageIndicator
          currentPage={currentPage}
          totalPages={flipPages.length/2 +1}
          stepNumber={stepNumber}
          flipBookInstance={flipBookRef.current}
          onPageChange={setCurrentPage}
          isFlipBookReady={isFlipBookReady}
        />
      </div>
    </div>
  );
}
