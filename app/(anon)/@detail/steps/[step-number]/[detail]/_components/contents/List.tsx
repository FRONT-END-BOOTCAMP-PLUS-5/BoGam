import React, { useState } from 'react';
import styles from './List.styles';

interface AccordionItem {
  title: string;
  content: string;
}

interface ListProps {
  data: AccordionItem[] | string[] | Array<{ left: string; right?: string }>;
}

const List = ({ data }: ListProps) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  // 문자열 배열인 경우 기본 아코디언 형태로 변환
  const accordionData: AccordionItem[] =
    Array.isArray(data) && typeof data[0] === 'string'
      ? (data as string[]).map((item) => ({
          title: item,
          content: `${item}에 대한 상세 설명입니다.`,
        }))
      : Array.isArray(data) && typeof data[0] === 'object' && 'left' in data[0]
        ? (data as Array<{ left: string; right?: string }>).map((item) => ({
            title: item.left,
            content: item.right || `${item.left}에 대한 상세 설명입니다.`,
          }))
        : (data as AccordionItem[]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.title}>필요한 서류 보기</h3>
      </div>
      <div className='max-w-2xl mx-auto'>
        <div className={styles.content}>
          {accordionData.map((item, index) => {
            // 구분 영역인지 확인 (content가 비어있는 경우)
            const isSectionHeader = !item.content || item.content.trim() === '';

            if (isSectionHeader) {
              // 구분 영역 렌더링
              return (
                <div key={index} className='mb-2'>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderButton}>
                      <span className={styles.sectionHeaderText}>
                        {item.title}
                      </span>
                    </div>
                  </div>
                </div>
              );
            } else {
              // 일반 아코디언 항목 렌더링
              return (
                <div key={index} className='mb-1'>
                  <div className={styles.accordionContainer}>
                    {/* 아코디언 헤더 */}
                    <button
                      onClick={() => toggleItem(index)}
                      className={styles.accordionButton}
                    >
                      <span className={styles.accordionText}>{item.title}</span>
                      <span
                        className={`${styles.accordionArrow} ${
                          openItems.includes(index) ? 'rotate-180' : ''
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {/* 아코디언 콘텐츠 */}
                    {openItems.includes(index) && (
                      <div className={styles.accordionContent}>
                        <p className={styles.accordionContentText}>
                          {item.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default List;
