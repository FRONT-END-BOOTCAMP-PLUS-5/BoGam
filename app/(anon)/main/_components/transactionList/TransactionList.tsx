import React, { useEffect } from 'react';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { styles } from './TransactionList.styles';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { useMapStore } from '@libs/stores/map/mapStore';

export const TransactionList: React.FC = () => {
  const { transactionData, isLoading } = useTransactionDataStore(
    (state) => state
  );
  const { setMapCenter, setAdjustBounds } = useMapStore();

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    console.log('🔍 TransactionList 렌더링 - transactionData:', {
      length: transactionData.length,
      data: transactionData,
      isLoading,
    });
  }, [transactionData, isLoading]);

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
              } else {
                console.log('실거래가 클릭 - 좌표 정보 없음');
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
