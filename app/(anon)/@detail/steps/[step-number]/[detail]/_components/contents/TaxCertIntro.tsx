'use client';

import { useState, useEffect } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useRiskAssessmentSave } from '@/hooks/useRiskAssessmentSave';
import { parseStepUrl } from '@utils/stepUrlParser';
import { RiskAssessmentJsonData } from '@utils/riskAssessmentUtils';
import { useRiskAssessmentStore } from '@libs/stores/riskAssessmentStore';
import { useGetStepResult } from '@/hooks/useStepResultQueries';

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

  const { selectedAddress } = useUserAddressStore();
  const { addJsonData, getJsonData } = useRiskAssessmentStore();

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

  const saveRiskAssessmentMutation = useRiskAssessmentSave((data) => {
    if (data.success) {
      console.log('✅ TaxCertIntro 체크리스트 데이터 저장 완료');
    }
  });

  // 초기 체크리스트 상태 설정 (DB 데이터와 매핑)
  useEffect(() => {
    if (data.checklistItems && stepResultData) {
      const initialState: Record<string, 'match' | 'mismatch'> = {};

      // DB에서 가져온 데이터가 있으면 사용, 없으면 기본값 사용
      const savedData = Array.isArray(stepResultData)
        ? stepResultData[0] && 'jsonDetails' in stepResultData[0]
          ? stepResultData[0].jsonDetails
          : {}
        : stepResultData && 'jsonDetails' in stepResultData
        ? stepResultData.jsonDetails
        : {};

      console.log('🔍 TaxCertIntro: DB에서 가져온 데이터:', savedData);

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

        console.log(`🔍 TaxCertIntro: ${item.id} -> JSON 키: ${jsonKey}`);

        // DB에 저장된 값이 있으면 사용, 없으면 기본값 사용
        if (savedData[jsonKey] !== undefined) {
          const savedValue = savedData[jsonKey];
          initialState[item.id] =
            savedValue === 'unchecked' ? 'mismatch' : savedValue;
          console.log(
            `✅ ${item.id}: DB 값 "${savedValue}" 적용 (${jsonKey}에서 가져옴)`
          );
        } else {
          // 없으면 기본값 사용
          initialState[item.id] = item.defaultValue;
          console.log(
            `⚠️ ${item.id}: 기본값 "${item.defaultValue}" 사용 (${jsonKey}에 데이터 없음)`
          );
        }
      });

      setChecklistState(initialState);
      console.log(
        '🔍 TaxCertIntro: DB 데이터와 매핑된 최종 초기 상태:',
        initialState
      );
    }
  }, [data.checklistItems, stepResultData]);

  // 체크리스트 상태 변경 핸들러
  const handleChecklistChange = async (
    itemId: string,
    newValue: 'match' | 'mismatch'
  ) => {
    const newState = {
      ...checklistState,
      [itemId]: newValue,
    };
    setChecklistState(newState);
    console.log('✅ 1번째 페이지 체크리스트 상태:', checklistState);
    console.log('✅ 1번째 페이지 체크리스트 상태 변경:', newState);

    // store에 체크리스트 데이터 추가 (영어 id를 한글 키로 변환)
    const checklistData: RiskAssessmentJsonData = {};
    Object.keys(newState).forEach((itemId) => {
      const item = data.checklistItems.find((item) => item.id === itemId);
      if (item) {
        // 영어 item.id를 한글 JSON 키로 변환
        let jsonKey: string;
        switch (itemId) {
          case 'nameMatch':
            jsonKey = '서류와 임대인의 이름 일치 여부';
            break;
          case 'noUnpaid':
            jsonKey = '미납 내역 없음';
            break;
          default:
            jsonKey = itemId; // 기본값은 원래 id 사용
        }

        checklistData[jsonKey] = newState[itemId];
        console.log(
          `🔍 TaxCertIntro: ${itemId} -> ${jsonKey}: ${newState[itemId]}`
        );
      }
    });

    // 1. store에 데이터 추가
    addJsonData(checklistData);
    console.log(
      '✅ 1번째 페이지 체크리스트 상태를 store에 추가:',
      checklistData
    );

    // 2. store의 전체 데이터를 가져와서 DB에 저장
    try {
      const currentStoreData = getJsonData();
      console.log(
        '🔍 TaxCertIntro: store의 전체 데이터를 DB에 저장:',
        currentStoreData
      );

      if (selectedAddress?.nickname) {
        await saveRiskAssessmentMutation.mutateAsync({
          stepNumber,
          detail,
          jsonData: currentStoreData,
          domain: 'taxCert',
          userAddressNickname: selectedAddress.nickname,
        });
        console.log('✅ TaxCertIntro: store의 전체 데이터 DB 저장 완료');
      }
    } catch (error) {
      console.error('❌ TaxCertIntro: DB 저장 실패:', error);
    }
  };

  return (
    <div className='space-y-6'>
      {/* 내용 섹션들 */}
      {data.contentSections.map((section, index) => (
        <div key={index} className='space-y-3'>
          <h3 className='text-lg font-semibold text-gray-800'>
            {section.subtitle}
          </h3>
          <div className='space-y-2'>
            {section.contents.map((content, contentIndex) => (
              <p key={contentIndex} className='text-gray-600 leading-relaxed'>
                {content}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* 예시 이미지 */}
      <div className='flex justify-center'>
        <div className='border border-gray-200 rounded-lg overflow-hidden shadow-sm'>
          <img
            src={data.image.src}
            alt={data.image.alt}
            width={data.image.width}
            height={data.image.height}
            className='max-w-full h-auto'
          />
        </div>
      </div>

      {/* 체크리스트 */}
      <div className='mt-6'>
        <h4 className='font-semibold text-brand-black mb-3'>
          체크리스트 확인사항
        </h4>
        <div className='grid grid-cols-1 gap-3'>
          {data.checklistItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-colors duration-200 cursor-pointer ${
                checklistState[item.id] === 'match'
                  ? 'bg-brand-green/20'
                  : 'bg-brand-error/20'
              }`}
              onClick={() => {
                // 현재 상태와 반대로 변경
                const newValue =
                  checklistState[item.id] === 'match' ? 'mismatch' : 'match';
                handleChecklistChange(item.id, newValue);
              }}
            >
              <div className='flex flex-col gap-2 mb-2'>
                <div className='flex items-center gap-4'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={checklistState[item.id] === 'match'}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? 'match'
                          : 'mismatch';
                        handleChecklistChange(item.id, newValue);
                      }}
                      className='w-4 h-4 text-brand-blue border-brand-black focus:ring-brand-blue appearance-none rounded border-2 checked:bg-brand-blue checked:border-brand-blue'
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className='text-sm text-brand-black'>
                      {checklistState[item.id] === 'match'
                        ? '✅ 통과'
                        : '❌ 실패'}
                    </span>
                  </label>
                </div>
                <span className='font-medium text-brand-black text-sm'>
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
