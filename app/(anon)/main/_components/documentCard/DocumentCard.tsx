'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileSearch, FileUser } from 'lucide-react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { styles } from './DocumentCard.styles';

export default function DocumentCard() {
  const router = useRouter();
  const { selectedAddress } = useUserAddressStore();

  const handleRegisterBookClick = () => {
    if (!selectedAddress) {
      alert('주소를 먼저 선택해주세요.');
      return;
    }
    router.push(
      `/document-view?type=realestate&address=${encodeURIComponent(
        selectedAddress.nickname
      )}`
    );
  };

  const handleTaxCertClick = () => {
    if (!selectedAddress) {
      alert('주소를 먼저 선택해주세요.');
      return;
    }
    router.push(
      `/document-view?type=taxcert&address=${encodeURIComponent(
        selectedAddress.nickname
      )}`
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>문서</div>
      <div className={styles.documentButtons}>
        <button
          className={styles.documentButton}
          onClick={handleRegisterBookClick}
        >
          <FileSearch className={styles.icon} />
          <span className={styles.buttonText}>등기부등본</span>
        </button>
        <button className={styles.documentButton} onClick={handleTaxCertClick}>
          <FileUser className={styles.icon} />
          <span className={styles.buttonText}>납세증명서</span>
        </button>
      </div>
    </div>
  );
}
