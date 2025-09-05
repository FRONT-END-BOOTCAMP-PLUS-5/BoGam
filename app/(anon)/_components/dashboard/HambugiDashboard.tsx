'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useUserStore } from '@libs/stores/userStore';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useRootStep } from '@libs/stores/rootStepStore';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import DashboardHeader from './DashboardHeader';
import UserInfo from './UserInfo';
import StepNavigation from './StepNavigation';
import StepDetailContent, { GuideStepData } from './StepDetailContent';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { styles } from './HambugiDashboard.styles';
import { STEP_TITLES } from '@libs/constants/stepDetailTitles';

interface HambugiDashboardProps {
  onClose: () => void;
}

export default function HambugiDashboard({ onClose }: HambugiDashboardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 스토어 초기화 함수들
  const clearUser = useUserStore((state) => state.clearUser);
  const clearUserAddressStore = useUserAddressStore((state) => state.clearAll);
  const setStep = useRootStep((state) => state.setStep);

  // 사용자 주소 정보
  const { selectedAddress } = useUserAddressStore();

  // Step Results 데이터 가져오기 - selectedAddress가 있을 때만 실행
  const {
    data: stepResultsData,
    isLoading,
    isError,
  } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: '',
    detail: '',
  });

  // guideSteps 데이터 처리 - data가 배열인 경우 그대로 사용, 객체인 경우 results 배열 추출
  const guideSteps: GuideStepData[] = Array.isArray(stepResultsData)
    ? stepResultsData
    : stepResultsData &&
      typeof stepResultsData === 'object' &&
      'results' in stepResultsData &&
      Array.isArray(stepResultsData.results)
    ? stepResultsData.results
    : [];
  // currentStep에 따라 isActive 동적 설정
  const steps = useMemo(
    () => [
      {
        id: 1,
        title: STEP_TITLES[0],
        isActive: currentStep === 1,
        isCompleted: true,
      },
      {
        id: 2,
        title: STEP_TITLES[1],
        isActive: currentStep === 2,
        isCompleted: true,
      },
      {
        id: 3,
        title: STEP_TITLES[2],
        isActive: currentStep === 3,
        isCompleted: false,
      },
      {
        id: 4,
        title: STEP_TITLES[3],
        isActive: currentStep === 4,
        isCompleted: false,
      },
      {
        id: 5,
        title: STEP_TITLES[4],
        isActive: currentStep === 5,
        isCompleted: false,
      },
      {
        id: 6,
        title: STEP_TITLES[5],
        isActive: currentStep === 6,
        isCompleted: false,
      },
      {
        id: 7,
        title: STEP_TITLES[6],
        isActive: currentStep === 7,
        isCompleted: false,
      },
    ],
    [currentStep]
  );

  // selectedAddress가 없을 때 처리
  if (!selectedAddress?.nickname) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>📍</div>
            <h2 className={styles.errorTitle}>주소를 선택해주세요</h2>
            <p className={styles.errorMessage}>
              대시보드를 보려면 먼저 주소를 선택해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <LoadingOverlay
        isVisible={true}
        title='데이터를 불러오는 중입니다...'
        currentStep={1}
        totalSteps={1}
      />
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>데이터 로드 실패</h2>
            <p className={styles.errorMessage}>
              데이터를 불러오는데 실패했습니다.
            </p>
            <button
              onClick={() => window.location.reload()}
              className={styles.errorButton}
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleUserClick = () => {
    // 사용자 정보 페이지로 이동
    onClose();
    router.push('/mypage');
  };

  const handleLogout = async () => {
    try {
      // 1. 클라이언트 상태 초기화
      clearUser();
      clearUserAddressStore();

      // 2. sessionStorage 정리 (step 제외)
      sessionStorage.removeItem('user-store');
      sessionStorage.removeItem('user-address-store');

      // 3. step을 auth로 설정하고 sessionStorage에 저장
      setStep('auth');
      sessionStorage.setItem('step', 'auth');

      // 4. NextAuth 로그아웃
      await signOut({
        redirect: false,
        callbackUrl: '/',
      });

      // 5. 대시보드 닫기
      onClose();

      // 6. 홈페이지로 강제 리디렉트 (브라우저 새로고침)
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      // 오류가 발생해도 홈페이지로 이동
      onClose();
      window.location.href = '/';
    }
  };

  const handleActionClick = (actionLink: string) => {
    // 액션 링크 처리
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <DashboardHeader onClose={onClose} />

      {/* 사용자 정보 */}
      <UserInfo onUserClick={handleUserClick} />

      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        {/* 왼쪽: 단계 네비게이션 */}
        <div className={styles.leftPanel}>
          <StepNavigation
            steps={steps}
            onStepClick={handleStepClick}
            onLogout={handleLogout}
            currentStep={currentStep}
          />
        </div>

        {/* 구분선 */}
        <div className={styles.divider}>
          <div className={styles.dividerTriangle}></div>
        </div>

        {/* 오른쪽: 단계 상세 내용 */}
        <div className={styles.rightPanel}>
          <StepDetailContent
            stepTitle={STEP_TITLES[currentStep - 1] || '단계 정보'}
            guideSteps={guideSteps}
            onActionClick={handleActionClick}
            currentStep={currentStep}
          />
        </div>
      </div>
    </div>
  );
}
