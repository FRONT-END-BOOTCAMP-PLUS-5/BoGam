'use client';

import { styles } from './TabNavigation.styles';

interface TabNavigationProps {
  activeTab: 'input' | 'output';
  onTabChange: (tab: 'input' | 'output') => void;
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div className={styles.tabContainer}>
      <button
        onClick={() => onTabChange('input')}
        className={`${styles.tab} ${
          activeTab === 'input' ? styles.activeTab : styles.inactiveTab
        }`}
      >
        입력
      </button>
      <button
        onClick={() => onTabChange('output')}
        className={`${styles.tab} ${
          activeTab === 'output' ? styles.activeTab : styles.inactiveTab
        }`}
      >
        결과
      </button>
    </div>
  );
};
