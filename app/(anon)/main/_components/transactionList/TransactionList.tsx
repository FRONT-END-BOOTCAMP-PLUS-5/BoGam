import React, { useEffect, useCallback } from 'react';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { styles } from './TransactionList.styles';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { useMapStore } from '@libs/stores/map/mapStore';

export const TransactionList: React.FC = () => {
  const { transactionData, isLoading, setTransactionData } =
    useTransactionDataStore((state) => state);
  const { setMapCenter, setAdjustBounds } = useMapStore();

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    console.log('🔍 TransactionList 렌더링 - transactionData:', {
      length: transactionData.length,
      data: transactionData,
      isLoading,
    });
  }, [transactionData, isLoading]);

  // 테스트용 더미 데이터 추가 (개발 환경에서만)
  const addDummyData = useCallback(() => {
    // 더미 데이터 로직을 주석 처리하여 실제 API 호출만 테스트
    /*
    if (
      process.env.NODE_ENV === 'development' &&
      transactionData.length === 0 &&
      !isLoading
    ) {
      console.log('🧪 개발 환경에서 더미 데이터 추가');
      const dummyData: TransactionData[] = [
        {
          id: 'test-1',
          아파트: '테스트 아파트',
          거래금액: '50000',
          전용면적: '84.95',
          층: '15',
          건축년도: '2020',
          년: '2024',
          월: '12',
          일: '15',
          법정동: '역삼동',
          지번: '123-45',
          location: { lat: 37.5665, lng: 126.978 },
        },
        {
          id: 'test-2',
          아파트: '샘플 빌라',
          거래금액: '30000',
          전용면적: '59.85',
          층: '8',
          건축년도: '2018',
          년: '2024',
          월: '11',
          일: '20',
          법정동: '역삼동',
          지번: '123-46',
          location: { lat: 37.5666, lng: 126.9781 },
        },
      ];
      
      // setTimeout으로 지연시켜 상태 업데이트 순서 보장
      setTimeout(() => {
        setTransactionData(dummyData);
        console.log('🧪 더미 데이터 설정 완료');
      }, 100);
    }
    */
  }, [transactionData.length, isLoading, setTransactionData]);

  useEffect(() => {
    addDummyData();
  }, [addDummyData]);

  const handleTransactionClick = (location: Location | null) => {
    if (!location) {
      return;
    }
    setAdjustBounds(false); // 자동 조정 비활성화
    setMapCenter(location);
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className={styles.transactionList}>
        <h3>실거래가 정보</h3>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>실거래가 데이터를 불러오는 중...</p>
          <p className={styles.loadingNote}>약 10-15초 정도 소요됩니다.</p>
        </div>
      </div>
    );
  }

  // 데이터가 없을 때 (로딩 중이 아닐 때만)
  if (!isLoading && transactionData.length === 0) {
    return (
      <div className={styles.transactionList}>
        <h3>실거래가 정보</h3>
        <div className={styles.emptyState}>
          <p>실거래가 데이터가 없습니다.</p>
          <p>주소를 검색하고 &quot;실거래가 조회&quot; 버튼을 클릭해주세요.</p>
        </div>
      </div>
    );
  }

  // 디버깅용 로그 (필요시 주석 해제)
  console.log('렌더링 시작 - transactionData.length:', transactionData.length);

  return (
    <div className={styles.transactionList}>
      <div className={styles.transactionHeader}>
        <h3>실거래가 정보</h3>
        <span className={styles.transactionCount}>
          총 {transactionData.length}건
        </span>
      </div>
      <div className={styles.transactionItems}>
        {transactionData.slice(0, 10).map((item, index) => (
          <div
            key={index}
            className={styles.transactionItem}
            onClick={() => {
              if (item.location) {
                handleTransactionClick(item.location);
              }
            }}
            style={{ cursor: item.location ? 'pointer' : 'default' }}
          >
            <div className={styles.transactionTitle}>
              {item.아파트 || '부동산'}
            </div>
            <div className={styles.transactionDetails}>
              <span>
                거래금액: {item.거래금액 ? `${item.거래금액}만원` : '전월세'}
              </span>
              <span>면적: {item.전용면적}㎡</span>
              <span>층수: {item.층}층</span>
            </div>
            <div className={styles.transactionDate}>
              {item.년 && item.월 && item.일
                ? `${item.년}.${item.월}.${item.일}`
                : ''}
            </div>
            <div className={styles.transactionAddress}>
              {item.법정동} {item.지번}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
