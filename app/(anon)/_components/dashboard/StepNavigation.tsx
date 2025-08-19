'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { styles } from './StepNavigation.styles';

interface StepNavigationProps {
  steps: Array<{
    id: number;
    title: string;
    isActive: boolean;
    isCompleted: boolean;
  }>;
  onStepClick: (stepId: number) => void;
  onLogout: () => void;
  currentStep: number;
}

export default function StepNavigation({ 
  steps, 
  onStepClick, 
  currentStep
}: StepNavigationProps) {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      // TODO: 실제 로그아웃 API 호출
      // const response = await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   credentials: 'include'
      // });
      
      // if (response.ok) {
      //   // 로그아웃 성공 처리
      //   console.log('로그아웃 성공');
      // }
      
      // 로그아웃 처리 후 홈페이지로 이동
      console.log('로그아웃 처리 후 홈페이지로 이동');
      router.push('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      // 오류가 발생해도 홈페이지로 이동
      router.push('/');
    }
  };
  return (
    <div className={styles.container}>
      {/* 단계 목록 */}
      <div className={styles.stepsList}>
        {steps.map((step) => {
          console.log(`Step ${step.id}: isActive=${step.isActive}, isCompleted=${step.isCompleted}`);
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className={`${styles.stepItem} ${
                step.id === currentStep ? styles.activeStep : ''
              } ${step.isCompleted ? styles.completedStep : ''}`}
            >
              <span className={styles.stepNumber}>{step.id}단계</span>
            </button>
          );
        })}
      </div>
      
      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className={styles.logoutButton}
      >
        로그아웃
      </button>
    </div>
  );
}
