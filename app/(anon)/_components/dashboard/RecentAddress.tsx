'use client';

import React from 'react';
import { styles } from './RecentAddress.styles';

interface RecentAddressProps {
  address: string;
  onAddressClick: () => void;
}

export default function RecentAddress({ address, onAddressClick }: RecentAddressProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>최근 열람</h3>
      <div className={styles.addressSection}>
        <button 
          onClick={onAddressClick}
          className={styles.addressButton}
        >
          <span className={styles.addressText}>{address}</span>
        </button>
        <button className={styles.starButton} aria-label="즐겨찾기">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M10 15.27L16.18 19L14.54 11.97L20 7.24L12.81 6.62L10 0L7.19 6.62L0 7.24L5.46 11.97L3.82 19L10 15.27Z" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
