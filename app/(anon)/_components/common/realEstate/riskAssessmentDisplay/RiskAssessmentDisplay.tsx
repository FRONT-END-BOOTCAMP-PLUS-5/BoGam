'use client';

import React, { useState, useEffect } from 'react';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';
import { styles } from './RiskAssessmentDisplay.styles';
import { OriginalDocumentButton } from '@/(anon)/_components/common/realEstate/originalDocumentButton/OriginalDocumentButton';
import { RiskAssessmentSaveButton } from './RiskAssessmentSaveButton';
import { ApiResponse } from '@/(anon)/_components/common/realEstate/types';
import {
  RiskAssessmentJsonData,
  isRiskAssessmentModified,
} from '@utils/riskAssessmentUtils';
import { useRiskAssessmentSave } from '@/hooks/useRiskAssessmentSave';

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

  // 키워드 상태 관리를 위한 state
  const [keywordStates, setKeywordStates] = useState<
    Record<string, 'unchecked' | 'match' | 'mismatch'>
  >({});

  // 초기 JSON 데이터 설정
  useEffect(() => {
    console.log(
      '🔍 useEffect 실행 - initialJsonData:',
      !!initialJsonData,
      'checklistItems:',
      checklistItems?.length
    );

    if (initialJsonData) {
      // 저장된 데이터에서 체크리스트 항목의 'unchecked'를 'mismatch'로 변환
      const processedJsonData = { ...initialJsonData };

      if (checklistItems) {
        checklistItems.forEach((item) => {
          if (processedJsonData[item.label] === 'unchecked') {
            processedJsonData[item.label] = 'mismatch';
          }
        });
      }

      // 기존 currentJsonData가 있으면 사용자 변경사항 보존
      if (currentJsonData) {
        Object.keys(currentJsonData).forEach((key) => {
          if (processedJsonData[key] !== undefined) {
            // 사용자가 변경한 데이터는 보존
            processedJsonData[key] = currentJsonData[key];
          }
        });
      }

      console.log(
        '🔍 초기 JSON 데이터 설정 (저장된 데이터 + 사용자 변경사항):',
        processedJsonData
      );
      setCurrentJsonData(processedJsonData);
      setOriginalJsonData(processedJsonData);

      // 저장된 데이터에서 키워드 상태 복원
      const savedKeywordStates: Record<
        string,
        'unchecked' | 'match' | 'mismatch'
      > = {};
      riskAssessment.keywordChecks.forEach((check) => {
        const savedStatus = initialJsonData[check.keyword];
        if (
          savedStatus === 'match' ||
          savedStatus === 'unchecked' ||
          savedStatus === 'mismatch'
        ) {
          savedKeywordStates[check.keyword] = savedStatus;
        } else {
          // 저장된 데이터가 없으면 riskAssessment의 status 값 사용
          savedKeywordStates[check.keyword] = check.status;
        }
      });
      setKeywordStates(savedKeywordStates);

      // 체크리스트 상태 복원은 별도 useEffect에서 처리
    } else {
      // 초기 키워드 상태 설정 (저장된 데이터가 없는 경우)
      const initialKeywordStates: Record<
        string,
        'unchecked' | 'match' | 'mismatch'
      > = {};

      // currentJsonData를 riskAssessment 데이터로 초기화
      const newJsonData: RiskAssessmentJsonData = {};

      // 키워드 데이터 추가
      riskAssessment.keywordChecks.forEach((check) => {
        // riskAssessment의 status 값을 그대로 사용
        initialKeywordStates[check.keyword] = check.status;
        newJsonData[check.keyword] = check.status;
      });

      // 체크리스트 데이터 추가 (기존 데이터가 있으면 유지, 없으면 새로 생성)
      checklistItems?.forEach((item) => {
        if (currentJsonData && currentJsonData[item.label] !== undefined) {
          // 기존 데이터가 있으면 유지
          newJsonData[item.label] = currentJsonData[item.label];
        } else {
          // 기존 데이터가 없으면 새로 생성
          newJsonData[item.label] = item.checked ? 'match' : 'mismatch';
        }
      });

      console.log('🔍 초기 JSON 데이터 설정 (새로 생성):', newJsonData);
      setKeywordStates(initialKeywordStates);
      setCurrentJsonData(newJsonData);
      setOriginalJsonData(newJsonData);
    }
  }, [initialJsonData, riskAssessment.keywordChecks, checklistItems]);

  // 체크리스트 상태 복원 (별도 useEffect로 무한 루프 방지)
  useEffect(() => {
    if (initialJsonData && onChecklistItemChange && checklistItems) {
      const hasRestoredData = Object.keys(initialJsonData).some((key) =>
        checklistItems.some((item) => item.label === key)
      );

      if (hasRestoredData) {
        checklistItems.forEach((item) => {
          const savedStatus = initialJsonData[item.label];
          if (
            savedStatus === 'match' ||
            savedStatus === 'mismatch' ||
            savedStatus === 'unchecked'
          ) {
            const isChecked = savedStatus === 'match';
            // 현재 상태와 다를 때만 업데이트
            if (item.checked !== isChecked) {
              onChecklistItemChange(item.id, isChecked);
            }
          }
        });
      }
    }
  }, [initialJsonData]); // initialJsonData만 의존성으로 설정

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

  // 키워드 상태 변경 핸들러
  const handleKeywordStateChange = (
    keyword: string,
    newStatus: 'unchecked' | 'match' | 'mismatch'
  ) => {
    setKeywordStates((prev) => ({
      ...prev,
      [keyword]: newStatus,
    }));

    // JSON 데이터도 함께 업데이트 (저장을 위해)
    if (currentJsonData) {
      const updatedJsonData: RiskAssessmentJsonData = {
        ...currentJsonData,
        [keyword]: newStatus,
      };
      setCurrentJsonData(updatedJsonData);
    }
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!currentJsonData || !stepNumber || !detail || !userAddressNickname) {
      throw new Error('저장에 필요한 데이터가 누락되었습니다.');
    }

    console.log('🔍 저장할 JSON 데이터:', currentJsonData);

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
      const checklistItem = checklistItems?.find(
        (item) => item.id === itemId
      ) || {
        label: '',
        id: '',
        checked: false,
        description: '',
      };
      if (checklistItem) {
        const newStatus = checked ? 'match' : 'mismatch';

        const updatedJsonData: RiskAssessmentJsonData = {
          ...currentJsonData,
          [checklistItem.label]: newStatus,
        };
        console.log(
          '🔍 체크리스트 변경:',
          itemId,
          checked,
          '→',
          checklistItem.label,
          newStatus
        );
        console.log('🔍 업데이트된 JSON 데이터:', updatedJsonData);
        setCurrentJsonData(updatedJsonData);
      } else {
        const newStatus = checked ? 'match' : 'mismatch';

        const updatedJsonData: RiskAssessmentJsonData = {
          ...currentJsonData,
          [itemId]: newStatus,
        };
        console.log(
          '🔍 체크리스트 변경 (fallback):',
          itemId,
          checked,
          '→',
          itemId,
          newStatus
        );
        console.log('🔍 업데이트된 JSON 데이터 (fallback):', updatedJsonData);
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
      {(() => {
        // 키워드 통과 개수 계산 (match 상태만 통과)
        const passedKeywords = riskAssessment.keywordChecks.reduce(
          (count, check) => {
            const userStatus = keywordStates[check.keyword];
            const isPassed = userStatus === 'match';
            return count + (isPassed ? 1 : 0);
          },
          0
        );

        // 체크리스트 통과 개수 계산 (checked 상태만 통과)
        const passedChecklistItems = checklistItems
          ? checklistItems.filter((item) => item.checked).length
          : 0;

        // 전체 통과 개수
        const totalPassed = passedKeywords + passedChecklistItems;

        const totalKeywords = riskAssessment.totalKeywords;
        const totalChecklistItems = checklistItems ? checklistItems.length : 0;
        const totalItems = totalKeywords + totalChecklistItems;
        const percentage = Math.round((totalPassed / totalItems) * 100);

        return (
          <>
            <div className={styles.riskScore}>
              안전도: {totalPassed}/{totalItems} 통과 ({percentage}%)
            </div>

            {percentage < 100 ? (
              <>
                {/* 경고 표시 */}
                <div className={styles.warningContainer}>
                  <div className={styles.warningIcon}>⚠️</div>
                  <div className={styles.warningText}>확인이 필요합니다 !</div>
                  <div className={styles.warningSubText}>
                    확인이 필요한 항목이 있습니다.
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.safeContainer}>
                <div className={styles.safeIcon}>✅</div>
                <div className={styles.safeText}>모두 확인 되었습니다 !</div>
                <div className={styles.safeSubText}>
                  위험 요소가 발견 되지 않았습니다.
                </div>
              </div>
            )}
          </>
        );
      })()}

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
            .map((check, index) => {
              // 키워드 상태 결정 - keywordStates에서 직접 가져오기
              const userStatus = keywordStates[check.keyword];
              const isPassed = userStatus === 'match';
              const isUnchecked = userStatus === 'unchecked';

              return (
                <div
                  key={index}
                  className={`${
                    isPassed
                      ? styles.keywordCheckItemChecked
                      : styles.keywordCheckItemUnchecked
                  } ${styles.keywordClickable}`}
                  onClick={() => {
                    // 통과 상태의 키워드는 클릭해도 변경되지 않음
                    if (userStatus === 'match') {
                      return;
                    }

                    // 미확인 상태만 통과로 변경
                    if (userStatus === 'unchecked') {
                      handleKeywordStateChange(check.keyword, 'match');
                    }
                  }}
                >
                  <div className={styles.keywordCheckHeader}>
                    <span className={styles.keywordName}>{check.keyword}</span>
                    <span
                      className={`${styles.keywordStatus} ${
                        isPassed ? styles.keywordPassed : styles.keywordFailed
                      }`}
                    >
                      {isUnchecked ? '🔍 미확인' : '✅ 통과'}
                    </span>
                  </div>
                </div>
              );
            })}
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
                  // 통과된 항목은 클릭해도 변경되지 않음
                  if (item.checked) {
                    return;
                  }
                  // 미통과 항목만 통과로 변경
                  handleChecklistItemChange(item.id, true);
                }}
              >
                <div className={styles.checklistItemHeader}>
                  <div className={styles.checklistItemControls}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type='checkbox'
                        checked={item.checked}
                        onChange={(e) => {
                          // 통과된 항목은 체크박스를 클릭해도 변경되지 않음
                          if (item.checked) {
                            return;
                          }

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
