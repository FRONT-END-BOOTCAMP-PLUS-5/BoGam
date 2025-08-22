import React from 'react';
import { styles } from './SearchSection.styles';

interface SearchSectionProps {
  searchTerm: string;
  filteredDataLength: number;
  onSearch: (term: string) => void;
  onReset: () => void;
}

const SearchSection = ({
  searchTerm,
  filteredDataLength,
  onSearch,
  onReset,
}: SearchSectionProps) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>등기부등본 데이터 전체보기</h1>
      <div className={styles.searchContainer}>
        <input
          type='text'
          placeholder='키워드를 입력하세요 (예: 압류, 가압류, 경매)'
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={onReset} className={styles.resetButton}>
          초기화
        </button>
      </div>
      {searchTerm && (
        <p className={styles.searchResult}>
          &ldquo;{searchTerm}&rdquo; 검색 결과: {filteredDataLength}개 항목
        </p>
      )}
    </div>
  );
};

export default SearchSection;
