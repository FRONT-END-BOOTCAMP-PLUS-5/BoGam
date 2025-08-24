'use client';

import React, { useState, useEffect } from 'react';
import TaxCert from './TaxCert';
import TaxCertResultDisplay from './TaxCertResultDisplay';
import { styles } from './TaxCertContainer.styles';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useGetTaxCertCopy } from '@/hooks/useTaxCertQueries';

export const TaxCertContainer = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  
  const { selectedAddress } = useUserAddressStore();
  const userAddressNickname = selectedAddress?.nickname || '';
  const { data: result } = useGetTaxCertCopy(userAddressNickname);

  // DB에 데이터가 있으면 결과 탭, 없으면 입력 탭으로 설정
  useEffect(() => {
    if (result?.success && result.data?.taxCertJson?.data) {
      setActiveTab('output');
    } else if (result?.success && !result.data?.taxCertJson?.data) {
      setActiveTab('input');
    }
  }, [result]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>납세확인서 조회</h1>

      {/* 탭 네비게이션 */}
      <div className={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('input')}
          className={`${styles.tab} ${
            activeTab === 'input' ? styles.activeTab : styles.inactiveTab
          }`}
        >
          입력
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={`${styles.tab} ${
            activeTab === 'output' ? styles.activeTab : styles.inactiveTab
          }`}
        >
          결과
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 'input' && <TaxCert />}
        {activeTab === 'output' && <TaxCertResultDisplay />}
      </div>
    </div>
  );
};
