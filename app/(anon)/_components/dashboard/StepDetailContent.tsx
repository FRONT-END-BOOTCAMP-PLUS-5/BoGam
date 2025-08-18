'use client';

import React from 'react';
import { styles } from './StepDetailContent.styles';
import GuideStepItem from '@/(anon)/_components/common/guideStepItem/GuideStepItem';
import GuideStepContent from '@/(anon)/_components/common/guideStepContent/GuideStepContent';
import GuideStepRow from '@/(anon)/_components/common/guideStepContent/GuideStepRow';
import GuideStepText from '@/(anon)/_components/common/guideStepContent/GuideStepText';

interface StepDetail {
  id: string;
  title: string;
  content: string;
  status: 'success' | 'warning' | 'error';
  actionLink?: string;
  actionText?: string;
}

interface StepDetailContentProps {
  stepTitle: string;
  details: StepDetail[];
  onActionClick: (actionLink: string) => void;
}

export default function StepDetailContent({ details, onActionClick }: StepDetailContentProps) {
  const getIconType = (status: string) => {
    switch (status) {
      case 'success':
        return 'match';
      case 'warning':
        return 'mismatch';
      case 'error':
        return 'mismatch';
      default:
        return 'unchecked';
    }
  };

  return (
    <div className={styles.container}>      
      {details.map((detail, index) => (
        <GuideStepItem 
          key={detail.id}
          stepNumber={String(index + 1)}
          title={detail.title}
          showDivider={index < details.length - 1}
        >
          <GuideStepContent>
            <GuideStepRow iconType={getIconType(detail.status)}>
              <GuideStepText multiLine={detail.content.length > 50}>
                {detail.content}
              </GuideStepText>
            </GuideStepRow>
            
            {detail.actionLink && detail.actionText && (
              <GuideStepRow 
                iconType="link" 
                href={detail.actionLink}
                onClick={() => onActionClick(detail.actionLink!)}
              >
                {detail.actionText}
              </GuideStepRow>
            )}
          </GuideStepContent>
        </GuideStepItem>
      ))}
    </div>
  );
}
