'use client';

import React from 'react';
import { styles } from './StateIcon.styles';
import StateIconItem from './StateIconItem';
import { useGetStepResult } from '@/hooks/useStepResultQueries';

interface StateIconProps {
  stepNumber: string;
  userAddressNickname: string;
  initialData?: {
    checked: number;
    unchecked: number;
    mismatch: number;
  };
}

export default function StateIcon({ stepNumber, userAddressNickname, initialData }: StateIconProps) {
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

  return (
    <div className={styles.container}>
      <StateIconItem type='completed' count={checked} />
      <StateIconItem type='warning' count={mismatch} />
      <StateIconItem type='unconfirmed' count={unchecked} />
    </div>
  );
}
