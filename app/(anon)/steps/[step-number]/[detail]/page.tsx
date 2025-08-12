'use client';

import StepDetailCard from './_components/StepDetailCard';
import styles from './stepDetail.module.css';

interface StepDetailPageProps {
  params: {
    'step-number': string;
    detail: string;
  };
}

export default function StepDetailPage({ params }: StepDetailPageProps) {
  const stepNumber = params['step-number'];
  const detail = params.detail;
  
  // 단계별 제목을 반환하는 함수
  function getStepTitle(stepNumber: string): string {
    const stepTitles: Record<string, string> = {
      '1': '부동산 정보 확인할 때',
      '2': '계약 조건 확인할 때',
      '3': '계약서 확인할 때',
      '4': '계약 완료 후',
      '5': '이사 후 정리'
    };
    
    return stepTitles[stepNumber] || '단계별 가이드';
  }

  return (
    <div className={styles.container}>
      {/* Header - 단계 제목만 */}
      <div className={styles.header}>
        <button className={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.titleContainer}>
          <div className={styles.stepNumber}>{stepNumber}단계</div>
          <div className={styles.stepTitle}>{getStepTitle(stepNumber)}</div>
        </div>
      </div>

      {/* StepDetailCard - stepNumber와 detail만 전달 */}
      <StepDetailCard 
        stepNumber={stepNumber}
        detail={detail}
      />
    </div>
  );
