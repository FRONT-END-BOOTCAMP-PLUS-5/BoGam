'use client';

import { Check, X, TriangleAlert } from 'lucide-react';
import clsx from 'clsx';
import { TextBadgeProps } from '../../../../../types/TextBadgeProps';
import { styles } from './TextBadge.styles';

const TextBadge = ({ type, size = 'md', className }: TextBadgeProps) => {
  // 아이콘과 텍스트 결정
  const getIconAndText = () => {
    switch (type) {
      case 'match':
        return {
          icon: Check,
          text: '안전'
        };
      case 'mismatch':
        return {
          icon: X,
          text: '미확인'
        };
      case 'unchecked':
        return {
          icon: TriangleAlert,
          text: '경고'
        };
      default:
        return {
          icon: TriangleAlert,
          text: '경고'
        };
    }
  };

  const { icon: Icon, text } = getIconAndText();

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
      <Icon className={getIconSizeClass()} />
      <span>{text}</span>
    </div>
  );
};

export default TextBadge;
