import React from 'react';
import { RealEstateDataItem } from '@/hooks/useRealEstateDataProcessor';
import { styles } from './DataList.styles';

interface DataListProps {
  filteredData: RealEstateDataItem[];
  searchTerm: string;
  scrollRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

const DataList = ({ filteredData, searchTerm, scrollRefs }: DataListProps) => {
  if (filteredData.length === 0) {
    return <div className={styles.emptyState}>검색 결과가 없습니다.</div>;
  }

  return (
    <div className={styles.dataContainer}>
      <div className={styles.dataList}>
        {filteredData.map((item, index) => {
          const isHighlighted = Boolean(
            searchTerm &&
              (item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (typeof item.value === 'string' &&
                  item.value.toLowerCase().includes(searchTerm.toLowerCase())))
          );

          return (
            <div
              key={`${item.path}-${index}`}
              ref={(el) => {
                if (isHighlighted) {
                  scrollRefs.current[searchTerm] = el;
                }
              }}
              className={styles.dataItem(isHighlighted)}
            >
              <div className={styles.itemContent}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>
                    <span className={styles.fieldName}>
                      {item.description || item.key}
                    </span>
                    <span className={styles.fieldType}>{item.type}</span>
                  </div>
                  {isHighlighted && (
                    <div className={styles.matchIndicator}>🔍 매치</div>
                  )}
                </div>

                <div className={styles.valueContainer}>
                  <div className={styles.valueText}>
                    {item.value || '(빈 값)'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataList;
