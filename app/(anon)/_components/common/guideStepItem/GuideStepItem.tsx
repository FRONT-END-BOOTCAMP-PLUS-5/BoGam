'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { styles } from './GuideStepItem.styles';

type GuideStepItemProps = {
  stepNumber: string;
  title: string;
  children: ReactNode;
  showDivider?: boolean;
  className?: string;
  onClose?: () => void;
};

const GuideStepItem = ({ 
  stepNumber, 
  title, 
  children, 
  showDivider = false,
  className,
  onClose
}: GuideStepItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    const [step, detail] = stepNumber.split('-');
    router.push(`/steps/${step}`);
    // 라우팅 후 대시보드 닫기
    if (onClose) {
      onClose();
    }
  };
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>{stepNumber}</div>
        <div className={styles.stepTitleContainer}>
          <h4 className={styles.stepTitle}>{title}</h4>
          <button onClick={handleClick} className={styles.chevronButton}>
            <ChevronRight className={styles.chevronIcon} />
          </button>
        </div>
      </div>
      
      <div className={styles.stepContent}>
        {children}
      </div>
      
      {showDivider && <div className={styles.divider} />}
    </div>
  );
};

export default GuideStepItem;
