'use client';

import { GetJeonseGuaranteeResponseDto } from '@be/applications/jeonseGuarantees/dtos/GetJeonseGuaranteeResponseDto';
import { styles } from './JeonseGuaranteeResult.styles';

interface JeonseGuaranteeResultProps {
  result: GetJeonseGuaranteeResponseDto | null;
  isLoading: boolean;
  error: string | null;
}

export default function JeonseGuaranteeResult({ result, isLoading, error }: JeonseGuaranteeResultProps) {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>조회 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorTitle}>오류 발생</div>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className={styles.resultContainer}>
      {/* 헤더 정보 */}
      <div className={styles.headerContainer}>
        <div className={styles.headerGrid}>
          <div>
            <span className={styles.headerLabel}>결과코드:</span>
            <span className={styles.headerValue}>
              {result.header.resultCode}
            </span>
          </div>
          <div>
            <span className={styles.headerLabel}>결과메시지:</span>
            <span className={styles.headerValue}>
              {result.header.resultMsg}
            </span>
          </div>
          <div>
            <span className={styles.headerLabel}>총 개수:</span>
            <span className={styles.headerValue}>
              {result.totalCount.toLocaleString()}건
            </span>
          </div>
          <div>
            <span className={styles.headerLabel}>페이지:</span>
            <span className={styles.headerValue}>
              {result.pageNo} / {Math.ceil(result.totalCount / result.numOfRows)}
            </span>
          </div>
        </div>
      </div>

      {/* 결과 목록 */}
      {result.items.length > 0 ? (
        <div className={styles.resultListSection}>
          <h3 className={styles.resultListTitle}>추천 상품 목록</h3>
          {result.items.map((item, index) => (
            <div key={index} className={styles.resultItemContainer}>
              <div className={styles.resultItemHeader}>
                <div className="flex items-center space-x-3">
                  <span className={styles.rankBadge}>
                    {item.rcmdProrRnk}순위
                  </span>
                  <span className={styles.guaranteeTypeText}>
                    보증구분: {item.grntDvcd}
                  </span>
                </div>
              </div>
              
              <div className={styles.resultItemGrid}>
                <div>
                  <div className={styles.resultItemLabel}>최대보증한도</div>
                  <div className={styles.resultItemValue}>
                    {parseInt(item.grntLmtAmt).toLocaleString()}원
                  </div>
                </div>
                <div>
                  <div className={styles.resultItemLabel}>최대대출한도</div>
                  <div className={styles.resultItemValue}>
                    {parseInt(item.loanLmtAmt).toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyResultContainer}>
          <div className={styles.emptyResultTitle}>조회 결과가 없습니다</div>
          <div className={styles.emptyResultMessage}>
            검색 조건을 변경해보세요
          </div>
        </div>
      )}
    </div>
  );
}
