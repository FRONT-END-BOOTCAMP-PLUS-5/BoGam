'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { TabNavigation } from '@/(anon)/_components/common/broker/tabNavigation/TabNavigation';
import { styles } from '@/(anon)/_components/common/container/DataContainer.styles';

interface DataContainerProps {
  title: string;
  inputComponent: ReactNode | ((props: { onSuccess: () => void }) => ReactNode);
  outputComponent: ReactNode;
  checkExistsQuery?: {
    data?: { success: boolean; data?: { exists: boolean } };
    isLoading: boolean;
    refetch: () => void;
  };
  onSuccess?: () => void;
}

export const DataContainer = ({
  title,
  inputComponent,
  outputComponent,
  checkExistsQuery,
  onSuccess,
}: DataContainerProps) => {
  const { selectedAddress } = useUserAddressStore();
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  // 존재 여부 쿼리 결과에 따른 탭 전환
  useEffect(() => {
    if (checkExistsQuery?.data?.success) {
      const existsData = checkExistsQuery.data.data as { exists: boolean };
      if (existsData?.exists) {
        setActiveTab('output');
      } else {
        setActiveTab('input');
      }
    }
  }, [checkExistsQuery?.data]);

  // 성공 시 콜백
  const handleSuccess = () => {
    setActiveTab('output');
    // 쿼리 무효화하여 데이터 새로고침
    if (checkExistsQuery) {
      checkExistsQuery.refetch();
    }
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {checkExistsQuery?.isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>데이터 확인 중...</p>
          </div>
        ) : activeTab === 'input' ? (
          <div className={styles.inputWrapper}>
            {typeof inputComponent === 'function'
              ? inputComponent({ onSuccess: handleSuccess })
              : inputComponent}
          </div>
        ) : (
          <div className={styles.outputWrapper}>{outputComponent}</div>
        )}
      </div>
    </div>
  );
};
