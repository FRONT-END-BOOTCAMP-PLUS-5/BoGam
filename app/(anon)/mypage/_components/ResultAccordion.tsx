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
          <span className={styles.subtitle}>{subtitle}</span>
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
      >
        {children}
      </div>
    </div>
  );
};

export default ResultAccordion;
