'use client';

import { useState, useEffect } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useStepResultMutations } from '@/hooks/useStepResultMutations';
import { parseStepUrl } from '@utils/stepUrlParser';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import styles from './TaxCertIntro.styles';

interface ChecklistItem {
  id: string;
  label: string;
  defaultValue: 'match' | 'mismatch';
}

interface ContentSection {
  subtitle: string;
  contents: string[];
}

interface TaxCertIntroData {
  contentSections: ContentSection[];
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  checklistItems: ChecklistItem[];
}

interface TaxCertIntroProps {
  data: TaxCertIntroData;
}

export default function TaxCertIntro({ data }: TaxCertIntroProps) {
  const [checklistState, setChecklistState] = useState<
    Record<string, 'match' | 'mismatch'>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  const { selectedAddress } = useUserAddressStore();

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepUrlData = parseStepUrl(pathname);
  const stepNumber = stepUrlData?.stepNumber || 1;
  const detail = stepUrlData?.detail || 5;

  // DB에서 저장된 데이터 가져오기
  const { data: stepResultData } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: stepNumber.toString(),
    detail: detail.toString(),
  });

  const { upsertStepResult } = useStepResultMutations();

  // 초기 체크리스트 상태 설정 (DB 데이터와 매핑) - 한 번만 실행
  useEffect(() => {
    if (data.checklistItems && stepResultData && Object.keys(checklistState).length === 0) {
      const initialState: Record<string, 'match' | 'mismatch'> = {};

      // DB에서 가져온 데이터가 있으면 사용, 없으면 기본값 사용
      const savedData = Array.isArray(stepResultData)
        ? stepResultData[0] && 'jsonDetails' in stepResultData[0]
          ? stepResultData[0].jsonDetails
          : {}
        : stepResultData && 'jsonDetails' in stepResultData
        ? stepResultData.jsonDetails
        : {};

      //console.log('🔍 TaxCertIntro: DB에서 가져온 데이터:', savedData);

      data.checklistItems.forEach((item) => {
        // JSON 파일의 한글 키를 item.id의 영어 키로 매핑
        let jsonKey: string;
        switch (item.id) {
          case 'nameMatch':
            jsonKey = '서류와 임대인의 이름 일치 여부';
            break;
          case 'noUnpaid':
            jsonKey = '미납 내역 없음';
            break;
          default:
            jsonKey = item.id; // 기본값은 원래 id 사용
        }

        // DB에 저장된 값이 있으면 사용, 없으면 기본값 사용
        if (savedData[jsonKey] !== undefined) {
          const savedValue = savedData[jsonKey];
          initialState[item.id] =
            savedValue === 'unchecked' ? 'mismatch' : savedValue;
        } else {
          // 없으면 기본값 사용
          initialState[item.id] = item.defaultValue;
        }
      });

      setChecklistState(initialState);
      // console.log(
      //   '🔍 TaxCertIntro: DB 데이터와 매핑된 최종 초기 상태:',
      //   initialState
      // );
    }
  }, [data.checklistItems, stepResultData]); // checklistState 의존성 제거

  // 체크리스트 상태 변경 핸들러
  const handleChecklistChange = async (
    itemId: string,
    newValue: 'match' | 'mismatch'
  ) => {
    // 저장 중이면 무시
    if (isSaving) {
      console.log('⏳ 저장 중이므로 무시:', itemId);
      return;
    }

    const newState = {
      ...checklistState,
      [itemId]: newValue,
    };
    setChecklistState(newState);
    console.log('✅ 1번째 페이지 체크리스트 상태:', checklistState);
    console.log('✅ 1번째 페이지 체크리스트 상태 변경:', newState);

    // 저장 시작
    setIsSaving(true);

    try {
      // 현재 DB 데이터 가져오기
      const currentDbData = Array.isArray(stepResultData)
        ? stepResultData[0] && 'jsonDetails' in stepResultData[0]
          ? stepResultData[0].jsonDetails
          : {}
        : stepResultData && 'jsonDetails' in stepResultData
        ? stepResultData.jsonDetails
        : {};

      // 변경된 항목만 업데이트
      const updatedDbData = { ...currentDbData };
      const item = data.checklistItems.find((item) => item.id === itemId);
      if (item) {
        // 영어 id를 한글 키로 변환
        let jsonKey: string;
        switch (itemId) {
          case 'nameMatch':
            jsonKey = '서류와 임대인의 이름 일치 여부';
            break;
          case 'noUnpaid':
            jsonKey = '미납 내역 없음';
            break;
          default:
            jsonKey = itemId;
        }
        
        updatedDbData[jsonKey] = newValue;
        console.log(`🔍 TaxCertIntro: ${itemId} -> ${jsonKey}: ${newValue}`);
      }

      // DB에 직접 저장
      if (selectedAddress?.nickname) {
        await upsertStepResult.mutateAsync({
          userAddressNickname: selectedAddress.nickname,
          stepNumber,
          detail,
          jsonDetails: updatedDbData,
        });
        console.log('✅ TaxCertIntro: DB 저장 완료');
      }
    } catch (error) {
      console.error('❌ TaxCertIntro: DB 저장 실패:', error);
    } finally {
      // 저장 완료 후 상태 해제
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 내용 섹션들 */}
      {data.contentSections.map((section, index) => (
        <div key={index} className={styles.contentSection}>
          <h3 className={styles.contentSectionTitle}>
            {section.subtitle}
          </h3>
          <div className={styles.contentSectionContent}>
            {section.contents.map((content, contentIndex) => (
              <p key={contentIndex} className={styles.contentText}>
                {content}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* 예시 이미지 */}
      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>
          <img
            src={data.image.src}
            alt={data.image.alt}
            width={data.image.width}
            height={data.image.height}
            className={styles.image}
          />
        </div>
      </div>

      {/* 체크리스트 */}
      <div className={styles.checklistContainer}>
        <h4 className={styles.checklistTitle}>
          체크리스트 확인사항
        </h4>
        <div className={styles.checklistGrid}>
          {data.checklistItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.checklistItem} ${
                checklistState[item.id] === 'match'
                  ? styles.checklistItemMatch
                  : styles.checklistItemMismatch
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => {
                if (isSaving) return;
                // 현재 상태와 반대로 변경
                const newValue =
                  checklistState[item.id] === 'match' ? 'mismatch' : 'match';
                handleChecklistChange(item.id, newValue);
              }}
            >
              <div className={styles.checklistItemContent}>
                <div className={styles.checklistItemControls}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type='checkbox'
                      checked={checklistState[item.id] === 'match'}
                      disabled={isSaving}
                      onChange={() => {
                        if (isSaving) return;
                        const newValue =
                          checklistState[item.id] === 'match'
                            ? 'mismatch'
                            : 'match';
                        handleChecklistChange(item.id, newValue);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxText}>
                      {checklistState[item.id] === 'match'
                        ? '✅ 통과'
                        : '❌ 실패'}
                    </span>
                  </label>
                </div>
                <span className={styles.checklistItemLabel}>
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
