'use client';

import React from 'react';
import { styles } from './StateIcon.styles';
import StateIconItem from './StateIconItem';

interface StateIconProps {
  completedCount: number;
  unconfirmedCount: number;
  warningCount: number;
}

export default function StateIcon({
  completedCount,
  unconfirmedCount,
  warningCount,
}: StateIconProps) {
  return (
    <div className={styles.container}>
      <StateIconItem type='completed' count={completedCount} />
      <StateIconItem type='unconfirmed' count={unconfirmedCount} />
      <StateIconItem type='warning' count={warningCount} />
    </div>
  );
}
