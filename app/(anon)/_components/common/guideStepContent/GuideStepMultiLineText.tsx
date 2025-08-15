'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { styles } from './GuideStepStyles';

type GuideStepMultiLineTextProps = {
  children: ReactNode;
  className?: string;
};

const GuideStepMultiLineText = ({ children, className }: GuideStepMultiLineTextProps) => {
  return (
    <div className={clsx(styles.multiLineText, className)}>
      {children}
    </div>
  );
};

export default GuideStepMultiLineText;
