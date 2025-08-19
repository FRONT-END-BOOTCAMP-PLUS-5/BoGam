'use client';

import { Check, X, Link } from 'lucide-react';
import clsx from 'clsx';
import { styles } from './CircularIconBadge.styles';

type CircularIconBadgeProps = {
  type: 'match' | 'match-blue' | 'mismatch' | 'unchecked' | 'unchecked-white' | 'link' | 'match-light-green' | 'mismatch-emoji';
  size?: 'xsm' | 'sm' | 'md' | 'lg';
  weight?: 'thin' | 'normal' | 'thick';
  className?: string;
};

const CircularIconBadge = ({ type, size = 'md', weight = 'normal', className }: CircularIconBadgeProps) => {
  // 아이콘 결정
  const getIcon = () => {
    switch (type) {
      case 'match':
      case 'match-blue':
      case 'match-light-green':
        return Check;
      case 'mismatch':
      case 'mismatch-emoji':
        return X;
      case 'unchecked':
      case 'unchecked-white':
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
      case 'xsm':
        return styles.iconXsm;
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

  // 이모지 크기 클래스 결정 - SVG 아이콘과 정확히 동일한 크기로 설정
  const getEmojiSizeClass = () => {
    switch (size) {
      case 'xsm':
        return 'w-2 h-2 text-xs'; // SVG iconSm과 정확히 동일한 크기
      case 'sm':
        return 'w-3 h-3 text-xs'; // SVG iconSm과 정확히 동일한 크기
      case 'md':
        return 'w-4 h-4 text-sm'; // SVG iconMd와 정확히 동일한 크기
      case 'lg':
        return 'w-5 h-5 text-base'; // SVG iconLg와 정확히 동일한 크기
      default:
        return 'w-4 h-4 text-sm';
    }
  };

  // 이모지 뱃지 렌더링 - 일반 아이콘과 완전히 동일한 방식으로 렌더링
  if (type === 'mismatch-emoji') {
    return (
      <div 
        className={clsx(
          styles.badge,
          styles[size as keyof typeof styles], // 일반 아이콘과 동일한 size 클래스 사용
          styles[type as keyof typeof styles],
          className
        )}
      >
        <span className={clsx(getEmojiSizeClass(), 'leading-none flex items-center justify-center')}>😱</span>
      </div>
    );
  }

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
