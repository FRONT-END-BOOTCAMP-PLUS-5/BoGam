'use client';

import React from 'react';
import { useGetStepResult } from '@/hooks/useStepResultQueries';

interface ProgressBarChartProps {
  stepNumber: string;
  userAddressNickname: string;
  initialData?: {
    checked: number;
    unchecked: number;
    mismatch: number;
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
  const checked = (stepData as { summary: { totalMatch: number; totalUnchecked: number; totalMismatch: number } })?.summary?.totalMatch ?? initialData?.checked ?? 0;
  const unchecked = (stepData as { summary: { totalMatch: number; totalUnchecked: number; totalMismatch: number } })?.summary?.totalUnchecked ?? initialData?.unchecked ?? 0;
  const mismatch = (stepData as { summary: { totalMatch: number; totalUnchecked: number; totalMismatch: number } })?.summary?.totalMismatch ?? initialData?.mismatch ?? 0;

  const total = checked + mismatch + unchecked;
  
  const checkedWidth = total > 0 ? (checked / total) * 100 : 0;
  const mismatchWidth = total > 0 ? (mismatch / total) * 100 : 0;
  const uncheckedWidth = total > 0 ? (unchecked / total) * 100 : 100;

  return (
    <div className="w-full h-4 bg-brand-light-gray rounded-full overflow-hidden">
      <div className="h-full flex">
        <div 
          className="bg-brand-green" 
          style={{ width: `${checkedWidth}%` }}
        />
        <div 
          className="bg-brand-error" 
          style={{ width: `${mismatchWidth}%` }}
        />
        <div 
          className="bg-brand-light-gray" 
          style={{ width: `${uncheckedWidth}%` }}
        />
      </div>
    </div>
  );
}
