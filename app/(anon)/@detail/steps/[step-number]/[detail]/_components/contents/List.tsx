import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { DropDown } from '@/(anon)/_components/common/dropdown/DropDown';
import styles from './List.styles';

interface AccordionItem {
  title: string;
  content: string;
}

interface ListProps {
  title?: string;
  data: AccordionItem[] | string[] | Record<string, AccordionItem[]>;
}

const List = ({ title, data }: ListProps) => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('전체');
  const [currentData, setCurrentData] = useState<AccordionItem[]>([]);

  // 데이터 타입에 따른 처리
  useEffect(() => {
    if (typeof data === 'object' && !Array.isArray(data)) {
      // Record<string, AccordionItem[]> 타입인 경우
      const optionData = data as Record<string, AccordionItem[]>;
      const options = Object.keys(optionData);
      
      if (selectedOption === '전체') {
        // 전체 데이터를 하나의 배열로 합치기 (그룹 헤더 포함)
        const allData: AccordionItem[] = [];
        Object.entries(optionData).forEach(([option, items]) => {
          // 그룹 헤더 추가
          allData.push({
            title: `📋 ${option}`,
            content: ''
          });
          // 해당 그룹의 아이템들 추가
          allData.push(...items);
        });
        setCurrentData(allData);
      } else if (options.includes(selectedOption)) {
        setCurrentData(optionData[selectedOption]);
      }
    } else {
      // 기존 배열 타입인 경우
      const accordionData: AccordionItem[] =
        Array.isArray(data) && typeof data[0] === 'string'
          ? (data as string[]).map((item) => ({
              title: item,
              content: `${item}에 대한 상세 설명입니다.`,
            }))
          : (data as AccordionItem[]);
      setCurrentData(accordionData);
    }
  }, [data, selectedOption]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  // 옵션 데이터가 있는지 확인
  const hasOptions = typeof data === 'object' && !Array.isArray(data) && Object.keys(data as Record<string, AccordionItem[]>).length > 0;

  // 드롭다운 옵션 생성
  const dropdownOptions = hasOptions 
    ? [
        { value: '전체', label: '전체' },
        ...Object.keys(data as Record<string, AccordionItem[]>).map((option) => ({
          value: option,
          label: option,
        }))
      ]
    : [];

  return (
    <div className={styles.container}>
      {title && (
        <div>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}
      
      {/* 옵션 선택 드롭다운 */}
      {hasOptions && (
        <div className={styles.optionSelector}>
          <DropDown
            options={dropdownOptions}
            value={selectedOption}
            onChange={setSelectedOption}
            label="서류 종류 선택:"
            className="w-full"
          />
        </div>
      )}

      <div className={styles.maxWidthContainer}>
        <div className={styles.content}>
          {currentData.map((item, index) => {
            // 구분 영역인지 확인 (content가 비어있는 경우)
            const isSectionHeader = !item.content || item.content.trim() === '';

            if (isSectionHeader) {
              // 구분 영역 렌더링 (구분선 형태)
              return (
                <div key={index} className={styles.sectionHeader}>
                  <div className={styles.sectionDivider}>
                    <span className={styles.sectionDividerText}>
                      {item.title}
                    </span>
                    <div className={styles.sectionDividerLine}></div>
                  </div>
                </div>
              );
            } else {
              // 일반 아코디언 항목 렌더링
              return (
                <div key={index} className={styles.accordionItem}>
                  <div className={styles.accordionContainer}>
                    {/* 아코디언 헤더 */}
                    <button
                      onClick={() => toggleItem(index)}
                      className={`${styles.accordionButton} ${
                        openItems.includes(index) ? styles.accordionButtonActive : ''
                      }`}
                    >
                      <span className={styles.accordionText}>{item.title}</span>
                      <ChevronDown
                        size={16}
                        className={`${styles.accordionArrow} ${
                          openItems.includes(index) ? styles.accordionArrowRotated : ''
                        }`}
                      />
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
