'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';
import { styles } from './RiskAssessmentDisplay.styles';
import { OriginalDocumentButton } from '@/(anon)/_components/common/realEstate/originalDocumentButton/OriginalDocumentButton';
import { RiskAssessmentSaveButton } from './RiskAssessmentSaveButton';
import { ApiResponse } from '@/(anon)/_components/common/realEstate/types';
import { TaxCertApiResponse } from '@/(anon)/_components/common/taxCert/types';
import {
  RiskAssessmentJsonData,
  isRiskAssessmentModified,
} from '@utils/riskAssessmentUtils';
import { useRiskAssessmentSave } from '@/hooks/useRiskAssessmentSave';
import { useRiskAssessmentStore } from '@libs/stores/riskAssessmentStore';

interface RiskAssessmentDisplayProps {
  riskAssessment: RiskAssessmentResult;
  displayResponse: ApiResponse | TaxCertApiResponse | null;
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
  // onJsonDataChange 제거
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
  // onJsonDataChange, // 제거
}) => {
  const saveRiskAssessmentMutation = useRiskAssessmentSave((data) => {
    // 저장 성공 시 원본 데이터 업데이트
    if (data.success && currentJsonData) {
      setOriginalJsonData(currentJsonData);
      setIsModified(false);
    }
  });

  console.log('displayResponse', displayResponse);
  console.log('riskAssessmentDisplay', riskAssessment);
  console.log('initialJsonData', initialJsonData);

  const { addJsonData, getJsonData } = useRiskAssessmentStore();

  const [currentJsonData, setCurrentJsonData] =
    useState<RiskAssessmentJsonData | null>(null);
  const [originalJsonData, setOriginalJsonData] =
    useState<RiskAssessmentJsonData | null>(null);
  const [isModified, setIsModified] = useState(false);

  // 키워드 상태 관리를 위한 state
  const [keywordStates, setKeywordStates] = useState<
    Record<string, 'unchecked' | 'match' | 'mismatch'>
  >({});

  // 초기화 완료 여부를 추적하는 ref
  const isInitialized = React.useRef(false);

  // 키워드 상태 초기화 (한 번만 실행)
  useEffect(() => {
    if (isInitialized.current) return;

    if (initialJsonData) {
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
    } else {
      // 초기 키워드 상태 설정 (저장된 데이터가 없는 경우)
      const initialKeywordStates: Record<
        string,
        'unchecked' | 'match' | 'mismatch'
      > = {};

      riskAssessment.keywordChecks.forEach((check) => {
        // riskAssessment의 status 값을 그대로 사용
        initialKeywordStates[check.keyword] = check.status;
      });
      setKeywordStates(initialKeywordStates);
    }

    isInitialized.current = true;
  }, [initialJsonData, riskAssessment.keywordChecks]);

  // JSON 데이터 초기화 (checklistItems와 독립적으로 실행)
  useEffect(() => {
    if (initialJsonData) {
      // 기존 currentJsonData가 있으면 유지, 없으면 initialJsonData로 시작
      const baseData = currentJsonData || initialJsonData;

      // 저장된 데이터에서 체크리스트 항목의 'unchecked'를 'mismatch'로 변환
      const processedJsonData = { ...baseData };

      if (checklistItems) {
        checklistItems.forEach((item) => {
          if (processedJsonData[item.label] === 'unchecked') {
            processedJsonData[item.label] = 'mismatch';
          }
        });
      }

      // 누락된 키워드 항목들 추가 (기존 데이터 덮어쓰지 않음)
      riskAssessment.keywordChecks.forEach((check) => {
        if (processedJsonData[check.keyword] === undefined) {
          processedJsonData[check.keyword] = check.status;
        }
      });

      // 누락된 체크리스트 항목들 추가 (기존 데이터 덮어쓰지 않음)
      checklistItems?.forEach((item) => {
        if (processedJsonData[item.label] === undefined) {
          processedJsonData[item.label] = item.checked ? 'match' : 'mismatch';
        }
      });

      setCurrentJsonData(processedJsonData);
      setOriginalJsonData(processedJsonData);

      // 새로고침 후 DB에서 불러온 데이터를 store에 저장
      console.log(
        '🔄 RiskAssessmentDisplay: DB에서 불러온 데이터를 store에 저장:',
        processedJsonData
      );
      addJsonData(processedJsonData);
    } else {
      // currentJsonData를 riskAssessment 데이터로 초기화
      const newJsonData: RiskAssessmentJsonData = {};

      // 키워드 데이터 추가 (모든 키워드 포함)
      riskAssessment.keywordChecks.forEach((check) => {
        newJsonData[check.keyword] = check.status;
      });

      // 체크리스트 데이터 추가 (모든 체크리스트 항목 포함)
      checklistItems?.forEach((item) => {
        if (currentJsonData && currentJsonData[item.label] !== undefined) {
          // 기존 데이터가 있으면 유지
          newJsonData[item.label] = currentJsonData[item.label];
        } else {
          // 기존 데이터가 없으면 새로 생성 (기본값: mismatch)
          newJsonData[item.label] = item.checked ? 'match' : 'mismatch';
        }
      });
      setCurrentJsonData(newJsonData);
      setOriginalJsonData(newJsonData);
    }
  }, [initialJsonData, riskAssessment.keywordChecks, addJsonData]);

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
      addJsonData(initialJsonData as RiskAssessmentJsonData);
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
    if (!stepNumber || !detail || !userAddressNickname) {
      throw new Error('저장에 필요한 데이터가 누락되었습니다.');
    }

    // 기존 데이터를 기반으로 최신 JSON 데이터 생성
    const latestJsonData: RiskAssessmentJsonData = {
      ...(currentJsonData || {}), // 기존 데이터 유지
    };

    // 키워드 상태 추가/업데이트
    riskAssessment.keywordChecks.forEach((check) => {
      const userStatus = keywordStates[check.keyword];
      latestJsonData[check.keyword] = userStatus || check.status;
    });

    // 체크리스트 상태 추가/업데이트
    checklistItems?.forEach((item) => {
      latestJsonData[item.label] = item.checked ? 'match' : 'mismatch';
    });

    // 1. store에 데이터 추가
    addJsonData(latestJsonData);
    console.log('🔍 2번째 페이지에서 store에 데이터 추가:', latestJsonData);

    // 2. 현재 단계의 데이터만 DB에 저장 (기존 데이터 덮어쓰기)
    try {
      const currentJsonData = getJsonData();
      console.log(
        '🔍 RiskAssessmentDisplay: 현재 단계 데이터만 DB에 저장:',
        latestJsonData
      );

      await saveRiskAssessmentMutation.mutateAsync({
        stepNumber,
        detail,
        jsonData: currentJsonData, // store의 전체 데이터가 아닌 현재 단계 데이터만
        domain,
        userAddressNickname,
      });

      console.log('✅ RiskAssessmentDisplay: 현재 단계 데이터 DB 저장 완료');
    } catch (error) {
      console.error('❌ RiskAssessmentDisplay: DB 저장 실패:', error);
    }
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

        setCurrentJsonData(updatedJsonData);
      } else {
        const newStatus = checked ? 'match' : 'mismatch';

        const updatedJsonData: RiskAssessmentJsonData = {
          ...currentJsonData,
          [itemId]: newStatus,
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
