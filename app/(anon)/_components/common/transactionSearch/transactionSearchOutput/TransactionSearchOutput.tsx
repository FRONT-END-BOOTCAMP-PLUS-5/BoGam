'use client';

import React from 'react';
import { TransactionSearchOutputProps } from '../types';
import { styles } from './TransactionSearchOutput.styles';
import Button from '@/(anon)/_components/common/button/Button';
import { formatToKoreanUnit } from '@utils/formatUtils';

interface AveragePriceByArea {
  area: number;
  averagePrice: number;
  count: number;
}

interface TransactionSearchOutputExtendedProps extends TransactionSearchOutputProps {
  averagePricesByArea: AveragePriceByArea[];
  targetArea: string;
  targetPrice: number;
  onNewSearch: () => void;
}

export const TransactionSearchOutput = ({
  response,
  averagePricesByArea,
  targetArea,
  targetPrice,
  onNewSearch,
}: TransactionSearchOutputExtendedProps) => {
  // 매매 거래금액 문자열을 숫자로 변환하는 함수
  const parsePrice = (price: string | number): number => {
    if (typeof price === 'number') {
      return price / 100000000;
    }

    if (price.includes('보증금')) {
      return 0;
    }

    const match = price.match(/(\d+)억(\d+)천?만?/);
    if (match) {
      const billion = parseInt(match[1]);
      const thousand = parseInt(match[2]) / 10;
      return billion + thousand;
    }

    const billionOnly = price.match(/(\d+)억/);
    if (billionOnly) {
      return parseInt(billionOnly[1]);
    }

    const thousandOnly = price.match(/(\d+)천?만?/);
    if (thousandOnly) {
      const thousand = parseInt(thousandOnly[1]) / 10;
      return thousand;
    }

    return 0;
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `${price.toFixed(2)}억`;
    } else if (price >= 0.1) {
      return `${(price * 10).toFixed(1)}천만원`;
    } else {
      return `${(price * 10000).toFixed(0)}만원`;
    }
  };

  // 분석 카드 렌더링 함수
  const renderAnalysisCard = () => {
    if (!targetArea || targetPrice <= 0 || averagePricesByArea.length === 0) {
      return null;
    }

    const targetAreaNum = parseFloat(targetArea);
    if (isNaN(targetAreaNum)) return null;

    const mostSimilarArea = averagePricesByArea.reduce((prev, curr) => {
      return Math.abs(curr.area - targetAreaNum) < Math.abs(prev.area - targetAreaNum)
        ? curr
        : prev;
    });

    const targetPriceNum = parsePrice(targetPrice);
    if (targetPriceNum === 0) return null;

    const ratio = targetPriceNum / mostSimilarArea.averagePrice;
    const percentage = (ratio * 100).toFixed(1);
    const isDangerous = ratio > 0.9;

    return (
      <div className={styles.analysisCard}>
        <h4 className={styles.analysisTitle}>📊 거래 분석 결과</h4>
        <div className={styles.analysisContent}>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>입력한 전용면적:</span>
            <span className={styles.analysisValue}>{targetArea}㎡</span>
          </div>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>입력한 전세 거래가:</span>
            <span className={styles.analysisValue}>
              {targetPrice > 0 ? formatToKoreanUnit(targetPrice) : ''}
            </span>
          </div>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>유사한 전용면적:</span>
            <span className={styles.analysisValue}>
              {mostSimilarArea.area}㎡
            </span>
          </div>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>해당 면적 매매 평균가:</span>
            <span className={styles.analysisValue}>
              {formatPrice(mostSimilarArea.averagePrice)}
            </span>
          </div>

          {isDangerous ? (
            <div className={styles.analysisWarning}>
              <div className={styles.warningTitle}>⚠️ 주의!</div>
              <div className={styles.warningText}>
                전세 거래가가 매매 평균가에 맞먹습니다!
              </div>
              <div className={styles.warningSubText}>
                전세 거래가 / 매매 평균가 = {percentage}%
              </div>
            </div>
          ) : (
            <div className={styles.analysisSafe}>
              <div className={styles.safeTitle}>✅ 안전</div>
              <div className={styles.safeText}>
                전세 거래가가 매매 평균가의 {percentage}%입니다.
              </div>
              <div className={styles.safeSubText}>
                크게 위험한 수준이 아닙니다.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const transactionData = response?.data || [];

  return (
    <div className={styles.container}>
      <div className={styles.resultsHeader}>
        <h3 className={styles.resultsTitle}>
          검색 결과 ({transactionData.length}건)
        </h3>
        <Button
          onClick={onNewSearch}
          variant='secondary'
          className={styles.newSearchButton}
        >
          새로 검색
        </Button>
      </div>

      {/* 분석 카드 */}
      {renderAnalysisCard()}

      {/* 데이터가 없을 때 */}
      {transactionData.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>
            아직 검색 결과가 없습니다.
          </div>
          <div className={styles.emptyStateSubtitle}>
            조회 탭에서 실거래가를 검색해보세요.
          </div>
        </div>
      )}

      {/* 전용면적별 평균가 */}
      {averagePricesByArea.length > 0 && (
        <div className={styles.averagePrices}>
          <h4 className={styles.averagePricesTitle}>전용면적별 평균가</h4>
          <div className={styles.averagePricesGrid}>
            {averagePricesByArea.map((item) => (
              <div key={item.area} className={styles.averagePriceCard}>
                <div className={styles.averagePriceContent}>
                  <div className={styles.averagePriceArea}>
                    {item.area}㎡
                  </div>
                  <div className={styles.averagePriceValue}>
                    {formatPrice(item.averagePrice)}
                  </div>
                  <div className={styles.averagePriceCount}>
                    {item.count}건 거래
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
