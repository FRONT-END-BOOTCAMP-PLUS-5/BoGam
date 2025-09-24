'use client';

import { styles } from './BrokerListContent.styles';

interface BrokerData {
  brkrNm: string;
  bsnmCmpnm?: string;
  brkrAddr?: string;
  telNo?: string;
  [key: string]: unknown;
}

interface BrokerListContentProps {
  brokerData: BrokerData[];
  onSelectBroker: (broker: BrokerData) => void;
}

export const BrokerListContent = ({
  brokerData,
  onSelectBroker,
}: BrokerListContentProps) => {
  if (!brokerData || brokerData.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>조회된 중개업자가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        조회된 중개업자 중 안전도를 검사할 업체를 선택해주세요:
      </p>
      <div className={styles.brokerList}>
        {brokerData.map((broker, index) => (
          <div
            key={index}
            className={styles.brokerItem}
            onClick={() => onSelectBroker(broker)}
          >
            <div className={styles.brokerInfo}>
              <h3 className={styles.brokerName}>{broker.brkrNm}</h3>
              {broker.bsnmCmpnm && (
                <p className={styles.brokerCompany}>
                  <strong>상호:</strong> {broker.bsnmCmpnm}
                </p>
              )}
              {broker.brkrAddr && (
                <p className={styles.brokerAddress}>
                  <strong>주소:</strong> {broker.brkrAddr}
                </p>
              )}
              {broker.telNo && (
                <p className={styles.brokerPhone}>
                  <strong>연락처:</strong> {broker.telNo}
                </p>
              )}
            </div>
            <div className={styles.selectButton}>
              <span>선택</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
