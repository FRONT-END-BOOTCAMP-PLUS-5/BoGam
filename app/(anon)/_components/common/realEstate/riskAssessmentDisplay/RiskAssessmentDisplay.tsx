'use client';

import React from 'react';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';
import { styles } from './RiskAssessmentDisplay.styles';
import { OriginalDocumentButton } from '@/(anon)/_components/common/realEstate/originalDocumentButton/OriginalDocumentButton';
import { ApiResponse } from '@/(anon)/_components/common/realEstate/types';

interface RiskAssessmentDisplayProps {
  riskAssessment: RiskAssessmentResult;
  displayResponse: ApiResponse | null;
  checklistItems?: Array<{
    id: string;
    label: string;
    checked: boolean;
    description: string;
  }>;
  onChecklistItemChange?: (itemId: string, checked: boolean) => void;
}

export const RiskAssessmentDisplay: React.FC<RiskAssessmentDisplayProps> = ({
  riskAssessment,
  displayResponse,
  checklistItems,
  onChecklistItemChange,
}) => {
  return (
    <div className={styles.riskSection}>
      <div className={styles.headerContainer}>
        <div className={styles.titleContainer}>
          <h3 className={styles.riskTitle}>위험도 확인 결과</h3>
        </div>

        {/* 원문보기 버튼 */}
        {displayResponse ? (
          <OriginalDocumentButton displayResponse={displayResponse} />
        ) : null}
      </div>
      <div className={styles.riskScore}>
        안전도: {riskAssessment.passedKeywords}/{riskAssessment.totalKeywords}{' '}
        통과 (
        {Math.round(
          (riskAssessment.passedKeywords / riskAssessment.totalKeywords) * 100
        )}
        %)
      </div>

      {riskAssessment.riskFactors.length > 0 ||
      (checklistItems && checklistItems.some((item) => !item.checked)) ? (
        <>
          {/* 경고 표시 */}
          <div className={styles.warningContainer}>
            <div className={styles.warningHeader}>
              <span className={styles.warningIcon}>⚠️</span>
              <h4 className={styles.warningTitle}>확인이 필요합니다 !</h4>
            </div>
            <p className={styles.warningText}>
              {riskAssessment.riskFactors.length > 0
                ? `등기부등본에서 ${riskAssessment.riskFactors.length}개의 위험 요소가 발견되었습니다.`
                : '체크리스트에서 확인이 필요한 항목이 있습니다.'}
            </p>
          </div>

          {/* 감지된 단어별 상세 분석 */}
          <div className={styles.riskFactors}>
            <h4 className={styles.riskFactorsTitle}>
              감지된 위험 키워드 상세 분석:
            </h4>

            {/* 모든 감지된 키워드를 수집 */}
            {(() => {
              const allKeywords = new Set<string>();
              riskAssessment.riskFactors.forEach((factor) => {
                factor.foundKeywords.forEach((keyword) =>
                  allKeywords.add(keyword)
                );
              });

              return Array.from(allKeywords).map((keyword, keywordIndex) => {
                // 해당 키워드가 발견된 모든 필드들을 찾기
                const relatedFactors = riskAssessment.riskFactors.filter(
                  (factor) => factor.foundKeywords.includes(keyword)
                );

                return (
                  <div
                    key={keywordIndex}
                    className={styles.keywordAnalysisContainer}
                  >
                    <div className={styles.keywordAnalysisHeader}>
                      <span className={styles.keywordAnalysisIcon}>🔍</span>
                      <h5 className={styles.keywordAnalysisTitle}>
                        감지된 키워드: &ldquo;{keyword}&rdquo;
                      </h5>
                      <span className={styles.keywordAnalysisBadge}>
                        {relatedFactors.length}개 위치에서 발견
                      </span>
                    </div>

                    {/* 해당 키워드가 발견된 각 위치별 상세 정보 */}
                    <div className={styles.keywordAnalysisContent}>
                      {relatedFactors.map((factor, factorIndex) => (
                        <div
                          key={factorIndex}
                          className={styles.keywordDetailItem}
                        >
                          <div className={styles.keywordDetailHeader}>
                            <span className={styles.keywordDetailField}>
                              📍 {factor.fieldName}
                            </span>
                            <span
                              className={`${styles.riskLevelBadge} ${
                                styles[`riskLevelBadge${factor.riskLevel}`]
                              }`}
                            >
                              {factor.riskLevel}
                            </span>
                          </div>
                          <div className={styles.keywordDetailLabel}>
                            <strong>발견된 내용:</strong>
                          </div>
                          <div className={styles.keywordDetailContent}>
                            {factor.fieldValue}
                          </div>
                          <div className={styles.keywordDetailDescription}>
                            <strong>영향도:</strong> {factor.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </>
      ) : (
        <div className={styles.safeContainer}>
          <div className={styles.safeIcon}>✅</div>
          <div className={styles.safeText}>안전합니다!</div>
          <div className={styles.safeSubText}>
            등기부등본에서 위험 요소가 발견되지 않았습니다.
          </div>
        </div>
      )}

      {/* 키워드별 체크 결과 */}
      <div className={styles.keywordChecksSection}>
        <h4 className={styles.keywordChecksTitle}>위험 키워드 체크 결과</h4>
        <div className={styles.keywordChecksGrid}>
          {riskAssessment.keywordChecks
            .sort((a, b) => {
              // 발견된 키워드(passed: false)를 상단에 배치
              if (!a.passed && b.passed) return -1;
              if (a.passed && !b.passed) return 1;
              return 0;
            })
            .map((check, index) => (
              <div
                key={index}
                className={`${styles.keywordCheckItem} ${
                  !check.passed ? styles.keywordClickable : ''
                }`}
                onClick={() => {
                  if (!check.passed) {
                    window.open(
                      `/real-estate-data?keyword=${encodeURIComponent(
                        check.keyword
                      )}`,
                      '_blank'
                    );
                  }
                }}
              >
                <div className={styles.keywordCheckHeader}>
                  <span className={styles.keywordName}>{check.keyword}</span>
                  <span
                    className={`${styles.keywordStatus} ${
                      check.passed ? styles.keywordPassed : styles.keywordFailed
                    }`}
                  >
                    {check.passed ? '✅ 통과' : '❌ 발견'}
                  </span>
                </div>
                {!check.passed && (
                  <div className={styles.keywordFoundCount}>
                    {check.foundCount}회 발견됨
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* 체크리스트 섹션 */}
      {checklistItems && checklistItems.length > 0 && (
        <div className={styles.checklistSection}>
          <h4 className={styles.checklistTitle}>체크리스트 확인</h4>
          <div className={styles.checklistGrid}>
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className={`${styles.checklistItem} ${
                  item.checked
                    ? styles.checklistItemChecked
                    : styles.checklistItemUnchecked
                }`}
                onClick={() => {
                  if (onChecklistItemChange) {
                    onChecklistItemChange(item.id, !item.checked);
                  }
                }}
              >
                <div className={styles.checklistItemHeader}>
                  <div className={styles.checklistItemControls}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type='checkbox'
                        checked={item.checked}
                        onChange={(e) => {
                          console.log(
                            '체크박스 클릭:',
                            item.id,
                            '현재 상태:',
                            item.checked,
                            '새로운 상태:',
                            e.target.checked
                          );
                          if (onChecklistItemChange) {
                            onChecklistItemChange(item.id, e.target.checked);
                          }
                        }}
                        className={styles.checkboxInput}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={styles.checkboxText}>
                        {item.checked ? '✅ 통과' : '❌ 실패'}
                      </span>
                    </label>
                  </div>
                  <span className={styles.checklistItemLabel}>
                    {item.label}
                  </span>
                </div>
                <div className={styles.checklistItemDescription}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
