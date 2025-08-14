'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { getItemStyle, getTextStyle, styles } from './StateIcon.styles';

interface StateIconItemProps {
  type: 'completed' | 'unconfirmed' | 'warning';
  count: number;
}

export default function StateIconItem({ type, count }: StateIconItemProps) {
  const getLabel = () => {
    switch (type) {
      case 'completed':
        return '안전';
      case 'unconfirmed':
        return '미확인';
      case 'warning':
        return '경고';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'completed':
        return <Check className='w-4 h-4 text-white' strokeWidth={3} />;
      case 'unconfirmed':
        return <X className='w-4 h-4 text-brand-dark-gray' strokeWidth={3} />;
      case 'warning':
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
          type === 'completed'
            ? 'text-white'
            : type === 'unconfirmed'
            ? 'text-brand-black'
            : 'text-white'
        }`}
      >
        {count}개
      </div>
    </div>
  );
}
