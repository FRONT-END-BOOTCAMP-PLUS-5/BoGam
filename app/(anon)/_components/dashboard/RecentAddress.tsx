'use client';

import React from 'react';
import { styles } from './RecentAddress.styles';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

interface RecentAddressProps {
  onAddressClick: () => void;
}

export default function RecentAddress({ onAddressClick }: RecentAddressProps) {
  const { selectedAddress } = useUserAddressStore();

  if (!selectedAddress) {
    return (
      <div className="p-4 text-center text-brand-dark-gray">
        선택된 주소가 없습니다.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>최근 열람</h3>
      <span className={styles.addressText}>{selectedAddress.completeAddress}</span>
    </div>
  );
}
