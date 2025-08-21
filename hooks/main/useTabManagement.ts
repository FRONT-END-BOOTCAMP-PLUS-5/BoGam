import { useState } from 'react';
import {
  isValidTabIndex,
  getNextTabIndex,
  getPreviousTabIndex,
  getFirstTabIndex,
  getLastTabIndex,
  isValidTabChange,
} from '@utils/main/tabUtils';

export const useTabManagement = () => {
  // 현재 활성 탭 상태
  const [activeTab, setActiveTab] = useState(0);

  // 탭 변경 핸들러
  const handleTabChange = (tabIndex: number) => {
    if (isValidTabChange(activeTab, tabIndex)) {
      setActiveTab(tabIndex);
    }
  };

  // 탭 상태 확인
  const isTabActive = (tabIndex: number) => {
    return activeTab === tabIndex;
  };

  // 다음 탭으로 이동
  const goToNextTab = () => {
    const nextTab = getNextTabIndex(activeTab);
    setActiveTab(nextTab);
  };

  // 이전 탭으로 이동
  const goToPreviousTab = () => {
    const previousTab = getPreviousTabIndex(activeTab);
    setActiveTab(previousTab);
  };

  // 첫 번째 탭으로 이동
  const goToFirstTab = () => {
    const firstTab = getFirstTabIndex();
    setActiveTab(firstTab);
  };

  // 마지막 탭으로 이동
  const goToLastTab = () => {
    const lastTab = getLastTabIndex();
    setActiveTab(lastTab);
  };

  return {
    // 상태
    activeTab,

    // 핸들러
    handleTabChange,
    isTabActive,
    goToNextTab,
    goToPreviousTab,
    goToFirstTab,
    goToLastTab,
  };
};
