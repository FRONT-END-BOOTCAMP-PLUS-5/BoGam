'use client';

import { useEffect, useRef, useState } from 'react';

import HTMLFlipBook from 'react-pageflip';
import { styles } from './page.styles';
import GeneralPage from '@/(anon)/steps/[step-number]/_components/GeneralPage';
import SummaryPage from '@/(anon)/steps/[step-number]/_components/SummaryPage';
import StateIcon from '@/(anon)/_components/common/stateIcon/StateIcon';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
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

// API 응답 타입 정의
interface StepResultSummary {
  stepCount: number;
  stepNumber: number;
  totalMatch: number;
  totalMismatch: number;
  totalUnchecked: number;
}

interface StepResultItem {
  id: number;
  userAddressId: number;
  stepId: number;
  stepNumber: number;
  mismatch: number;
  match: number;
  unchecked: number;
  jsonDetails: Record<string, 'match' | 'mismatch' | 'unchecked'>;
  createdAt: string;
  updatedAt: string;
  detail: number;
}

interface StepResultResponse {
  results: StepResultItem[];
  summary: StepResultSummary;
}

interface PageContent {
  subtitle: string;
  items: string[];
}

interface SummaryPageData {
  type: 'summary';
  title: string;
  contents: PageContent[];
}

interface GeneralPageData {
  type: 'general';
  title: string;
  category: string;
  content: string;
}

type PageData = SummaryPageData | GeneralPageData;

export default function MiddleStepPage() {
  const router = useRouter();
  const bookRef = useRef<BookRefType>(null);
  const [marginLeft, setMarginLeft] = useState('-73%');
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isManualFlip, setIsManualFlip] = useState(false);
  const [flipBookInstance, setFlipBookInstance] = useState<FlipBookInstance | null>(null);
  
  // 딱 1번만 실행하기 위한 ref
  const hasInitialized = useRef(false);

  // 컴포넌트 마운트 시 딱 1번만 실행
  if (!hasInitialized.current && typeof window !== 'undefined') {
    hasInitialized.current = true;
    
    const savedPage = sessionStorage.getItem('saved-page');
    
    // saved-page가 있으면 페이지 복원
    if (savedPage !== null) {
      const pageIndex = parseInt(savedPage);
      if (!isNaN(pageIndex) && pageIndex >= 0) {
        setCurrentPage(pageIndex);
      }
    } else {
      setCurrentPage(0);
    }
 
    // 복원 후 플래그 제거
    sessionStorage.removeItem('saved-page');
  }

  useEffect(() => {
    const match = window.location.pathname.match(/\/steps\/(\d+)/);
    const stepNumber = match ? match[1] : '1';
    import(`./stepData/${stepNumber}.json`)
      .then((data) => {
        if (Array.isArray(data.default)) {
          setPages(data.default[0]?.pages || []);
        } else if (data.default?.pages) {
          setPages(data.default.pages);
        } else if (Array.isArray(data)) {
          setPages(data[0]?.pages || []);
        } else if (data.pages) {
          setPages(data.pages);
        } else {
          setPages([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('JSON 파일 로드 실패:', error);
        setPages([]);
        setLoading(false);
      });
  }, []);

  const match =
    typeof window !== 'undefined'
      ? window.location.pathname.match(/\/steps\/(\d+)/)
      : null;
  const stepNumber = match ? match[1] : '1';

  // 사용자 주소 정보와 stepResults 가져오기 (특정 단계)
  const { selectedAddress } = useUserAddressStore();
  const { data: stepResultsData, isLoading: stepResultsLoading } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: stepNumber,
    detail: '' // detail은 빈 문자열로 전달
  });
  console.log('stepResultsData', stepResultsData);

  // stepResults 데이터 처리 - results 배열에서 현재 stepNumber에 해당하는 데이터 찾기
  const stepResults = stepResultsData && typeof stepResultsData === 'object' && 'results' in stepResultsData && Array.isArray(stepResultsData.results) ? stepResultsData.results : [];
  
  // summary에서 전체 total 값들을 가져오기
  const totalMatch = (stepResultsData as StepResultResponse)?.summary?.totalMatch || 0;
  const totalUnchecked = (stepResultsData as StepResultResponse)?.summary?.totalUnchecked || 0;
  const totalMismatch = (stepResultsData as StepResultResponse)?.summary?.totalMismatch || 0;

  const flipPages: ReactNode[] = [];
  pages.forEach((page: PageData, idx: number) => {
    if (page.type === 'summary') {
      flipPages.push(
        <div key={`summary-${idx}`} className={styles.flex}>
          <SummaryPage
            title={page.title ?? ''}
            contents={page.contents ?? []}
            stepNumber={stepNumber}
          />
        </div>
      );
    } else if (page.type === 'general') {
      flipPages.push(
        <div key={`general-${idx}`} className={styles.flex}>
          <GeneralPage
            title={page.title ?? ''}
            category={page.category ?? ''}
            content={page.content ?? ''}
            pageIdx={idx}
            stepNumber={stepNumber}
            currentPage={currentPage}
          />
        </div>
      );
    }
    if (idx < pages.length - 1) {
      flipPages.push(
        <div key={`empty-${idx}`} className={styles.page}>
          <div className={`${styles.pageContent} bg-brand-light-gray`}></div>
        </div>
      );
    }
  });

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

  if (loading || stepResultsLoading || !stepResults || stepResults.length === 0) return <LoadingOverlay isVisible={true} title="데이터를 불러오는 중..." currentStep={1} totalSteps={3} />;
  
  return (
    <div className={styles.mainContainer}>
      <div className={styles.stateIconArea}>
        <StateIcon 
          completedCount={totalMatch} 
          unconfirmedCount={totalUnchecked} 
          warningCount={totalMismatch} 
        />
      </div>
      
      <div className={styles.flipBookArea}>
        <HTMLFlipBook
          ref={bookRef}
          className={styles.demoBook}
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
          onInit={(flipBook: FlipBookInstance) => {
            // flipBook 객체를 별도로 저장
            setFlipBookInstance(flipBook);
            bookRef.current = flipBook;
          }}
          onFlip={(e: { data: number }) => {
            // 수동 페이지 넘김이 아닐 때만 currentPage 업데이트
            if (!isManualFlip) {
              // e.data는 flipPages 배열의 인덱스
              // 실제 콘텐츠 페이지는 0, 2, 4... 위치에 있으므로 2로 나눔
              const calculatedPage = Math.floor((e.data + 1) / 2);
              // 계산된 페이지가 유효한 범위 내에 있는지 확인
              if (calculatedPage >= 0 && calculatedPage < pages.length) {
                setCurrentPage(calculatedPage);
              }
            }
            // 플래그 리셋 (약간의 지연을 두어 수동 설정이 우선되도록 함)
            setTimeout(() => {
              setIsManualFlip(false);
            }, 50);
          }}
        >
          {flipPages}
        </HTMLFlipBook>
      </div>

      <div className={styles.indicatorArea}>
        <div className={styles.indicatorWrapper}>
          <div className={styles.indicatorLeft}>
            <button
              className={`${styles.indicatorArrowBtn} ${Number(stepNumber) <= 1 ? styles.disabled : ''}`}
              aria-label='이전 단계로 이동'
              onClick={() => Number(stepNumber) > 1 && router.push(`/steps/${Number(stepNumber) - 1}`)}
              disabled={Number(stepNumber) <= 1}
            >
              <ChevronLeft size={22} color={Number(stepNumber) <= 1 ? '#ccc' : '#222'} />
            </button>
          </div>
          <div className={styles.indicatorDots}>
            {Array.from({ length: pages.length }).map((_, j) => (
              <button
                key={j}
                className={
                  j === currentPage ? styles.dotActive : styles.dot
                 }
                aria-label={`slide ${j}${
                  j === currentPage ? ' (current)' : ''
                }`}
                onClick={() => {
                   // flipBookInstance 또는 bookRef.current의 object.flip 함수 사용
                   const flipBook = flipBookInstance || bookRef.current;

                   if (flipBook?.object?.flip) {
                     setIsManualFlip(true);
                     setCurrentPage(j);
                     
                     // flipPages 배열에서 실제 콘텐츠 페이지의 인덱스 찾기
                     // 실제 콘텐츠는 0, 2, 4... 위치에 있고, 빈 페이지는 1, 3, 5... 위치에 있음
                     const actualPageIndex = j * 2;
                     
                     // turnToPage 함수가 있다면 사용 (애니메이션 없음, 더 정확함)
                     //if (flipBook.object.turnToPage) {
                       flipBook.object.turnToPage(actualPageIndex);
                     //} else {
                     //  flipBook.object.flip(actualPageIndex);
                     //
                     // 페이지 이동 후 currentPage를 강제로 설정 (안전장치)
                     setTimeout(() => {
                       setCurrentPage(j);
                     }, 100);
                   }
                 }}
               />
             ))}
           </div>
           <div className={styles.indicatorRight}>
             <button
               className={`${styles.indicatorArrowBtn} ${Number(stepNumber) >= 7 ? styles.disabled : ''}`}
               aria-label='다음 단계로 이동'
               onClick={() => Number(stepNumber) < 7 && router.push(`/steps/${Number(stepNumber) + 1}`)}
               disabled={Number(stepNumber) >= 7}
             >
               <ChevronRight size={22} color={Number(stepNumber) >= 7 ? '#ccc' : '#222'} />
             </button>
           </div>
         </div>
       </div>
     </div>
   );
 }