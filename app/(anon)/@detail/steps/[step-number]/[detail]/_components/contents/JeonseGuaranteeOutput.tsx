'use client';

import { GetJeonseGuaranteeResponseDto } from '@libs/api_front/jeonseGuarantee.api';
import { jeonseGuaranteeOutputStyles } from './JeonseGuaranteeOutput.styles';

interface JeonseGuaranteeOutputProps {
  data: GetJeonseGuaranteeResponseDto | undefined;
  isPending: boolean;
}

export default function JeonseGuaranteeOutput({
  data,
  isPending,
}: JeonseGuaranteeOutputProps) {
  return (
    <div className={jeonseGuaranteeOutputStyles.container}>
      <div className={jeonseGuaranteeOutputStyles.header}>
        <h3 className={jeonseGuaranteeOutputStyles.title}>보증한도 확인</h3>
        <p className={jeonseGuaranteeOutputStyles.subtitle}>
          조건에 맞는 전세자금보증한도를 확인해보세요.
        </p>
      </div>

      {isPending ? (
        <div className={jeonseGuaranteeOutputStyles.loadingContainer}>
          <div className={jeonseGuaranteeOutputStyles.loadingSpinner}></div>
          <p className={jeonseGuaranteeOutputStyles.loadingText}>
            전세자금보증상품을 조회하고 있습니다...
          </p>
          <p className={jeonseGuaranteeOutputStyles.loadingStatus}>
            로딩 상태: {isPending ? '진행 중' : '완료'}
          </p>
        </div>
      ) : data && data.items && data.items.length > 0 ? (
        <div>
          <div className={jeonseGuaranteeOutputStyles.dataContainer}>
            {data.items.map(
              (
                item: GetJeonseGuaranteeResponseDto['items'][0],
                index: number
              ) => (
                <div key={index} className={jeonseGuaranteeOutputStyles.card}>
                  <div className={jeonseGuaranteeOutputStyles.cardContent}>
                    <div className={jeonseGuaranteeOutputStyles.cardHeader}>
                      <div className={jeonseGuaranteeOutputStyles.cardIcon}>
                        <span
                          className={jeonseGuaranteeOutputStyles.cardIconText}
                        >
                          💰
                        </span>
                      </div>
                      <h4 className={jeonseGuaranteeOutputStyles.cardTitle}>
                        전세자금보증한도
                      </h4>
                    </div>

                    <div
                      className={jeonseGuaranteeOutputStyles.amountContainer}
                    >
                      <div
                        className={jeonseGuaranteeOutputStyles.amountContent}
                      >
                        <div
                          className={jeonseGuaranteeOutputStyles.amountValue}
                        >
                          {parseInt(item.grntLmtAmt).toLocaleString()}원
                        </div>
                        <div
                          className={jeonseGuaranteeOutputStyles.amountLabel}
                        >
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
        <div className={jeonseGuaranteeOutputStyles.emptyContainer}>
          <div className='mb-4'>
            <div className={jeonseGuaranteeOutputStyles.emptyIcon}>
              <span className={jeonseGuaranteeOutputStyles.emptyIconText}>
                📋
              </span>
            </div>
            <h4 className={jeonseGuaranteeOutputStyles.emptyTitle}>
              조회된 상품이 없습니다
            </h4>
            <p className={jeonseGuaranteeOutputStyles.emptyDescription}>
              입력하신 조건에 맞는 전세자금보증상품을 찾을 수 없습니다.
            </p>
            <p className={jeonseGuaranteeOutputStyles.emptyHint}>
              다른 조건으로 다시 조회해보세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
