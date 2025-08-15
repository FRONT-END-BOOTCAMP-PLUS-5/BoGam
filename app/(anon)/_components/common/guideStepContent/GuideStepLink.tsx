'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { styles } from './GuideStepStyles';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';

type GuideStepLinkProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
};

const GuideStepLink = ({ children, href = 'http://localhost:3000/', className, onClick }: GuideStepLinkProps) => {
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
};

export default GuideStepLink;
