'use client';

import { GetJeonseGuaranteeResponseDto } from '@libs/api_front/jeonseGuarantee.api';
import { styles } from './JeonseGuaranteeOutput.styles';

interface JeonseGuaranteeOutputProps {
  data: GetJeonseGuaranteeResponseDto | undefined;
  isPending: boolean;
}

export default function JeonseGuaranteeOutput({
  data,
  isPending,
}: JeonseGuaranteeOutputProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>보증한도 확인</h3>
        <p className={styles.subtitle}>
          조건에 맞는 전세자금보증한도를 확인해보세요.
        </p>
      </div>

      {isPending ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>
            전세자금보증상품을 조회하고 있습니다...
          </p>
          <p className={styles.loadingStatus}>
            로딩 상태: {isPending ? '진행 중' : '완료'}
          </p>
        </div>
      ) : data && data.items && data.items.length > 0 ? (
        <div>
          <div className={styles.dataContainer}>
            {data.items.map(
              (
                item: GetJeonseGuaranteeResponseDto['items'][0],
                index: number
              ) => (
                <div key={index} className={styles.card}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>
                        <span className={styles.cardIconText}>💰</span>
                      </div>
                      <h4 className={styles.cardTitle}>전세자금보증한도</h4>
                    </div>

                    <div className={styles.amountContainer}>
                      <div className={styles.amountContent}>
                        <div className={styles.amountValue}>
                          {parseInt(item.grntLmtAmt).toLocaleString()}원
                        </div>
                        <div className={styles.amountLabel}>
                          최대 보증 가능 금액
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className={styles.emptyContainer}>
          <div className='mb-4'>
            <div className={styles.emptyIcon}>
              <span className={styles.emptyIconText}>📋</span>
            </div>
            <h4 className={styles.emptyTitle}>조회된 상품이 없습니다</h4>
            <p className={styles.emptyDescription}>
              입력하신 조건에 맞는 전세자금보증상품을 찾을 수 없습니다.
            </p>
            <p className={styles.emptyHint}>다른 조건으로 다시 조회해보세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}
