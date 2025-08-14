'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { styles } from './GuideStepContent.styles';

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

// 하위 컴포넌트들
GuideStepContent.Row = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx(styles.row, className)}>
    {children}
  </div>
);

GuideStepContent.Text = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={clsx(styles.text, className)}>
    {children}
  </span>
);

GuideStepContent.Link = ({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
  <div className={clsx(styles.linkRow, className)} onClick={onClick}>
    {children}
  </div>
);

GuideStepContent.MultiLineText = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx(styles.multiLineText, className)}>
    {children}
  </div>
);

export default GuideStepContent;
