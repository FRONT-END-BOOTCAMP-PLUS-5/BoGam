'use client';

import React from 'react';
import { useRealEstateDataProcessor } from '@/hooks/useRealEstateDataProcessor';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { useRealEstateDataSearch } from '@/hooks/useRealEstateDataSearch';
import SearchSection from '@/(anon)/real-estate-data/_components/searchSection/SearchSection';
import DataList from '@/(anon)/real-estate-data/_components/dataList/DataList';
import { styles } from './PageContent.styles';

export default function PageContent() {
  const { jsonData, isLoading } = useRealEstateDataProcessor();
  const { searchTerm, filteredData, scrollRefs, handleSearch, setSearchTerm } =
    useRealEstateDataSearch(jsonData);

  if (isLoading) {
    return (
      <LoadingOverlay 
        isVisible={true}
        title="데이터를 불러오는 중입니다..."
        currentStep={1}
        totalSteps={1}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainCard}>
          <SearchSection
            searchTerm={searchTerm}
            filteredDataLength={filteredData.length}
            onSearch={handleSearch}
            onReset={() => setSearchTerm('')}
          />
          <DataList
            filteredData={filteredData}
            searchTerm={searchTerm}
            scrollRefs={scrollRefs}
          />
        </div>
      </div>
    </div>
  );
}
