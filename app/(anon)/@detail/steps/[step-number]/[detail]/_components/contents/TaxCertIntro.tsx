'use client';

import { useState, useEffect } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { useRiskAssessmentSave } from '@/hooks/useRiskAssessmentSave';
import { parseStepUrl } from '@utils/stepUrlParser';
import { RiskAssessmentJsonData } from '@utils/riskAssessmentUtils';

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
  jsonData: RiskAssessmentJsonData;
  onJsonDataChange: (newData: RiskAssessmentJsonData) => Promise<void>;
}

export default function TaxCertIntro({
  data,
  jsonData,
  onJsonDataChange,
}: TaxCertIntroProps) {
  const [checklistState, setChecklistState] = useState<
    Record<string, 'match' | 'mismatch'>
  >({});

  // 초기 체크리스트 상태 설정
  useEffect(() => {
    if (data.checklistItems && Object.keys(checklistState).length === 0) {
      const initialState: Record<string, 'match' | 'mismatch'> = {};
      data.checklistItems.forEach((item) => {
        // 상위 컴포넌트에서 전달받은 jsonData에서 데이터 찾기
        const savedValue = jsonData[item.label];
        initialState[item.id] =
          (savedValue as 'match' | 'mismatch') || item.defaultValue;
      });
      setChecklistState(initialState);
    }
  }, [data.checklistItems, jsonData, checklistState]);

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

    // 상위 컴포넌트에 체크리스트 데이터 전달 (기존 데이터 유지)
    try {
      const checklistData: RiskAssessmentJsonData = {};
      Object.keys(newState).forEach((itemId) => {
        const item = data.checklistItems.find((item) => item.id === itemId);
        if (item) {
          checklistData[item.label] = newState[itemId];
        }
      });

      // 기존 jsonData와 새로운 체크리스트 데이터를 병합
      const updatedData = {
        ...jsonData, // 기존 데이터 유지
        ...checklistData, // 새로운 체크리스트 데이터 추가/업데이트
      };

      await onJsonDataChange(updatedData);
      console.log('✅ 체크리스트 상태 저장 완료:', newState);
    } catch (error) {
      console.error('❌ 체크리스트 상태 저장 실패:', error);
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
