'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { styles } from './GuideStepStyles';

type GuideStepTextProps = {
  children: ReactNode;
  className?: string;
};

const GuideStepText = ({ children, className }: GuideStepTextProps) => {
  return (
    <span className={clsx(styles.text, className)}>
      {children}
    </span>
  );
};

export default GuideStepText;
