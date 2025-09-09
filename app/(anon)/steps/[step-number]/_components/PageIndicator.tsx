'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { styles } from './PageIndicator.styles';
import { FlipBookInstance } from './FlipBook';

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
  stepNumber: string;
  flipBookInstance: FlipBookInstance | null;
  onPageChange: (page: number) => void;
}

export default function PageIndicator({
  currentPage,
  totalPages,
  stepNumber,
  flipBookInstance,
  onPageChange,
}: PageIndicatorProps) {
  const router = useRouter();

  const handlePageClick = (pageIndex: number) => {
    // flipBookInstance의 object.flip 함수 사용
    if (flipBookInstance?.object?.flip) {
      onPageChange(pageIndex);
      
      // flipPages 배열에서 실제 콘텐츠 페이지의 인덱스 찾기
      // 실제 콘텐츠는 0, 2, 4... 위치에 있고, 빈 페이지는 1, 3, 5... 위치에 있음
      const actualPageIndex = pageIndex * 2;
      
      // turnToPage 함수가 있다면 사용 (애니메이션 없음, 더 정확함)
      flipBookInstance.object.turnToPage(actualPageIndex);
      
      // 페이지 이동 후 currentPage를 강제로 설정 (안전장치)
      setTimeout(() => {
        onPageChange(pageIndex);
      }, 100);
    }
  };

  const handlePreviousStep = () => {
    if (Number(stepNumber) > 1) {
      router.push(`/steps/${Number(stepNumber) - 1}`);
    }
  };

  const handleNextStep = () => {
    if (Number(stepNumber) < 7) {
      router.push(`/steps/${Number(stepNumber) + 1}`);
    }
  };

  return (
    <div className={styles.indicatorArea}>
      <div className={styles.indicatorWrapper}>
        <div className={styles.indicatorLeft}>
          <button
            className={`${styles.indicatorArrowBtn} ${Number(stepNumber) <= 1 ? styles.disabled : ''}`}
            aria-label='이전 단계로 이동'
            onClick={handlePreviousStep}
            disabled={Number(stepNumber) <= 1}
          >
            <ChevronLeft size={22} color={Number(stepNumber) <= 1 ? '#ccc' : '#222'} />
          </button>
        </div>
        <div className={styles.indicatorDots}>
          {Array.from({ length: totalPages }).map((_, j) => (
            <button
              key={j}
              className={
                j === currentPage ? styles.dotActive : styles.dot
              }
              aria-label={`slide ${j}${
                j === currentPage ? ' (current)' : ''
              }`}
              onClick={() => handlePageClick(j)}
            />
          ))}
        </div>
        <div className={styles.indicatorRight}>
          <button
            className={`${styles.indicatorArrowBtn} ${Number(stepNumber) >= 7 ? styles.disabled : ''}`}
            aria-label='다음 단계로 이동'
            onClick={handleNextStep}
            disabled={Number(stepNumber) >= 7}
          >
            <ChevronRight size={22} color={Number(stepNumber) >= 7 ? '#ccc' : '#222'} />
          </button>
        </div>
      </div>
    </div>
  );
}
