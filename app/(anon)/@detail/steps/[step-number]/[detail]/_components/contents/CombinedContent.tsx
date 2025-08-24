'use client';

import React from 'react';
import TextOnly from './TextOnly';
import RadioGroup from './RadioGroup';
import Table from './Table';
import List from './List';
import DataGrid from './DataGrid';
import { ContentSection, CombinedContentProps, LegacyContentSection } from './types';
import { styles } from './CombinedContent.styles';

const CombinedContent = ({
  sections,
  spacing = 'md',
  showDividers = true,
}: CombinedContentProps) => {
  // sections가 없으면 빈 배열 반환
  if (!sections || sections.length === 0) {
    return <div>콘텐츠가 없습니다.</div>;
  }

  // 각 섹션을 렌더링하는 함수
  const renderSection = (section: ContentSection, index: number) => {
    const isLast = index === sections.length - 1;

    let content;
    switch (section.type) {
      case 'TextOnly':
        content = <TextOnly data={section.data as LegacyContentSection[]} />;
        break;
      case 'RadioGroup':
        content = <RadioGroup data={section.data as LegacyContentSection[]} />;
        break;
      case 'Table':
        const tableData = Array.isArray(section.data) 
          ? section.data 
          : Object.entries(section.data).map(([key, value]) => ({
              left: key,
              right: value as string
            }));
        content = <Table data={tableData} />;
        break;
      case 'List':
        content = <List data={section.data as Array<{ left: string; right?: string }>} />;
        break;
      case 'DataGrid':
        content = <DataGrid data={section.data as Array<{ left: string; right?: string }>} />;
        break;
      default:
        console.warn(
          `Unknown section type: ${(section as { type: string }).type}`
        );
        return null;
    }

    return (
      <div key={index} className={styles.sectionContainer}>
        {/* 섹션 제목이 있는 경우 */}
        {(section.title || section.subtitle) && (
          <div className={styles.sectionHeader}>
            {section.title && (
              <h3 className={styles.sectionTitle}>{section.title}</h3>
            )}
            {section.subtitle && (
              <p className={styles.sectionSubtitle}>{section.subtitle}</p>
            )}
          </div>
        )}

        {/* 컴포넌트 렌더링 */}
        {content}

        {/* 구분선 (마지막 섹션이 아니고 구분선을 표시하는 경우) */}
        {!isLast && showDividers && <div className={styles.divider} />}
      </div>
    );
  };

  return (
    <div className={styles.spacing[spacing]}>
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );
};

export default CombinedContent;
