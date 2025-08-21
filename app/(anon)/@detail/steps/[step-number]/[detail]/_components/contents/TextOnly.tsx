'use client';

import React from 'react';
import styles from './TextOnly.styles';

interface ContentSection {
  title?: string;
  subtitle?: string;
  contents?: string[];
  summary?: string;
}

interface TextOnlyProps {
  data: ContentSection[];
}

const TextOnly = ({ data }: TextOnlyProps) => {
  // data가 배열인 경우만 처리
  if (Array.isArray(data) && data.length > 0) {
    return (
      <div className={styles.container}>
        {data.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.section}>
            {section.title && (
              <div className={styles.sectionTitle}>{section.title}</div>
            )}
            {section.subtitle && (
              <div className={styles.sectionSubtitle}>{section.subtitle}</div>
            )}
            {section.contents && (
              <div className={styles.contents}>
                {section.contents.map((content: string, contentIndex: number) => (
                  <p key={contentIndex} className={styles.contentItem}>
                    {content}
                  </p>
                ))}
              </div>
            )}
            {section.summary && (
              <div className={styles.summary}>{section.summary}</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // data가 없는 경우
  return (
    <div className={styles.container}>
      <div className={styles.noDataContainer}>
        데이터가 없습니다.
      </div>
    </div>
  );
};

export default TextOnly;
