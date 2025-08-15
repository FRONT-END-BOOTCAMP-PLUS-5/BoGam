'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { styles } from './GuideStepStyles';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';

type GuideStepRowProps = {
  iconType: 'match' | 'mismatch' | 'unchecked' | 'link';
  children: ReactNode;
  className?: string;
};

const GuideStepRow = ({ iconType, children, className }: GuideStepRowProps) => {
  // CircularIconBadge type 결정
  const getBadgeType = () => {
    switch (iconType) {
      case 'match':
        return 'match-blue';
      case 'mismatch':
        return 'mismatch';
      case 'unchecked':
        return 'unchecked';
      case 'link':
        return 'link';
      default:
        return 'unchecked';
    }
  };

  return (
    <div className={clsx(styles.row, className)}>
      <CircularIconBadge 
        type={getBadgeType()} 
        size="md" 
        weight="thick" 
      />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default GuideStepRow;
