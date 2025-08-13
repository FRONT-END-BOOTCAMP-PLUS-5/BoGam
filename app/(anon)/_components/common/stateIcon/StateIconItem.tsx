'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import {
  getItemStyle,
  getIconStyle,
  getTextStyle,
  styles,
} from './StateIcon.styles';

interface StateIconItemProps {
  type: 'completed' | 'unconfirmed' | 'warning';
  count: number;
}

export default function StateIconItem({ type, count }: StateIconItemProps) {
  const getLabel = () => {
    switch (type) {
      case 'completed':
        return '확인 완료';
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
        return <Check className={getIconStyle('completed')} />;
      case 'unconfirmed':
        return <X className={getIconStyle('unconfirmed')} />;
      case 'warning':
        return (
          <span
            className={getIconStyle('warning')}
            style={{ fontSize: '14px' }}
          >
            😱
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={getItemStyle(type)}>
      {getIcon()}
      <div className={getTextStyle(type)}>
        <span>{getLabel()}</span>
        <span className={styles.count}>{count}개</span>
      </div>
    </div>
  );
}
