'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { styles } from './GuideStepItem.styles';

type GuideStepItemProps = {
  stepNumber: string;
  title: string;
  children: ReactNode;
  showDivider?: boolean;
  className?: string;
};

const GuideStepItem = ({ 
  stepNumber, 
  title, 
  children, 
  showDivider = false,
  className 
}: GuideStepItemProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>{stepNumber}</div>
        <h4 className={styles.stepTitle}>{title}</h4>
      </div>
      
      <div className={styles.stepContent}>
        {children}
      </div>
      
      {showDivider && <div className={styles.divider} />}
    </div>
  );
};

export default GuideStepItem;
