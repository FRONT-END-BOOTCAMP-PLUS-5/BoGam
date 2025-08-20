'use client';

import React from 'react';
import styles from './TextOnly.styles';
import { useGetStepDetail } from '@/(anon)/@detail/steps/[step-number]/[detail]/hooks/useGetStepDetail';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';

interface ContentSection {
  title?: string;
  subtitle?: string;
  contents?: string[];
  summary?: string;
}

interface TextOnlyProps {
  data: ContentSection[];
}

const TextOnly = ({ data }: TextOnlyProps) => {
  // URL에서 stepNumber와 detail 가져오기 (3번째, 4번째 값)
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/');
  const stepNumber = pathParts[2]; // /steps/4/2 에서 4 (3번째)
  const detail = pathParts[3];     // /steps/4/2 에서 2 (4번째)
  
  // useGetStepDetail 훅 사용
  const { data: stepData, isLoading, isError } = useGetStepDetail({
    stepNumber,
    detail
  });

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError || !stepData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  // stepData 표시 함수 - details의 값들을 CircularIconBadge로 표시
  const renderStepData = () => (
    <div className={styles.stepDataSection}>
      <div className={styles.stepDataTitle}>스텝 데이터</div>
      <div>
        <div className={styles.badgeContainer}>
          {Object.values(stepData.details).map((value, index) => (
            <CircularIconBadge key={index} type={value as 'match' | 'mismatch' | 'unchecked'} size="xsm" />
          ))}
        </div>
      </div>
    </div>
  );

  // data가 배열인 경우만 처리
  if (Array.isArray(data) && data.length > 0) {
    return (
      <div className={styles.container}>
        {data.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.section}>
            {section.title && (
              <div className={styles.sectionTitle}>{section.title}</div>
            )}
            {section.subtitle && (
              <div className={styles.sectionSubtitle}>{section.subtitle}</div>
            )}
            {section.contents && (
              <div className={styles.contents}>
                {section.contents.map((content: string, contentIndex: number) => (
                  <p key={contentIndex} className={styles.contentItem}>
                    {content}
                  </p>
                ))}
              </div>
            )}
            {section.summary && (
              <div className={styles.summary}>{section.summary}</div>
            )}
          </div>
        ))}
        
        {renderStepData()}
      </div>
    );
  }

  // data가 없는 경우
  return (
    <div className={styles.container}>
      <div className={styles.noDataContainer}>
        데이터가 없습니다.
      </div>
      
      {renderStepData()}
    </div>
  );
};

export default TextOnly;
