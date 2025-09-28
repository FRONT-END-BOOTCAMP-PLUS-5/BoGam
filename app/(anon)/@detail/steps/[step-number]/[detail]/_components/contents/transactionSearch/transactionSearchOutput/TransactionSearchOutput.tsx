'use client';

import React, { useEffect, useRef } from 'react';
import { TransactionSearchOutputProps } from '../types';
import { styles } from './TransactionSearchOutput.styles';
import Button from '@/(anon)/_components/common/button/Button';
import { formatToKoreanUnit } from '@utils/formatUtils';
import { formatPrice } from '@utils/main/transactionUtils';
import { useGetTransactionSearchCopy } from '@/hooks/useTransactionSearch';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

interface AveragePriceByArea {
  area: number;
  averagePrice: number;
  count: number;
}

interface TransactionSearchOutputExtendedProps extends TransactionSearchOutputProps {
  averagePricesByArea: AveragePriceByArea[];
  targetArea: string;
  targetPrice: number;
  complexName: string;
  onNewSearch: () => void;
  onSaveResult: () => void;
}

export const TransactionSearchOutput = ({
  response,
  loading,
  averagePricesByArea,
  targetArea,
  targetPrice,
  complexName,
  onNewSearch,
  onSaveResult,
}: TransactionSearchOutputExtendedProps) => {
  const { selectedAddress } = useUserAddressStore();
  
  // DB에서 저장된 데이터 조회
  const { data: savedData, isLoading: isSavedDataLoading, error: savedDataError } = useGetTransactionSearchCopy(
    selectedAddress?.nickname || null
  );


  const hasSaved = useRef(false);

  // 결과가 완료되었을 때 한 번만 저장
  useEffect(() => {
    if (!loading && response?.data && response.data.length > 0 && !hasSaved.current) {
      onSaveResult();
      hasSaved.current = true;
    }
  }, [loading, response, onSaveResult]);

  // 저장된 데이터가 있으면 그것을 사용, 없으면 현재 props 사용
  // 파싱
  const displayData = savedData?.data ? (typeof savedData.data === 'string' ? JSON.parse(savedData.data) : savedData.data) : null;

  // 로딩 중일 때 로딩 UI 표시 (실거래가 검색 로딩 또는 저장된 데이터 조회 로딩)
  if (loading || isSavedDataLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>
            {loading ? '실거래가 데이터를 불러오고 있습니다' : '저장된 데이터를 불러오고 있습니다'}
          </div>
        </div>
      </div>
    );
  }



  // 분석 카드 렌더링 함수
  const renderAnalysisCard = () => {
    // 저장된 데이터가 있으면 그것을 사용, 없으면 현재 props 사용
    const data = displayData || {
      complexName,
      targetArea: parseFloat(targetArea),
      targetPrice: targetPrice / 100000000,
      similarArea: averagePricesByArea.length > 0 ? averagePricesByArea[0].area : undefined,
      averagePrice: averagePricesByArea.length > 0 ? averagePricesByArea[0].averagePrice : undefined,
      searchResultCount: response?.data?.length || 0,
      areaAveragePrices: averagePricesByArea.map(item => ({
        area: item.area,
        averagePrice: item.averagePrice,
        transactionCount: item.count,
      })),
    };


    if (!data.targetArea || data.targetPrice <= 0) {
      return null;
    }

    const targetAreaNum = data.targetArea;
    const targetPriceNum = data.targetPrice;

    // 유사한 면적과 평균가가 있으면 사용
    const similarArea = data.similarArea;
    const averagePrice = data.averagePrice;

    if (!similarArea || !averagePrice) return null;

    const ratio = targetPriceNum / averagePrice;
    const percentage = (ratio * 100).toFixed(1);
    const isDangerous = ratio > 0.9;

    return (
      <div className={styles.analysisCard}>
        <h4 className={styles.analysisTitle}>📊 거래 분석 결과</h4>
        <div className={styles.analysisContent}>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>단지명:</span>
            <span className={styles.analysisValue}>{data.complexName}</span>
          </div>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>입력한 전용면적:</span>
            <span className={styles.analysisValue}>{targetAreaNum}㎡</span>
          </div>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>입력한 전세 거래가:</span>
            <span className={styles.analysisValue}>
              {targetPriceNum > 0 ? formatToKoreanUnit(targetPriceNum * 100000000) : ''}
            </span>
          </div>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>유사한 전용면적:</span>
            <span className={styles.analysisValue}>
              {similarArea}㎡
            </span>
          </div>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>해당 면적 매매 평균가:</span>
            <span className={styles.analysisValue}>
              {formatPrice(averagePrice)}
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

  // 저장된 데이터가 있으면 그것을 사용, 없으면 현재 props 사용
  const data = displayData || {
    searchResultCount: response?.data?.length || 0,
    areaAveragePrices: averagePricesByArea.map(item => ({
      area: item.area,
      averagePrice: item.averagePrice,
      transactionCount: item.count,
    })),
  };

  const transactionData = response?.data || [];
  const displayCount = data.searchResultCount || transactionData.length;

  return (
    <div className={styles.container}>
      <div className={styles.resultsHeader}>
        <h3 className={styles.resultsTitle}>
          검색 결과 ({displayCount}건)
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
      {displayCount === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>
            매매 거래 검색 결과가 없습니다.
          </div>
          <div className={styles.emptyStateSubtitle}>
            조회 탭에서 실거래가를 검색해보세요.
          </div>
        </div>
      )}

      {/* 전용면적별 평균가 */}
      {data.areaAveragePrices && data.areaAveragePrices.length > 0 && (
        <div className={styles.averagePrices}>
          <h4 className={styles.averagePricesTitle}>전용면적별 평균가</h4>
          <div className={styles.averagePricesGrid}>
            {data.areaAveragePrices.map((item: { area: number; averagePrice: number; transactionCount: number }) => (
              <div key={item.area} className={styles.averagePriceCard}>
                <div className={styles.averagePriceContent}>
                  <div className={styles.averagePriceArea}>
                    {item.area}㎡
                  </div>
                  <div className={styles.averagePriceValue}>
                    {formatPrice(item.averagePrice)}
                  </div>
                  <div className={styles.averagePriceCount}>
                    {item.transactionCount}건 거래
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
