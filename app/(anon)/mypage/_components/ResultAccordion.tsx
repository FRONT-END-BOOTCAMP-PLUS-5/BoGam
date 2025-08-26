'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { styles } from './ResultAccordion.styles';

type ResultAccordionProps = {
  stageNumber: string;
  subtitle: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  numbers?: [string, string, string];
};

const ResultAccordion = ({ 
  stageNumber, 
  subtitle, 
  children, 
  defaultOpen = false, 
  className,
  numbers
}: ResultAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={clsx(
      styles.container, 
      styles.bottomBorder,
      className
    )}>
      {/* Header */}
      <button
        onClick={toggleAccordion}
        className={styles.header}
      >
        <div className={styles.title}>
          <span className={styles.stageNumber}>{stageNumber}</span>
          {/* 
            아코디언 상태에 따라 제목 스타일 변경:
            - 닫힌 상태: subtitle (truncate 적용, 긴 텍스트는 "..."으로 표시)
            - 펼쳐진 상태: subtitleExpanded (truncate 없음, 전체 텍스트 표시)
          */}
          <span className={isOpen ? styles.subtitleExpanded : styles.subtitle}>{subtitle}</span>
        </div>
        
        <div className="flex items-center space-x-6">
          {numbers && (
            <div className={styles.numbers}>
              <span className={styles.numberItem}>{numbers[0]}</span>
              <span className={styles.numberItem}>{numbers[1]}</span>
              <span className={styles.numberItem}>{numbers[2]}</span>
            </div>
          )}
          {isOpen ? (
            <ChevronUp className={styles.iconOpen} />
          ) : (
            <ChevronDown className={styles.icon} />
          )}
        </div>
      </button>

      {/* Content with Animation */}
      <div 
        className={clsx(
          styles.content,
          isOpen ? styles.contentOpen : styles.contentClosed
        )}
        style={{
          maxHeight: isOpen ? 'none' : '0px'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ResultAccordion;
