'use client';

import React from 'react';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';
import GuideStepItem from '@/(anon)/_components/common/guideStepItem/GuideStepItem';
import GuideStepRow from '@/(anon)/_components/common/guideStepContent/GuideStepRow';
import GuideStepText from '@/(anon)/_components/common/guideStepContent/GuideStepText';
import GuideStepContent from '@/(anon)/_components/common/guideStepContent/GuideStepContent';
import ResultAccordion from './ResultAccordion';
import { styles } from './GuideResultView.styles';

const STEP_TITLES = [
  '집 고를 때',
  '임대인 확인할 때',
  '계약서 작성할 때',
  '계약한 직후',
  '입주한 이후',
  '계약기간이 끝난 후',
  '이런 상황에 휘말리지 않도록 유의하세요!'
] as const;

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

export interface GuideResultViewProps {
  guideSteps: GuideStepData[];
}

export default function GuideResultView({ guideSteps }: GuideResultViewProps) {
  // stepNumber별로 그룹화
  const groupedSteps = guideSteps.reduce((acc, step) => {
    const stepNumber = step.stepNumber;
    if (!acc[stepNumber]) {
      acc[stepNumber] = [];
    }
    acc[stepNumber].push(step);
    return acc;
  }, {} as Record<number, GuideStepData[]>);

  // 가장 최신 updatedAt 계산
  const latestUpdatedAt = guideSteps.reduce((latest, step) => {
    const stepUpdatedAt = new Date(step.updatedAt);
    const currentLatest = new Date(latest);
    return stepUpdatedAt > currentLatest ? step.updatedAt : latest;
  }, guideSteps[0]?.updatedAt || '');

  return (
    <div className={styles.card}>
      <div className={styles.guideResultHeader}>
        <div className={styles.cardTitle}>가이드 결과 보기</div>
        <div className={styles.lastModified}>최종 수정 일자: {new Date(latestUpdatedAt).toLocaleDateString('ko-KR')}</div>
      </div>
      
      {/* 첫 번째 아코디언 위에 CircularIconBadge 3개 */}
      <div className={styles.iconBadgeContainer}>
        <CircularIconBadge type="match" size="sm" weight="thick" />
        <CircularIconBadge type="mismatch" size="sm" weight="thick" />
        <CircularIconBadge type="unchecked" size="sm" weight="thick" />
      </div>
      
      <div className={styles.guideSteps}>
        {Object.entries(groupedSteps).map(([stepNumber, steps]) => {
          const stepIndex = parseInt(stepNumber) - 1;
          const totalMatch = steps.reduce((sum, step) => sum + step.match, 0);
          const totalMismatch = steps.reduce((sum, step) => sum + step.mismatch, 0);
          const totalUnchecked = steps.reduce((sum, step) => sum + step.unchecked, 0);
          const isExpanded = steps.some(step => step.expanded);

          return (
            <ResultAccordion
              key={stepNumber}
              stageNumber={`${stepNumber}단계`}
              subtitle={STEP_TITLES[stepIndex]}
              defaultOpen={isExpanded}
              numbers={[totalMatch.toString(), totalMismatch.toString(), totalUnchecked.toString()]}
            >
              <div className={styles.stepContent}>
                {parseInt(stepNumber) === 1 ? (
                  // 1단계는 GuideStepItem 컴포넌트들을 사용하여 예쁘게 꾸며주기
                  <div>
                    {steps.map((subStep) => (
                      <GuideStepItem
                        key={subStep.id}
                        stepNumber={`${subStep.stepNumber}-${subStep.detail}`} // stepNumber-detail 형식
                        title={subStep.title || ''} // Ensure title is not undefined
                        showDivider={false}
                      >
                        <GuideStepContent>
                          {subStep.content && ( // Render content if available
                            <GuideStepRow iconType={(subStep.type as 'match' | 'mismatch' | 'unchecked' | 'link') || 'unchecked'}> {/* Cast to supported types */}
                              <GuideStepText>
                                {subStep.content}
                              </GuideStepText>
                            </GuideStepRow>
                          )}
                          {subStep.multiLine && Array.isArray(subStep.details) && ( // Check if details is an array
                            <GuideStepRow iconType={(subStep.type as 'match' | 'mismatch' | 'unchecked' | 'link') || 'unchecked'}>
                              <GuideStepText multiLine> {/* Add multiLine prop to GuideStepText */}
                                {subStep.details.map((detail, index) => (
                                  <p key={index}>{detail}</p>
                                ))}
                              </GuideStepText>
                            </GuideStepRow>
                          )}
                          {subStep.hasLink && subStep.linkHref && subStep.linkText && (
                            <GuideStepRow iconType="link" href={subStep.linkHref}>
                              {subStep.linkText}
                            </GuideStepRow>
                          )}
                        </GuideStepContent>
                      </GuideStepItem>
                    ))}
                  </div>
                ) : (
                  // 나머지 단계는 간단하게
                  <div className={styles.tempStepsContent}>
                    <div className={styles.tempStepsHeader}>
                      <p className={styles.tempStepsDescription}>
                        {STEP_TITLES[stepIndex]} 관련 상세 정보
                      </p>
                    </div>
                    
                    <div className={styles.tempStepsItems}>
                      {steps.map((step) => (
                        <div key={step.id} className={styles.tempStepItem}>
                          <div className={styles.tempStepItemHeader}>
                            <span className={styles.tempStepItemNumber}>
                              서브 {step.detail}
                            </span>
                            <span className={styles.tempStepItemStats}>
                              ✓{step.match} ✗{step.mismatch} ?{step.unchecked}
                            </span>
                          </div>
                          
                          <div className={styles.tempStepItemFooter}>
                            <span className={styles.createdAt}>
                              {new Date(step.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ResultAccordion>
          );
        })}
      </div>
    </div>
  );
}
