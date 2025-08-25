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
  activeTab?: 'input' | 'output';
  onTabChange?: (tab: 'input' | 'output') => void;
}

export const DataContainer = ({
  title,
  inputComponent,
  outputComponent,
  checkExistsQuery,
  onSuccess,
  activeTab: externalActiveTab,
  onTabChange: externalOnTabChange,
}: DataContainerProps) => {
  const { selectedAddress } = useUserAddressStore();
  const [internalActiveTab, setInternalActiveTab] = useState<
    'input' | 'output'
  >('input');

  // 외부에서 제어하는 경우 외부 상태 사용, 그렇지 않으면 내부 상태 사용
  const activeTab = externalActiveTab ?? internalActiveTab;
  const setActiveTab = externalOnTabChange ?? setInternalActiveTab;

  // 존재 여부 쿼리 결과에 따른 탭 전환 (초기 로드 시에만)
  useEffect(() => {
    if (checkExistsQuery?.data?.success && !checkExistsQuery?.isLoading) {
      const existsData = checkExistsQuery.data.data as { exists: boolean };
      if (existsData?.exists) {
        setActiveTab('output');
      } else {
        setActiveTab('input');
      }
    }
  }, [checkExistsQuery?.data?.success, checkExistsQuery?.isLoading]); // success가 변경되고 로딩이 아닐 때만 실행

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
