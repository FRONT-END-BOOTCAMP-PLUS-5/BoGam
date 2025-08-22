'use client';

import React from 'react';
import { styles } from './LoadingOverlay.styles';

interface LoadingOverlayProps {
  isVisible: boolean;
  title: string;
  currentStep: number;
  totalSteps?: number;
}

export default function LoadingOverlay({
  isVisible,
  title,
  currentStep,
  totalSteps = 7
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className="mb-6">
          <div className={styles.spinner}></div>
          <h2 className={styles.title}>{title}</h2>
          
          {/* 진행률 바 */}
          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBar}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* 진행률 텍스트 */}
          <p className={styles.progressText}>
            {currentStep}/{totalSteps} 완료
          </p>
        </div>
      </div>
    </div>
  );
}
