import React from 'react';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { styles } from './TransactionList.styles';

interface TransactionListProps {
  transactionData: TransactionData[];
  onTransactionClick: (location: Location) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactionData,
  onTransactionClick,
}) => {
  if (transactionData.length === 0) {
    return null;
  }

  return (
    <div className={styles.transactionList}>
      <h3>실거래가 정보</h3>
      <div className={styles.transactionItems}>
        {transactionData.slice(0, 10).map((item, index) => (
          <div
            key={index}
            className={styles.transactionItem}
            onClick={() => {
              if (item.location) {
                console.log('실거래가 클릭 - 지도 이동:', item.location);
                onTransactionClick(item.location);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.transactionTitle}>
              {item.아파트 || '부동산'}
            </div>
            <div className={styles.transactionDetails}>
              <span>거래금액: {item.거래금액}</span>
              <span>면적: {item.전용면적}㎡</span>
              <span>층수: {item.층}층</span>
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
