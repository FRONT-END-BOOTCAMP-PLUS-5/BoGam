'use client';

import { useState } from 'react';
import { ContentSection, LegacyContentSection } from './types';
import CombinedContent from './CombinedContent';
import TextOnly from './TextOnly';
import RadioGroup from './RadioGroup';
import Table from './Table';
import List from './List';
import JeonseGuaranteeContainer from './JeonseGuaranteeContainer';

// RegionData 타입 정의
interface RegionData {
  region: string;
  depositRange: string;
  priorityAmount: string;
  option: string;
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
  // 슬라이드별 렌더링 로직
  switch (sectionIndex) {
    case 0:
      return <RadioGroup data={section.data as LegacyContentSection[]} />;

    case 1:
      return (
        <JeonseGuaranteeContainer
          stepJsonData={{}}
          updateStepJsonData={() => {}}
          isSavingStepResult={false}
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
            <div className='mb-4'>
              {section.title && (
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  {section.title}
                </h3>
              )}
              {section.subtitle && (
                <p className='text-sm text-gray-600'>{section.subtitle}</p>
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
