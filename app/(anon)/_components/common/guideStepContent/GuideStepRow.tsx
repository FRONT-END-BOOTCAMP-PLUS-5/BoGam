'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { styles } from './GuideStepStyles';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';

type GuideStepRowProps = {
  children: ReactNode;
  iconType: 'match' | 'mismatch' | 'unchecked' | 'link';
  href?: string;
  className?: string;
  onClick?: () => void;
};

const GuideStepRow = ({ children, iconType, href, className, onClick }: GuideStepRowProps) => {
  // 링크 타입일 때는 Link 컴포넌트로 감싸기
  if (iconType === 'link' && href) {
    return (
      <Link href={href} className={clsx(styles.linkRow, className)} onClick={onClick}>
        <CircularIconBadge 
          type="link" 
          size="md" 
          weight="thick" 
        />
        <span className={styles.linkText}>{children}</span>
      </Link>
    );
  }

  // 일반 타입일 때는 div로 렌더링
  return (
    <div className={clsx(styles.row, className)} onClick={onClick}>
      <div className={styles.iconContainer}>
        <CircularIconBadge 
          type={iconType === 'match' ? 'match-blue' : iconType} 
          size="md" 
          weight="thick" 
        />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default GuideStepRow;
