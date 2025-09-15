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
  const [bookSize, setBookSize] = useState({ width: 400, height: 600 });
  
  // 책 크기 계산 및 마진 계산을 위한 useEffect
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      
      const vh = window.innerHeight;
      const height = vh * 0.55;
      const width = height / 1.44;
      const newBookSize = { width: Math.round(width), height: Math.round(height) };
      setBookSize(newBookSize);

      const containerWidth = Math.min(window.innerWidth, 480);
      const marginLeftPixels = (containerWidth - 3 * newBookSize.width) / 2;
      setMarginLeft(`translateX(${marginLeftPixels}px)`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  // currentPage가 변경될 때 FlipBook 페이지 변경
  useEffect(() => {
    if (flipBookInstance && !isLoading) {
      setIsManualFlip(true);
      flipBookInstance.object.turnToPage(currentPage * 2);
    }
  }, [currentPage, flipBookInstance, isLoading]);


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
        width={bookSize.width}
        height={bookSize.height}
        size='fixed'
        minWidth={bookSize.width}
        maxWidth={bookSize.width}
        minHeight={bookSize.height}
        maxHeight={bookSize.height}
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
