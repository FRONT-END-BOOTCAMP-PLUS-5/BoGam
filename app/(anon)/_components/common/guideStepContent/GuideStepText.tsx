'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { styles } from './GuideStepStyles';

type GuideStepTextProps = {
  children: ReactNode;
  multiLine?: boolean;
  className?: string;
};

const GuideStepText = ({ children, multiLine = false, className }: GuideStepTextProps) => {
  return (
    <div className={clsx(multiLine ? styles.multiLineText : styles.text, className)}>
      {children}
    </div>
  );
};

export default GuideStepText;
