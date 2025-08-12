'use client';

import { useState } from 'react';
import StepDetail from './_components/StepDetail';
import styles from './page.module.css';

interface StepNumberPageProps {
  params: Promise<{
    'step-number': string;
  }>;
}

export default function StepNumberPage({ params }: StepNumberPageProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [stepNumber, setStepNumber] = useState<string>('');

  const handleClick = async () => {
    const { 'step-number': step } = await params;
    setStepNumber(step);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>중단계 페이지</h1>
        <button 
          className={styles.clickButton}
          onClick={handleClick}
        >
          클릭하여 상세 보기
        </button>
      </div>
      
      {/* StepDetail 모달 */}
      <StepDetail 
        stepNumber={stepNumber}
        detail="1"
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
