'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { getItemStyle, getTextStyle, styles } from './StateIcon.styles';

interface StateIconItemProps {
  type: 'match' | 'unchecked' | 'mismatch';
  count: number;
}

export default function StateIconItem({ type, count }: StateIconItemProps) {
  const getLabel = () => {
    switch (type) {
      case 'match':
        return '안전';
      case 'unchecked':
        return '미확인';
      case 'mismatch':
        return '경고';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'match':
        return <Check className='w-4 h-4 text-white' strokeWidth={3} />;
      case 'unchecked':
        return <X className='w-4 h-4 text-brand-dark-gray' strokeWidth={3} />;
      case 'mismatch':
        return <span style={{ fontSize: '14px' }}>😱</span>;
      default:
        return null;
    }
  };

  return (
    <div className={getItemStyle(type)}>
      <div className={styles.icon}>{getIcon()}</div>
      <div className={`${getTextStyle(type)}`}>{getLabel()}</div>
      <div
        className={`${styles.count} ${
          type === 'match'
            ? 'text-white'
            : type === 'unchecked'
            ? 'text-brand-black'
            : 'text-white'
        }`}
      >
        {count}개
      </div>
    </div>
  );
}
