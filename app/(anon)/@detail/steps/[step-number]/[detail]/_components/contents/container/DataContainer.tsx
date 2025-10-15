'use client';

import { useState, useEffect, ReactNode } from 'react';
import { TabNavigation } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/broker/tabNavigation/TabNavigation';
import { styles } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/container/DataContainer.styles';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';

interface DataContainerProps {
  title: string;
  inputComponent: ReactNode | ((props: { onSuccess: () => void }) => ReactNode);
  outputComponent: ReactNode;
  checkExistsQuery?: {
    data?: { 
      success: boolean,
      exists: boolean 
    };
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
  const [internalActiveTab, setInternalActiveTab] = useState<
    'input' | 'output'
  >('input');

  // 외부에서 제어하는 경우 외부 상태 사용, 그렇지 않으면 내부 상태 사용
  const activeTab = externalActiveTab ?? internalActiveTab;
  const setActiveTab = externalOnTabChange ?? setInternalActiveTab;

  // 존재 여부 쿼리 결과에 따른 탭 전환 (초기 로드 시에만)
  useEffect(() => {
    if (checkExistsQuery?.data?.success && !checkExistsQuery?.isLoading) {
      const existsData = checkExistsQuery.data.exists;
      if (existsData) {
        setActiveTab('output');
      } else {
        setActiveTab('input');
      }
    }
  }, [checkExistsQuery?.data?.success, checkExistsQuery?.isLoading, setActiveTab, checkExistsQuery?.data?.exists]); // success가 변경되고 로딩이 아닐 때만 실행

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

  // 존재 여부 확인 중일 때는 로딩 오버레이만 표시 (탭/타이틀 숨김)
  if (checkExistsQuery?.isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContent}>
          <LoadingOverlay
            isVisible={true}
            title="데이터 확인 중..."
            currentStep={1}
            totalSteps={1}
            variant="inline"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 'input' ? (
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
