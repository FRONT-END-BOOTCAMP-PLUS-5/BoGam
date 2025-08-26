'use client';

import React from 'react';
import { styles } from './StepDetailContent.styles';
import GuideStepItem from '@/(anon)/_components/common/guideStepItem/GuideStepItem';
import GuideStepContent from '@/(anon)/_components/common/guideStepContent/GuideStepContent';
import GuideStepRow from '@/(anon)/_components/common/guideStepContent/GuideStepRow';
import GuideStepText from '@/(anon)/_components/common/guideStepContent/GuideStepText';
import { STEP_DETAIL_TITLES } from '@libs/constants/stepDetailTitles';

// GuideResultView와 동일한 인터페이스 사용
export interface GuideStepData {
  id: number;
  userAddressId: number;
  stepId: number;
  mismatch: number;
  match: number;
  unchecked: number;
  createdAt: string;
  updatedAt: string;
  stepNumber: number;
  detail: number;
  expanded?: boolean;

  // Fields for GuideStepItem and its content, primarily for stepNumber 1
  title?: string;
  content?: string;
  type?: 'match' | 'mismatch' | 'unchecked' | 'link';
  multiLine?: boolean;
  hasLink?: boolean;
  linkHref?: string;
  linkText?: string;

  // The 'details' field from API can be either an object or an array of strings
  details?: {
    checkItems?: string[];
    [key: string]: string | string[] | undefined;
  } | string[];
}

interface StepDetailContentProps {
  stepTitle: string;
  guideSteps: GuideStepData[];
  onActionClick: (actionLink: string) => void;
  currentStep?: number;
}

export default function StepDetailContent({ guideSteps, onActionClick, currentStep = 1 }: StepDetailContentProps) {
  // currentStep에 해당하는 스텝들만 필터링
  const currentStepData = guideSteps.filter(step => step.stepNumber === currentStep);
  
  // detail 번호 순으로 정렬
  const sortedStepData = currentStepData.sort((a, b) => a.detail - b.detail);

  return (
    <div className={styles.container}>      
      {sortedStepData.map((step, index) => (
        <GuideStepItem 
          key={step.id}
          stepNumber={`${step.stepNumber}-${step.detail}`}
          title={STEP_DETAIL_TITLES[step.stepNumber]?.[step.detail - 1] || `${step.stepNumber}단계 서브 ${step.detail}`}
          showDivider={index < sortedStepData.length - 1}
        >
          <GuideStepContent>
            {/* 통계 정보 표시 (GuideResultView와 동일한 스타일) */}
            <GuideStepRow iconType="match">
              <GuideStepText>
                안전: {step.match}개
              </GuideStepText>
            </GuideStepRow>
            
            <GuideStepRow iconType="mismatch">
              <GuideStepText>
                경고: {step.mismatch}개
              </GuideStepText>
            </GuideStepRow>
            
            <GuideStepRow iconType="unchecked">
              <GuideStepText>
                미확인: {step.unchecked}개
              </GuideStepText>
            </GuideStepRow>
          </GuideStepContent>
        </GuideStepItem>
      ))}
    </div>
  );
}
