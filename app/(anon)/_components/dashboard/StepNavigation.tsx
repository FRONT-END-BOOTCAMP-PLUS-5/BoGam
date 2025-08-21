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
  onLogout,
  currentStep
}: StepNavigationProps) {
  const router = useRouter();
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
      
      <button
        onClick={onLogout}
        className={styles.logoutButton}
      >
        로그아웃
      </button>
    </div>
  );
}
