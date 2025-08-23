'use client';

import React from 'react';
import TextOnly from './TextOnly';
import RadioGroup from './RadioGroup';
import Table from './Table';
import List from './List';
import DataGrid from './DataGrid';
import { ContentSection, CombinedContentProps } from './types';
import { styles } from './CombinedContent.styles';

const CombinedContent = ({
  sections,
  spacing = 'md',
  showDividers = true,
}: CombinedContentProps) => {
  // 각 섹션을 렌더링하는 함수
  const renderSection = (section: ContentSection, index: number) => {
    const isLast = index === sections.length - 1;

    let content;
    switch (section.type) {
      case 'TextOnly':
        content = <TextOnly data={section.data} />;
        break;
      case 'RadioGroup':
        content = <RadioGroup data={section.data} />;
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
        const listData = Array.isArray(section.data) 
          ? section.data.reduce((acc, item) => {
              acc[item.left] = item.right || '';
              return acc;
            }, {} as Record<string, string>)
          : (section.data as Record<string, string>);
        content = <List data={listData} />;
        break;
      case 'DataGrid':
        const dataGridData = Array.isArray(section.data) 
          ? section.data.reduce((acc, item) => {
              acc[item.left] = item.right || '';
              return acc;
            }, {} as Record<string, string>)
          : (section.data as Record<string, string>);
        content = <DataGrid data={dataGridData} />;
        break;
      default:
        console.warn(
          `Unknown section type: ${(section as Record<string, unknown>).type}`
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
