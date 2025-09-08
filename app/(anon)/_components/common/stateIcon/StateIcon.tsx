'use client';

import React from 'react';
import { styles } from './StateIcon.styles';
import StateIconItem from './StateIconItem';
interface StateIconProps {
  checked: number;
  unchecked: number;
  mismatch: number;
}

export default function StateIcon({ checked, unchecked, mismatch }: StateIconProps) {
  return (
    <div className={styles.container}>
      <StateIconItem type='completed' count={checked} />
      <StateIconItem type='warning' count={mismatch} />
      <StateIconItem type='unconfirmed' count={unchecked} />
    </div>
  );
}
