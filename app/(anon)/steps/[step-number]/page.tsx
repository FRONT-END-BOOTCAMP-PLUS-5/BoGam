'use client';

import { useEffect, useRef, useState } from 'react';

import { styles } from './page.styles';
import StateIcon from '@/(anon)/_components/common/stateIcon/StateIcon';
import ProgressBarChart from '@/(anon)/_components/common/stateIcon/ProgressBarChart';
import FlipBook, { FlipBookInstance } from '@/(anon)/steps/[step-number]/_components/FlipBook';
import PageIndicator from '@/(anon)/steps/[step-number]/_components/PageIndicator';
import FlipPages, { PageData } from '@/(anon)/steps/[step-number]/_components/FlipPages';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';


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


export default function MiddleStepPage() {
  const [marginLeft, setMarginLeft] = useState('-73%');
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const flipBookRef = useRef<FlipBookInstance | null>(null);
  
  // stepResults 데이터 상태
  const [stepData, setStepData] = useState<StepResultResponse | null>(null);
  const [stepDataLoading, setStepDataLoading] = useState(true);
  
  // 세션 스토리지에서 selectedAddress 가져오기
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  
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

  // 세션 스토리지에서 selectedAddress 가져오기
  useEffect(() => {
    const sessionData = sessionStorage.getItem('user-address-store');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData) as { state: { selectedAddress: UserAddress | null } };
        setSelectedAddress(parsed.state?.selectedAddress || null);
      } catch (error) {
        console.error('세션 데이터 파싱 실패:', error);
        setSelectedAddress(null);
      }
    }
  }, []);

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

  // stepResults 데이터 가져오기
  useEffect(() => {
    const fetchStepData = async () => {
      try {
        const match = window.location.pathname.match(/\/steps\/(\d+)/);
        const stepNumber = match ? match[1] : '1';
        
        // selectedAddress가 없으면 로딩 중단
        if (!selectedAddress?.nickname) {
          setStepDataLoading(false);
          return;
        }
        
        const response = await fetch(
          `/api/step-results?userAddressNickname=${encodeURIComponent(selectedAddress.nickname)}&stepNumber=${stepNumber}`,
          {
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch step results');
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch step results');
        }

        setStepData(data.data);
      } catch (error) {
        console.error('Error fetching step data:', error);
        setStepData(null);
      } finally {
        setStepDataLoading(false);
      }
    };

    fetchStepData();
  }, [selectedAddress?.nickname]);

  const match =
    typeof window !== 'undefined'
      ? window.location.pathname.match(/\/steps\/(\d+)/)
      : null;
  const stepNumber = match ? match[1] : '1';

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

  if (loading || stepDataLoading) return <LoadingOverlay isVisible={true} title="데이터를 불러오는 중..." currentStep={1} totalSteps={3} />;
  
  return (
    <div className={styles.mainContainer}>
      <div className={styles.stateIconArea}>
        <div className="flex flex-col gap-4">
          <StateIcon 
            checked={stepData?.summary?.totalMatch || 0}
            unchecked={stepData?.summary?.totalUnchecked || 0}
            mismatch={stepData?.summary?.totalMismatch || 0}
          />
          <ProgressBarChart 
            checked={stepData?.summary?.totalMatch || 0}
            unchecked={stepData?.summary?.totalUnchecked || 0}
            mismatch={stepData?.summary?.totalMismatch || 0}
          />
        </div>
      </div>
      
      <FlipBook
        flipPages={FlipPages({ pages, stepNumber, currentPage })}
        currentPage={currentPage}
        marginLeft={marginLeft}
        onPageChange={setCurrentPage}
        onFlipBookInit={() => {}}
        flipBookRef={flipBookRef}
      />

      <PageIndicator
        currentPage={currentPage}
        totalPages={pages.length}
        stepNumber={stepNumber}
        flipBookInstance={flipBookRef.current}
        onPageChange={setCurrentPage}
      />
     </div>
   );
 }