'use client';

import React from 'react';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';
import GuideStepItem from '@/(anon)/_components/common/guideStepItem/GuideStepItem';
import GuideStepRow from '@/(anon)/_components/common/guideStepContent/GuideStepRow';
import GuideStepText from '@/(anon)/_components/common/guideStepContent/GuideStepText';
import GuideStepContent from '@/(anon)/_components/common/guideStepContent/GuideStepContent';
import ResultAccordion from './ResultAccordion';
import { styles } from './GuideResultView.styles';
import { STEP_TITLES, STEP_DETAIL_TITLES } from '@libs/constants/stepDetailTitles';

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
      
      {/* 첫 번째 아코디언 위에 CircularIconBadge 3개 - ResultAccordion의 numbers와 정확히 정렬 */}
      <div className={styles.iconBadgeHeader}>
        {/* ResultAccordion의 title 영역과 동일한 구조 - 투명하게 만들어서 안 보이게 */}
        <div className={styles.iconBadgeTitle}>
          <span className={styles.iconBadgeStageNumber}>1단계</span>
          <span className={styles.iconBadgeSubtitle}>집 고를 때</span>
        </div>
        
        {/* numbers 영역에 정확히 정렬 - ResultAccordion과 동일한 구조 */}
        <div className={styles.iconBadgeNumbersContainer}>
          <div className={styles.iconBadgeNumbers}>
            <div className="pointer-events-none">
              <CircularIconBadge type="match" size="xsm" weight="thick" />
            </div>
            <div className="pointer-events-none">
              <CircularIconBadge type="mismatch" size="xsm" weight="thick" />
            </div>
            <div className="pointer-events-none">
              <CircularIconBadge type="unchecked" size="xsm" weight="thick" />
            </div>
          </div>
          
          {/* ResultAccordion의 icon 영역과 동일한 크기로 공간 확보 */}
          <div className={styles.iconBadgeIcon}></div>
        </div>
      </div>
      
      <div className={styles.guideSteps}>
        {Object.entries(groupedSteps).map(([stepNumber, steps]) => {
          const stepIndex = parseInt(stepNumber) - 1;
          const totalMatch = steps.reduce((sum, step) => sum + step.match, 0);
          const totalMismatch = steps.reduce((sum, step) => sum + step.mismatch, 0);
          const totalUnchecked = steps.reduce((sum, step) => sum + step.unchecked, 0);
          const isExpanded = steps.some(step => step.expanded);

          // detail 번호 순으로 정렬
          const sortedSteps = steps.sort((a, b) => a.detail - b.detail);

          return (
            <ResultAccordion
              key={stepNumber}
              stageNumber={`${stepNumber}단계`}
              subtitle={STEP_TITLES[stepIndex]}
              defaultOpen={isExpanded}
              numbers={[totalMatch.toString(), totalMismatch.toString(), totalUnchecked.toString()]}
            >
              <div className={styles.stepContent}>
                {/* 모든 단계를 1단계처럼 통일하여 깔끔하게 표시 */}
                <div>
                  {sortedSteps.map((subStep) => (
                      <GuideStepItem
                       key={subStep.id}
                       stepNumber={`${subStep.stepNumber}-${subStep.detail}`}
                       title={STEP_DETAIL_TITLES[subStep.stepNumber]?.[subStep.detail - 1] || `${STEP_TITLES[stepIndex]} 서브 ${subStep.detail}`}
                       showDivider={false}
                     >
                      <GuideStepContent>
                        {/* 통계 정보 표시 */}
                        <GuideStepRow iconType="match">
                          <GuideStepText>
                            안전 : {subStep.match}개
                          </GuideStepText>
                        </GuideStepRow>
                        
                        <GuideStepRow iconType="mismatch">
                          <GuideStepText>
                            경고: {subStep.mismatch}개
                          </GuideStepText>
                        </GuideStepRow>
                        
                        <GuideStepRow iconType="unchecked">
                          <GuideStepText>
                            미확인: {subStep.unchecked}개
                          </GuideStepText>
                        </GuideStepRow>
                      </GuideStepContent>
                    </GuideStepItem>
                  ))}
                </div>
              </div>
            </ResultAccordion>
          );
        })}
      </div>
    </div>
  );
}
