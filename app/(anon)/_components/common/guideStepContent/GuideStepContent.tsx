'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { styles } from './GuideStepStyles';

type GuideStepContentProps = {
  children: ReactNode;
  className?: string;
};

const GuideStepContent = ({ children, className }: GuideStepContentProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      {children}
    </div>
  );
};

export default GuideStepContent;
