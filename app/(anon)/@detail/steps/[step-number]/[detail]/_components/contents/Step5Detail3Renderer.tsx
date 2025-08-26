'use client';

import { useState, useEffect, useRef } from 'react';
import { ContentSection, LegacyContentSection } from './types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { stepResultQueryApi } from '@libs/api_front/stepResultQueries.api';
import CombinedContent from './CombinedContent';
import TextOnly from './TextOnly';
import RadioGroup from './RadioGroup';
import Table from './Table';
import List from './List';
import JeonseGuaranteeContainer from './JeonseGuaranteeContainer';
import { step5Detail3RendererStyles } from './Step5Detail3Renderer.styles';

// RegionData 타입 정의
interface RegionData {
  region: string;
  depositRange: string;
  priorityAmount: string;
  option: string;
}

// 5-3 단계 전체 JSON 상태 타입
interface Step5Detail3JsonData {
  jeonseGuarantee?: {
    items: unknown[];
    totalCount: number;
    header: unknown;
    timestamp: string;
    userAddressNickname: string;
  };
  // 향후 다른 슬라이드 데이터 추가 가능
  [key: string]: unknown;
}

interface Step5Detail3RendererProps {
  sectionIndex: number;
  section: ContentSection;
  allSections?: ContentSection[];
}

export default function Step5Detail3Renderer({
  sectionIndex,
  section,
  allSections,
}: Step5Detail3RendererProps) {
  const { selectedAddress } = useUserAddressStore();

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepUrlData = pathname.match(/\/steps\/(\d+)\/(\d+)/);
  const stepNumber = stepUrlData ? parseInt(stepUrlData[1]) : 1;
  const detail = stepUrlData ? parseInt(stepUrlData[2]) : 1;

  // step-result 데이터 요청
  const { data: stepResultData } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: stepNumber.toString(),
    detail: detail.toString(),
  });

  // 5-3 단계 전체 JSON 상태
  const [stepJsonData, setStepJsonData] = useState<Step5Detail3JsonData>({});
  const [isSavingStepResult, setIsSavingStepResult] = useState(false);
  const hasSavedStepResult = useRef(false);

  // JSON 데이터가 업데이트되면 step-result에 저장
  useEffect(() => {
    const saveStepResult = async () => {
      if (
        Object.keys(stepJsonData).length > 0 &&
        selectedAddress?.nickname &&
        !hasSavedStepResult.current &&
        !isSavingStepResult
      ) {
        try {
          setIsSavingStepResult(true);
          hasSavedStepResult.current = true;

          // step-result 저장 - RadioGroup 데이터만 저장
          await stepResultQueryApi.upsertStepResult({
            userAddressNickname: selectedAddress.nickname,
            stepNumber: stepNumber,
            detail: detail,
            jsonDetails: {
              step5Detail3: 'match',
            },
          });
        } catch (error) {
          console.error('❌ Step 5-3 전체 JSON 저장 실패:', error);
          hasSavedStepResult.current = false;
        } finally {
          setIsSavingStepResult(false);
        }
      }
    };

    saveStepResult();
  }, [stepJsonData, selectedAddress, stepNumber, detail, isSavingStepResult]);

  // JSON 데이터 업데이트 함수
  const updateStepJsonData = (key: string, data: unknown) => {
    setStepJsonData((prev) => ({
      ...prev,
      [key]: data, // 데이터를 직접 저장
    }));
  };

  // 슬라이드별 렌더링 로직
  switch (sectionIndex) {
    case 0:
      return <RadioGroup data={section.data as LegacyContentSection[]} />;
    case 1:
      return (
        <JeonseGuaranteeContainer
          stepJsonData={stepJsonData}
          updateStepJsonData={updateStepJsonData}
          isSavingStepResult={isSavingStepResult}
        />
      );

    case 2:
      return <List data={section.data as string[]} />;

    default:
      // 기본 렌더링 로직
      return (
        <>
          {/* 각 섹션의 제목과 부제목 표시 */}
          {(section.title || section.subtitle) && (
            <div className={step5Detail3RendererStyles.sectionHeader}>
              {section.title && (
                <h3 className={step5Detail3RendererStyles.sectionTitle}>
                  {section.title}
                </h3>
              )}
              {section.subtitle && (
                <p className={step5Detail3RendererStyles.sectionSubtitle}>
                  {section.subtitle}
                </p>
              )}
            </div>
          )}

          {/* 섹션 타입에 따른 컴포넌트 렌더링 */}
          {section.type === 'TextOnly' && <TextOnly data={section.data} />}
          {section.type === 'RadioGroup' && <RadioGroup data={section.data} />}
          {section.type === 'Table' && (
            <Table data={section.data as unknown as RegionData[]} />
          )}
          {section.type === 'List' && (
            <List data={section.data as unknown as string[]} />
          )}
        </>
      );
  }
}
