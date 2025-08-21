import React from 'react';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { styles } from './TransactionList.styles';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { useMapStore } from '@libs/stores/map/mapStore';

// 전월세 데이터 타입 정의
interface RentTransactionData {
  id: string;
  아파트: string;
  거래금액: string;
  전용면적: string;
  층: string;
  건축년도: string;
  년: string;
  월: string;
  일: string;
  법정동: string;
  지번: string;
  location: Location | null;
  보증금: string;
  월세: string;
  계약구분: string;
  계약시작일: string;
  계약종료일: string;
  종전보증금: string;
  종전월세: string;
}

// 타입 가드 함수
const isRentData = (item: unknown): item is RentTransactionData => {
  return (
    typeof item === 'object' &&
    item !== null &&
    ('보증금' in item || '월세' in item)
  );
};

export const TransactionList: React.FC = () => {
  const { transactionData, isLoading } = useTransactionDataStore(
    (state) => state
  );
  const { setMapCenter, setAdjustBounds } = useMapStore();

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

  return (
    <div className={styles.transactionList}>
      <div className={styles.transactionHeader}>
        <h3>실거래가 정보</h3>
        <span className={styles.transactionCount}>
          총 {transactionData.length}건
        </span>
      </div>
      <div className={styles.transactionItems}>
        {transactionData.slice(0, 10).map((item, index) => {
          // 전월세 데이터인지 확인
          const isRent = isRentData(item);

          return (
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
              <div className={styles.transactionTitle}>{item.아파트}</div>
              <div className={styles.transactionDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>거래금액:</span>
                  <span className={styles.detailValue}>{item.거래금액}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>면적:</span>
                  <span className={styles.detailValue}>{item.전용면적}㎡</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>층수:</span>
                  <span className={styles.detailValue}>{item.층}층</span>
                </div>
                {/* 전월세 데이터인 경우 추가 정보 표시 */}
                {isRent && (
                  <>
                    {item.계약시작일 && item.계약종료일 && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>계약기간:</span>
                        <span className={styles.detailValue}>
                          {item.계약시작일} ~ {item.계약종료일}
                        </span>
                      </div>
                    )}
                    {item.계약구분 && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>계약구분:</span>
                        <span className={styles.detailValue}>
                          {item.계약구분}
                        </span>
                      </div>
                    )}
                    {item.종전보증금 && item.종전보증금 !== '0' && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>종전보증금:</span>
                        <span className={styles.detailValue}>
                          {item.종전보증금}만원
                        </span>
                      </div>
                    )}
                    {item.종전월세 && item.종전월세 !== '0' && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>종전월세:</span>
                        <span className={styles.detailValue}>
                          {item.종전월세}만원
                        </span>
                      </div>
                    )}
                  </>
                )}
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
          );
        })}
      </div>
    </div>
  );
};
