'use client';

import React from 'react';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
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
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div 
          className={styles.matchBar} 
          style={{ width: `${matchWidth}%` }}
        />
        <div 
          className={styles.mismatchBar} 
          style={{ width: `${mismatchWidth}%` }}
        />
        <div 
          className={styles.uncheckedBar} 
          style={{ width: `${uncheckedWidth}%` }}
        />
      </div>
    </div>
  );
}
