'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetRealEstateFromDB } from '@/hooks/useRealEstate';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { styles } from './page.styles';

interface RealEstateDataItem {
  key: string;
  value: string | number | boolean;
  path: string;
  level: number;
  type: 'string' | 'array' | 'object' | 'null';
  description?: string;
}

export default function RealEstateDataPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');
  const { selectedAddress } = useUserAddressStore();
  const { data: realEstateData } = useGetRealEstateFromDB(
    selectedAddress?.nickname
  );
  const [jsonData, setJsonData] = useState<RealEstateDataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(keyword || '');
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 등기부등본 API 응답 데이터를 평면적으로 표시 (데이터가 있는 필드만)
  useEffect(() => {
    if (realEstateData?.data?.realEstateJson?.data) {
      const data = realEstateData.data.realEstateJson.data;
      const items: RealEstateDataItem[] = [];

      // 필드 키를 한글로 매핑하는 함수
      const getFieldName = (key: string): string => {
        const fieldMapping: { [key: string]: string } = {
          // 기본 정보
          commIssueCode: '발행코드',
          resIssueYN: '발행여부',
          resTotalPageCount: '총 페이지 수',
          commStartPageNo: '시작페이지 번호',
          resEndPageNo: '종료페이지 번호',
          resWarningMessage: '경고 메시지',

          // 주소 리스트
          resUserNm: '소유자',
          commUniqueNo: '부동산 고유번호',
          commAddrLotNumber: '부동산 소재지번',
          resState: '상태',
          resType: '구분',

          // 검색 리스트
          resNumber: '순번',
          commListNumber: '목록번호',
          resListType: '목록종류',

          // 등기사항 리스트
          resIssueNo: '발급(승인)번호',
          resDocTitle: '문서제목',
          resRealty: '부동산명',
          commCompetentRegistryOffice: '관할등기소',
          resPublishNo: '발행번호',
          resPublishDate: '발행일자',
          resPublishRegistryOffice: '발행등기소',

          // 등기이력
          resType1: '구분상세',
          resType2: '항목구분',
          resContents: '내용',

          // 주의사항
          resPrecautionsList: '주의사항 리스트',

          // 등기사항 요약
          resRegistrationSumList: '등기사항 요약 리스트',
        };

        return fieldMapping[key] || key;
      };

      // 객체를 재귀적으로 평면화하여 데이터가 있는 필드만 추출
      const flattenObject = (
        obj: Record<string, unknown>,
        prefix = ''
      ): void => {
        for (const [key, value] of Object.entries(obj)) {
          const currentKey = prefix ? `${prefix}.${key}` : key;

          if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'object' && !Array.isArray(value)) {
              // 객체인 경우 재귀적으로 처리
              flattenObject(value as Record<string, unknown>, currentKey);
            } else if (Array.isArray(value)) {
              // 배열인 경우 각 항목을 개별적으로 처리
              value.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                  flattenObject(
                    item as Record<string, unknown>,
                    `${currentKey}[${index}]`
                  );
                } else if (item !== null && item !== undefined && item !== '') {
                  items.push({
                    key: `${currentKey}[${index}]`,
                    value: String(item),
                    path: `${currentKey}[${index}]`,
                    level: 0,
                    type: getTypeFromValue(item),
                    description: getFieldName(key),
                  });
                }
              });
            } else {
              // 기본 값인 경우
              items.push({
                key: currentKey,
                value: String(value),
                path: currentKey,
                level: 0,
                type: getTypeFromValue(value),
                description: getFieldName(key),
              });
            }
          }
        }
      };

      // 값의 타입을 RealEstateDataItem.type에 맞게 변환하는 함수
      const getTypeFromValue = (
        value: unknown
      ): 'string' | 'array' | 'object' | 'null' => {
        if (Array.isArray(value)) return 'array';
        if (typeof value === 'object' && value !== null) return 'object';
        if (value === null) return 'null';
        return 'string';
      };

      flattenObject(data);
      setJsonData(items);
    }
  }, [realEstateData]);

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

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>등기부등본 데이터 전체보기</h1>
            <div className={styles.searchContainer}>
              <input
                type='text'
                placeholder='키워드를 입력하세요 (예: 압류, 가압류, 경매)'
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className={styles.searchInput}
              />
              <button
                onClick={() => setSearchTerm('')}
                className={styles.resetButton}
              >
                초기화
              </button>
            </div>
            {searchTerm && (
              <p className={styles.searchResult}>
                &ldquo;{searchTerm}&rdquo; 검색 결과: {filteredData.length}개
                항목
              </p>
            )}
          </div>

          <div className={styles.dataContainer}>
            <div className={styles.dataList}>
              {filteredData.map((item, index) => {
                const isHighlighted = Boolean(
                  searchTerm &&
                    (item.key
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                      (typeof item.value === 'string' &&
                        item.value
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())))
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

          {filteredData.length === 0 && (
            <div className={styles.emptyState}>검색 결과가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
