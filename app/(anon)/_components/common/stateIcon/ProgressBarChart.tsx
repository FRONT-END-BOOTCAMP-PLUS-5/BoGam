'use client';

import React from 'react';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { Check, X, TriangleAlert } from 'lucide-react';
import { styles } from './ProgressBarChart.styles';

interface ProgressBarChartProps {
  stepNumber: string;
  userAddressNickname: string;
  initialData?: {
    match: number;
    mismatch: number;
    unchecked: number;
  };
}

export default function ProgressBarChart({ stepNumber, userAddressNickname, initialData }: ProgressBarChartProps) {
  // stepResults 데이터 가져오기
  const { data: stepData, isLoading } = useGetStepResult({
    userAddressNickname,
    stepNumber,
    detail: '',
  });

  // 초기 데이터가 있으면 사용하고, 없으면 CSR 데이터 사용
  const match = (stepData as { summary: { totalMatch: number; totalUnchecked: number; totalMismatch: number } })?.summary?.totalMatch ?? initialData?.match ?? 0;
  const mismatch = (stepData as { summary: { totalMatch: number; totalUnchecked: number; totalMismatch: number } })?.summary?.totalMismatch ?? initialData?.mismatch ?? 0;
  const unchecked = (stepData as { summary: { totalMatch: number; totalUnchecked: number; totalMismatch: number } })?.summary?.totalUnchecked ?? initialData?.unchecked ?? 0;

  const total = match + mismatch + unchecked;
  
  const matchWidth = total > 0 ? (match / total) * 100 : 0;
  const mismatchWidth = total > 0 ? (mismatch / total) * 100 : 0;
  const uncheckedWidth = total > 0 ? (unchecked / total) * 100 : 100;

  return (
    <div className={styles.cardContainer}>
      {/* 제목 */}
      <div className={styles.titleArea}>
        <h3 className={styles.title}>
          {stepNumber}단계 <span className={styles.subtitle}>가이드 진행률</span>
        </h3>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div className={styles.mainContainer}>
        {/* Progress Bar와 퍼센트 */}
        <div className={styles.progressArea}>
          <div className={styles.progressContainer}>
            <div className={styles.innerContainer}>
              {matchWidth > 0 && (
                <div 
                  className={matchWidth === 100 ? 'bg-[#3E92F9]' : styles.matchBar}
                  style={{ width: `${matchWidth}%` }}
                />
              )}
              {mismatchWidth > 0 && (
                <div 
                  className={styles.mismatchBar}
                  style={{ width: `${mismatchWidth}%` }}
                />
              )}
              {uncheckedWidth > 0 && (
                <div 
                  className={styles.uncheckedBar}
                  style={{ width: `${uncheckedWidth}%` }}
                />
              )}
            </div>
          </div>
          
          {/* 퍼센트 표시 - 확인한 데이터만, 바의 해당 위치 위에 */}
          <div 
            className={styles.percentageText}
            style={{ left: `${matchWidth + mismatchWidth}%` }}
          >
            {Math.round(matchWidth + mismatchWidth)}%
          </div>
        </div>
        
        {/* 오른쪽 텍스트 영역 */}
        <div className={styles.textArea}>
          <div className={styles.textItem}>
            <div className={styles.iconContainer}>
              <Check size={16} strokeWidth={2} />
            </div>
            <span className={styles.matchText}>안전 {match}개</span>
          </div>
          <div className={styles.textItem}>
            <div className={styles.iconContainer}>
              <TriangleAlert size={16} strokeWidth={2} />
            </div>
            <span className={styles.mismatchText}>경고 {mismatch}개</span>
          </div>
          <div className={styles.textItem}>
            <div className={styles.iconContainer}>
              <X size={16} strokeWidth={2} />
            </div>
            <span className={styles.uncheckedText}>미확인 {unchecked}개</span>
          </div>
        </div>
      </div>
    </div>
  );
}
