import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { RealEstateDataItem } from '@/hooks/useRealEstateDataProcessor';

export const useRealEstateDataSearch = (jsonData: RealEstateDataItem[]) => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');
  const [searchTerm, setSearchTerm] = useState(keyword || '');
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 키워드 검색 및 스크롤
  useEffect(() => {
    if (keyword && scrollRefs.current[keyword]) {
      setTimeout(() => {
        scrollRefs.current[keyword]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        scrollRefs.current[keyword]?.classList.add('highlight');
      }, 500);
    }
  }, [keyword, jsonData]);

  // 검색어 변경 시 스크롤
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term && scrollRefs.current[term]) {
      setTimeout(() => {
        scrollRefs.current[term]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        scrollRefs.current[term]?.classList.add('highlight');
      }, 100);
    }
  };

  // 키워드가 포함된 항목 필터링
  const filteredData = searchTerm
    ? jsonData.filter(
        (item) =>
          item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof item.value === 'string' &&
            item.value.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : jsonData;

  return {
    searchTerm,
    filteredData,
    scrollRefs,
    handleSearch,
    setSearchTerm,
  };
};
