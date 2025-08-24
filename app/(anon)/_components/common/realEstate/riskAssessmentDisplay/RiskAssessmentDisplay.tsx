'use client';

import React, { useState, useEffect } from 'react';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';
import { styles } from './RiskAssessmentDisplay.styles';
import { OriginalDocumentButton } from '@/(anon)/_components/common/realEstate/originalDocumentButton/OriginalDocumentButton';
import { RiskAssessmentSaveButton } from './RiskAssessmentSaveButton';
import { ApiResponse } from '@/(anon)/_components/common/realEstate/types';
import {
  RiskAssessmentJsonData,
  convertRealEstateRiskAssessmentToJson,
  convertBrokerRiskAssessmentToJson,
  convertTaxCertRiskAssessmentToJson,
  isRiskAssessmentModified,
} from '@utils/riskAssessmentUtils';
import { useRiskAssessmentSave } from '@/hooks/useRiskAssessmentSave';
import { BrokerRiskAssessmentResult } from '@/hooks/useBrokerRiskAssessment';
import { TaxCertRiskAssessmentResult } from '@/hooks/useTaxCertRiskAssessment';

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
  stepNumber?: number;
  detail?: number;
  userAddressNickname?: string;
  domain?: 'realEstate' | 'broker' | 'taxCert';
  initialJsonData?: RiskAssessmentJsonData;
  showSaveButton?: boolean;
}

export const RiskAssessmentDisplay: React.FC<RiskAssessmentDisplayProps> = ({
  riskAssessment,
  displayResponse,
  checklistItems,
  onChecklistItemChange,
  stepNumber,
  detail,
  userAddressNickname,
  domain = 'realEstate',
  initialJsonData,
  showSaveButton = true,
}) => {
  const saveRiskAssessmentMutation = useRiskAssessmentSave((data) => {
    // 저장 성공 시 원본 데이터 업데이트
    if (data.success && currentJsonData) {
      setOriginalJsonData(currentJsonData);
      setIsModified(false);
    }
  });
  const [currentJsonData, setCurrentJsonData] =
    useState<RiskAssessmentJsonData | null>(null);
  const [originalJsonData, setOriginalJsonData] =
    useState<RiskAssessmentJsonData | null>(null);
  const [isModified, setIsModified] = useState(false);

  // 초기 JSON 데이터 설정
  useEffect(() => {
    if (initialJsonData) {
      setCurrentJsonData(initialJsonData);
      setOriginalJsonData(initialJsonData);
    } else {
      // 새로운 위험도 검사 결과를 JSON으로 변환
      let newJsonData: RiskAssessmentJsonData;

      switch (domain) {
        case 'realEstate':
          newJsonData = convertRealEstateRiskAssessmentToJson(riskAssessment);
          break;
        case 'broker':
          newJsonData = convertBrokerRiskAssessmentToJson(
            riskAssessment as unknown as BrokerRiskAssessmentResult
          );
          break;
        case 'taxCert':
          newJsonData = convertTaxCertRiskAssessmentToJson(
            riskAssessment as unknown as TaxCertRiskAssessmentResult
          );
          break;
        default:
          newJsonData = convertRealEstateRiskAssessmentToJson(riskAssessment);
      }

      setCurrentJsonData(newJsonData);
      setOriginalJsonData(newJsonData);
    }
  }, [riskAssessment, initialJsonData]);

  // 수정 여부 확인
  useEffect(() => {
    if (currentJsonData && originalJsonData) {
      const modified = isRiskAssessmentModified(
        originalJsonData,
        currentJsonData
      );
      setIsModified(modified);
    }
  }, [currentJsonData, originalJsonData]);

  // 저장 핸들러
  const handleSave = async () => {
    if (!currentJsonData || !stepNumber || !detail || !userAddressNickname) {
      throw new Error('저장에 필요한 데이터가 누락되었습니다.');
    }

    saveRiskAssessmentMutation.mutate({
      stepNumber,
      detail,
      jsonData: currentJsonData,
      domain,
      userAddressNickname,
    });
  };

  // 체크리스트 항목 변경 핸들러 (납세증명서용)
  const handleChecklistItemChange = (itemId: string, checked: boolean) => {
    if (onChecklistItemChange) {
      onChecklistItemChange(itemId, checked);
    }

    // JSON 데이터도 함께 업데이트
    if (currentJsonData) {
      const checklistItem = checklistItems?.find((item) => item.id === itemId);
      if (checklistItem) {
        const updatedJsonData: RiskAssessmentJsonData = {
          ...currentJsonData,
          [checklistItem.label]: checked ? 'match' : 'mismatch',
        };
        setCurrentJsonData(updatedJsonData);
      }
    }
  };
  return (
    <div className={styles.riskSection}>
      <div className={styles.headerContainer}>
        <div className={styles.titleContainer}>
          <h3 className={styles.riskTitle}>위험도 확인 결과</h3>
        </div>

        {/* 원문보기 버튼과 저장 버튼 */}
        <div className={styles.buttonContainer}>
          {displayResponse ? (
            <OriginalDocumentButton displayResponse={displayResponse} />
          ) : null}
          {showSaveButton && stepNumber && detail && userAddressNickname && (
            <RiskAssessmentSaveButton
              isEnabled={
                (isModified || showSaveButton) &&
                (riskAssessment.keywordChecks.length > 0 ||
                  (checklistItems ? checklistItems.length > 0 : false))
              }
              onSave={handleSave}
              disabled={saveRiskAssessmentMutation.isPending}
            />
          )}
        </div>
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
                  handleChecklistItemChange(item.id, !item.checked);
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
