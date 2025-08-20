'use client';

import React from 'react';
import { AddressConfirmationTab } from '@/(anon)/main/_components/tabContainer/AddressConfirmationTab';
import { TransactionSearchTab } from '@/(anon)/main/_components/tabContainer/TransactionSearchTab';
import { TransactionInquiryTab } from '@/(anon)/main/_components/tabContainer/TransactionInquiryTab';
import { styles } from '@/(anon)/main/_components/tabContainer/TabContainer.styles';

interface TabContainerProps {
  activeTab: number;
  onTabChange: (tabIndex: number) => void;
}

export const TabContainer: React.FC<TabContainerProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 0, label: '주소지 확인', component: AddressConfirmationTab },
    { id: 1, label: '실거래가 검색', component: TransactionSearchTab },
    { id: 2, label: '실거래가 조회', component: TransactionInquiryTab },
  ];

  const handleTabClick = (tabIndex: number) => {
    // 이전 단계 미완료 시 경고 메시지 표시 로직은 나중에 구현
    onTabChange(tabIndex);
  };

  return (
    <div className={styles.container}>
      {/* 탭 네비게이션 */}
      <div className={styles.tabNavigation}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.activeTab : styles.inactiveTab
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 - 모든 컴포넌트를 렌더링하되 활성 탭만 표시 */}
      <div className={styles.tabContent}>
        {tabs.map((tab) => {
          const TabComponent = tab.component;
          return (
            <div
              key={tab.id}
              style={{
                display: activeTab === tab.id ? 'block' : 'none',
              }}
            >
              <TabComponent onTabChange={onTabChange} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
