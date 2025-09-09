'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { styles } from './FlipBook.styles';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';

// HTMLFlipBook 인스턴스 타입 정의
interface FlipBookInstance {
  object: {
    flip: (pageIndex: number) => void;
    turnToPage: (pageIndex: number) => void;
  };
}

// bookRef 타입 정의
type BookRefType = {
  object: {
    flip: (pageIndex: number) => void;
    turnToPage: (pageIndex: number) => void;
  };
} | null;

interface FlipBookProps {
  flipPages: ReactNode[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onFlipBookInit: (flipBook: FlipBookInstance) => void;
  flipBookRef?: React.RefObject<FlipBookInstance | null>;
}

export default function FlipBook({
  flipPages,
  currentPage,
  onPageChange,
  onFlipBookInit,
  flipBookRef,
}: FlipBookProps) {
  const bookRef = useRef<BookRefType>(null);
  const [isManualFlip, setIsManualFlip] = useState(false);
  const [flipBookInstance, setFlipBookInstance] = useState<FlipBookInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [marginLeft, setMarginLeft] = useState('translateX(-40.5%)');
  
  // 반응형 marginLeft 설정
  useEffect(() => {
    const width = window.innerWidth;
    if (width <= 400) {
      setMarginLeft('translateX(-48.5%)');
    } else if (width <= 430) {
      setMarginLeft('translateX(-45.5%)');
    } else {
      setMarginLeft('translateX(-40.5%)');
    }
  }, []);

  const handleFlip = (e: { data: number }) => {
    // 수동 페이지 넘김이 아닐 때만 currentPage 업데이트
    if (!isManualFlip) {
      // e.data는 flipPages 배열의 인덱스
      // 실제 콘텐츠 페이지는 0, 2, 4... 위치에 있으므로 2로 나눔
      const calculatedPage = Math.floor((e.data + 1) / 2);
      // 계산된 페이지가 유효한 범위 내에 있는지 확인
      if (calculatedPage >= 0) {
        onPageChange(calculatedPage);
      }
    }
    // 플래그 리셋 (약간의 지연을 두어 수동 설정이 우선되도록 함)
    setTimeout(() => {
      setIsManualFlip(false);
    }, 50);
  };

  const handleInit = (flipBook: FlipBookInstance) => {
    // flipBook 객체를 별도로 저장
    setFlipBookInstance(flipBook);
    bookRef.current = flipBook;
    onFlipBookInit(flipBook);
    
    // 외부 ref에 할당
    if (flipBookRef) {
      flipBookRef.current = flipBook;
    }
    
    // 로딩 완료
    setIsLoading(false);
  };


  return (
    <div className={styles.flipBookContainer}>
      <LoadingOverlay
        isVisible={isLoading}
        title="전세 사기 예방 가이드 로딩 중..."
        currentStep={1}
        totalSteps={1}
      />
      <HTMLFlipBook
        ref={bookRef}
        className={styles.flipBook}
        width={450}
        height={650}
        size='stretch'
        minWidth={350}
        maxWidth={550}
        minHeight={450}
        maxHeight={700}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        startPage={currentPage * 2} // 저장된 페이지 정보를 반영하여 시작 페이지 설정
        drawShadow={true}
        flippingTime={1000}
        usePortrait={false}
        style={
          marginLeft.startsWith('translateX')
            ? { transform: marginLeft }
            : { marginLeft }
        }
        startZIndex={0}
        autoSize={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={false}
        disableFlipByClick={false}
        onInit={handleInit}
        onFlip={handleFlip}
      >
        {flipPages}
      </HTMLFlipBook>
    </div>
  );
}

export { type FlipBookInstance, type BookRefType };
