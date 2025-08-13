'use client';

import { Check, X, Link } from 'lucide-react';
import clsx from 'clsx';
import { styles } from './CircularIconBadge.styles';

type CircularIconBadgeProps = {
  type: 'match' | 'match-blue' | 'mismatch' | 'unchecked' | 'link';
  size?: 'sm' | 'md' | 'lg';
  weight?: 'thin' | 'normal' | 'thick';
  className?: string;
};

const CircularIconBadge = ({ type, size = 'md', weight = 'normal', className }: CircularIconBadgeProps) => {
  // 아이콘 결정
  const getIcon = () => {
    switch (type) {
      case 'match':
      case 'match-blue':
        return Check;
      case 'mismatch':
        return X;
      case 'unchecked':
        return X;
      case 'link':
        return Link;
      default:
        return X;
    }
  };

  const Icon = getIcon();

  // 아이콘 크기 클래스 결정
  const getIconSizeClass = () => {
    switch (size) {
      case 'sm':
        return styles.iconSm;
      case 'md':
        return styles.iconMd;
      case 'lg':
        return styles.iconLg;
      default:
        return styles.iconMd;
    }
  };

  return (
    <div 
      className={clsx(
        styles.badge,
        styles[size as keyof typeof styles],
        styles[type as keyof typeof styles],
        className
      )}
    >
      <Icon className={clsx(getIconSizeClass(), styles[weight])} />
    </div>
  );
};

export default CircularIconBadge;
