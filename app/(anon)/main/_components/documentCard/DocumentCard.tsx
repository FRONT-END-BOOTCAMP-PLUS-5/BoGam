'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileSearch, FileUser } from 'lucide-react';
import { styles } from './DocumentCard.styles';

export default function DocumentCard() {
  const router = useRouter();

  const handleRegisterBookClick = () => {
    router.push('/document-view?type=realestate');
  };

  const handleTaxCertClick = () => {
    router.push('/document-view?type=taxcert');
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
