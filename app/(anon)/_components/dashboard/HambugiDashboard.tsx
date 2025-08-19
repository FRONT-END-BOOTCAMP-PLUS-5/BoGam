'use client';

import React, { useState, useMemo } from 'react';
import DashboardHeader from './DashboardHeader';
import UserInfo from './UserInfo';
import StepNavigation from './StepNavigation';
import StepDetailContent from './StepDetailContent';
import { styles } from './HambugiDashboard.styles';

interface StepDetail {
  id: string;
  title: string;
  content: string;
  status: 'match' | 'mismatch' | 'unchecked';
  actionLink?: string;
  actionText?: string;
}

interface HambugiDashboardProps {
  onClose: () => void;
}

export default function HambugiDashboard({ onClose }: HambugiDashboardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // currentStep에 따라 isActive 동적 설정
  const steps = useMemo(() => [
    { id: 1, title: "기본 정보 확인", isActive: currentStep === 1, isCompleted: true },
    { id: 2, title: "주소 검증", isActive: currentStep === 2, isCompleted: true },
    { id: 3, title: "임대인 확인", isActive: currentStep === 3, isCompleted: false },
    { id: 4, title: "계약서 검토", isActive: currentStep === 4, isCompleted: false },
    { id: 5, title: "보증금 확인", isActive: currentStep === 5, isCompleted: false },
    { id: 6, title: "최종 점검", isActive: currentStep === 6, isCompleted: false },
    { id: 7, title: "완료", isActive: currentStep === 7, isCompleted: false }
  ], [currentStep]);

  const stepDetails: Record<number, { title: string; details: StepDetail[] }> = {
    1: {
      title: "1단계 기본 정보 확인",
      details: [
        {
          id: "1-1",
          title: "개인정보 확인",
          content: "개인정보가 정확하게 입력되었습니다.",
          status: "match"
        }
      ]
    },
    2: {
      title: "2단계 주소 검증",
      details: [
        {
          id: "2-1",
          title: "주소 유효성 검증",
          content: "입력된 주소가 유효합니다.",
          status: "match"
        }
      ]
    },
    3: {
      title: "3-1 가짜 임대인 구분하기",
      details: [
        {
          id: "3-1",
          title: "중개사 자격 확인",
          content: "신흥사부동산중개인사무소의 홍길동 씨는 공인중개사 자격증을 소지하고 있습니다!",
          status: "match"
        },
        {
          id: "3-2",
          title: "최우선변제 금액 안내",
          content: "서울특별시 소액보증금 범위 : 1억 5천만원 이하 최우선변제금액 : 5천만원",
          status: "match"
        },
        {
          id: "3-3",
          title: "공제증서 발급 안내",
          content: "공제증서 발급 요건이 불충족되었습니다.",
          status: "mismatch",
          actionLink: "/online-service",
          actionText: "온라인 서비스로 이동하기"
        }
      ]
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleUserClick = () => {
    // 사용자 정보 페이지로 이동
    console.log('사용자 정보 클릭');
  };

  const handleLogout = () => {
    // 로그아웃 처리
    console.log('로그아웃');
  };

  const handleActionClick = (actionLink: string) => {
    // 액션 링크 처리
    console.log('액션 클릭:', actionLink);
  };

  const currentStepData = stepDetails[currentStep] || {
    title: "단계 정보 없음",
    details: []
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <DashboardHeader onClose={onClose} />
      
      {/* 사용자 정보 */}
      <UserInfo 
        onUserClick={handleUserClick} 
      />
      
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
            stepTitle={currentStepData.title}
            details={currentStepData.details}
            onActionClick={handleActionClick}
          />
        </div>
      </div>
    </div>
  );
}
