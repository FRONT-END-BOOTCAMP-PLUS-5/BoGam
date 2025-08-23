'use client';

import { useRealEstateDataProcessor } from '@/hooks/useRealEstateDataProcessor';
import { useRealEstateDataSearch } from '@/hooks/useRealEstateDataSearch';
import SearchSection from '@/(anon)/real-estate-data/_components/searchSection/SearchSection';
import DataList from '@/(anon)/real-estate-data/_components/dataList/DataList';
import { styles } from './PageContent.styles';

function RealEstateDataPageContent() {
  const { jsonData, isLoading } = useRealEstateDataProcessor();
  const { searchTerm, filteredData, scrollRefs, handleSearch, setSearchTerm } =
    useRealEstateDataSearch(jsonData);

  if (isLoading) {
    return <div>Loading...</div>;
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

export default RealEstateDataPageContent;
