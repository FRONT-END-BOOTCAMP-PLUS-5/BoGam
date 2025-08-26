'use client';

import React from 'react';
import { styles } from './StepDetailContent.styles';
import GuideStepItem from '@/(anon)/_components/common/guideStepItem/GuideStepItem';
import GuideStepContent from '@/(anon)/_components/common/guideStepContent/GuideStepContent';
import GuideStepRow from '@/(anon)/_components/common/guideStepContent/GuideStepRow';
import GuideStepText from '@/(anon)/_components/common/guideStepContent/GuideStepText';
import { STEP_DETAIL_TITLES } from '@libs/constants/stepDetailTitles';

interface StepDetail {
  id: string;
  title: string;
  content: string;
  status: 'match' | 'mismatch' | 'unchecked';
  actionLink?: string;
  actionText?: string;
  stepNumber?: number;
  detail?: number;
}

interface StepDetailContentProps {
  stepTitle: string;
  details: StepDetail[];
  onActionClick: (actionLink: string) => void;
  currentStep?: number;
}

export default function StepDetailContent({ details, onActionClick, currentStep = 1 }: StepDetailContentProps) {
  return (
    <div className={styles.container}>      
      {details.map((detail, index) => (
        <GuideStepItem 
          key={detail.id}
          stepNumber={`${currentStep}-${index + 1}`}
          title={STEP_DETAIL_TITLES[currentStep]?.[index] || detail.title}
          showDivider={index < details.length - 1}
        >
          <GuideStepContent>

            
            {/* 통계 정보 표시 (마이페이지와 동일한 스타일) */}
            <GuideStepRow iconType="match">
              <GuideStepText>
                안전: {detail.status === 'match' ? '1' : '0'}개
              </GuideStepText>
            </GuideStepRow>
            
            <GuideStepRow iconType="mismatch">
              <GuideStepText>
                경고: {detail.status === 'mismatch' ? '1' : '0'}개
              </GuideStepText>
            </GuideStepRow>
            
            <GuideStepRow iconType="unchecked">
              <GuideStepText>
                미확인: {detail.status === 'unchecked' ? '1' : '0'}개
              </GuideStepText>
            </GuideStepRow>
          </GuideStepContent>
        </GuideStepItem>
      ))}
    </div>
  );
}
