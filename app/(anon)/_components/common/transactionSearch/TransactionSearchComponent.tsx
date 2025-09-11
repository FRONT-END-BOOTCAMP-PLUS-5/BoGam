'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTransactionManagement } from '@/hooks/main/useTransactionManagement';
import { useMainPageState } from '@/hooks/main/useMainPageState';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useStepResultMutations } from '@/hooks/useStepResultMutations';
import { parseAddressString } from '@utils/main/addressUtils';
import { parseStepUrl } from '@utils/stepUrlParser';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { DanjiSerialNumberContent } from '@/(anon)/_components/common/modal/DanjiSerialNumberContent';
import Button from '@/(anon)/_components/common/button/Button';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';
import { DropDown } from '@/(anon)/_components/common/dropdown/DropDown';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { TabNavigation } from '@/(anon)/_components/common/broker/tabNavigation/TabNavigation';
import { styles } from './TransactionSearchComponent.styles';

// 실제 API 응답 구조에 맞춘 타입
interface ActualDanjiInfo {
  commBuildingCode: string;
  resBuildingName: string;
  commAddrLotNumber: string;
  resBunji: string;
  commAddrRoadName: string;
}

interface TransactionSearchComponentProps {
  className?: string;
}

  // 평수별 평균가 계산을 위한 타입
  interface AveragePriceByArea {
    area: number;
    averagePrice: number;
    count: number;
  }

export const TransactionSearchComponent: React.FC<TransactionSearchComponentProps> = ({
  className = '',
}) => {
  const [parsedAddress, setParsedAddress] = useState({
    addrSido: '',
    addrSigungu: '',
    addrDong: '',
  });
  const [complexName, setComplexName] = useState('');
  const [danjiName, setDanjiName] = useState('');
  const [selectedType, setSelectedType] = useState('0'); // 0: 아파트, 1: 연립/다세대, 2: 오피스텔
  const [showDanjiModal, setShowDanjiModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [targetArea, setTargetArea] = useState(''); // 거래하려는 집 전용면적
  const [targetPrice, setTargetPrice] = useState(''); // 전세 거래금액

  // URL에서 stepNumber와 detail 가져오기 (parseStepUrl 사용)
  const pathname = window.location.pathname;
  const stepInfo = parseStepUrl(pathname);
  const stepNumber = stepInfo?.stepNumber || 1;
  const detail = stepInfo?.detail || 6;

  // Hook들 사용
  const { selectedAddress } = useUserAddressStore();
  const { 
    transactionData, 
    isLoading, 
    handleMoveToAddress
  } = useTransactionManagement();
  const { selectedYear, setSelectedYear } = useMainPageState();
  
  // 실거래가 결과 저장 훅 (기존 useStepResultMutations 사용)
  const { upsertStepResult, isLoading: isSaving } = useStepResultMutations();

  // 선택된 주소가 변경될 때마다 주소 파싱
  useEffect(() => {
    if (selectedAddress) {
      const address = selectedAddress.completeAddress || selectedAddress.roadAddress || '';
      const parsed = parseAddressString(address);
      setParsedAddress(parsed);
    }
  }, [selectedAddress]);

  // 매매 거래금액 문자열을 숫자로 변환하는 함수 (보증금 제외)
  const parsePrice = (price: string): number => {
    // 보증금이 포함된 데이터는 제외 (전월세 거래)
    if (price.includes('보증금')) {
      return 0;
    }
    
    // "7억3천만" -> 7.3억
    const match = price.match(/(\d+)억(\d+)천?만?/);
    if (match) {
      const billion = parseInt(match[1]); // 억
      const thousand = parseInt(match[2]) / 10;  // 천만 → 0.1억
      return billion + thousand;
    }
    
    // "7억" -> 7억
    const billionOnly = price.match(/(\d+)억/);
    if (billionOnly) {
      return parseInt(billionOnly[1]);
    }
    
    // "5천만" -> 0.5억 (억이 없는 경우)
    const thousandOnly = price.match(/(\d+)천?만?/);
    if (thousandOnly) {
      const thousand = parseInt(thousandOnly[1]) / 10;  // 천만 → 0.1억
      return thousand;
    }
    
    return 0;
  };

  // 트랜잭션 데이터가 완료되면 결과 탭으로 이동하고 분석 결과 저장
  useEffect(() => {
    if (transactionData.length > 0) {
      setActiveTab('output');
      // 검색 완료 후 한 번만 분석 결과 저장
      saveAnalysisResult();
    }
  }, [transactionData]);

  // 전용면적별 평균가 계산 (매매 거래만)
  const averagePricesByArea: AveragePriceByArea[] = useMemo(() => {
    if (transactionData.length === 0) return [];

    // API 응답 데이터 구조 확인 (첫 번째 데이터만)
    if (transactionData.length > 0) {
      // API 응답 데이터 구조 확인
    }

    const areaGroups: { [key: string]: TransactionData[] } = {};
    
    transactionData.forEach((transaction) => {
      // 보증금이 포함된 거래는 제외 (전월세 거래)
      if (transaction.거래금액.includes('보증금')) {
        return;
      }
      
      // 전용면적 처리 (문자열 → 숫자)
      let area: number | null = null;
      if (transaction.전용면적) {
        const parsedArea = parseFloat(transaction.전용면적);
        if (!isNaN(parsedArea)) {
          // 전용면적(㎡) 그대로 사용, 소수점 첫째 자리까지 반올림하여 그룹화
          area = Math.round(parsedArea * 10) / 10;
        }
      }
      
      if (area !== null) {
        // areaGroups의 키로 사용할 때는 문자열로 변환 (객체 키는 문자열이어야 함)
        const areaKey = area.toString();
        if (!areaGroups[areaKey]) {
          areaGroups[areaKey] = [];
        }
        areaGroups[areaKey].push(transaction);
      }
    });

    const result: AveragePriceByArea[] = Object.entries(areaGroups)
      .map(([areaKey, transactions]) => {
        const totalPrice = transactions.reduce((sum, t) => {
          const price = parsePrice(t.거래금액);
          return sum + price;
        }, 0);
        const averagePrice = totalPrice / transactions.length; // 반올림 제거, 소수점 유지
        
        return {
          area: parseFloat(areaKey), // 문자열을 숫자로 변환
          averagePrice,
          count: transactions.length
        };
      })
      .sort((a, b) => a.area - b.area);
    
    return result;
  }, [transactionData]);

  // 분석 결과 자동 저장 함수
  const saveAnalysisResult = () => {
    if (
      targetArea && 
      targetPrice && 
      averagePricesByArea.length > 0 && 
      selectedAddress?.nickname && 
      !isSaving
    ) {
      const targetAreaNum = parseFloat(targetArea);
      if (isNaN(targetAreaNum)) return;

      // 입력한 전용면적과 가장 유사한 면적 찾기
      const mostSimilarArea = averagePricesByArea.reduce((prev, curr) => {
        return Math.abs(curr.area - targetAreaNum) < Math.abs(prev.area - targetAreaNum) ? curr : prev;
      });

      // 전세 거래가를 숫자로 변환
      const targetPriceNum = parsePrice(targetPrice);
      if (targetPriceNum === 0) return;

      // 비율 계산
      const ratio = targetPriceNum / mostSimilarArea.averagePrice;
      
      // 90% 이상이면 mismatch, 90% 미만이면 match
      const result: 'match' | 'mismatch' = ratio >= 0.9 ? 'mismatch' : 'match';
      const jsonDetails = { '깡통주택': result };
      
      upsertStepResult.mutate({
        userAddressNickname: selectedAddress.nickname,
        stepNumber,
        detail,
        jsonDetails,
      });
    }
  };

  // 주소 표시 로직
  const displayAddress = selectedAddress?.roadAddress || selectedAddress?.lotAddress || '';

  const handleFetchComplex = () => {
    setShowDanjiModal(true);
  };

  const handleDanjiSelect = (danji: ActualDanjiInfo) => {
    setComplexName(danji.commBuildingCode);
    setDanjiName(danji.resBuildingName);
    setShowDanjiModal(false);
  };

  const handleTransactionSearch = () => {
    if (selectedAddress) {
      handleMoveToAddress(selectedType, complexName);
    }
  };

  const formatPrice = (price: number) => {
    // price는 이미 억 단위로 변환되어 있음
    if (price >= 1) {
      return `${price.toFixed(2)}억`; // 소수점 둘째 자리까지 표시
    } else if (price >= 0.1) {
      return `${(price * 10).toFixed(1)}천만원`; // 소수점 첫째 자리까지 표시
    } else {
      return `${(price * 10000).toFixed(0)}만원`;
    }
  };

  // 분석 카드 렌더링 함수
  const renderAnalysisCard = () => {
    if (!targetArea || !targetPrice || averagePricesByArea.length === 0) {
      return null;
    }

    const targetAreaNum = parseFloat(targetArea);
    if (isNaN(targetAreaNum)) return null;

    // 입력한 전용면적과 가장 유사한 면적 찾기
    const mostSimilarArea = averagePricesByArea.reduce((prev, curr) => {
      return Math.abs(curr.area - targetAreaNum) < Math.abs(prev.area - targetAreaNum) ? curr : prev;
    });

    // 전세 거래가를 숫자로 변환
    const targetPriceNum = parsePrice(targetPrice);
    if (targetPriceNum === 0) return null;

    // 비율 계산
    const ratio = targetPriceNum / mostSimilarArea.averagePrice;
    const percentage = (ratio * 100).toFixed(1);

    // 위험도 판단 (90% 이상이면 mismatch, 90% 미만이면 match)
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
            <span className={styles.analysisValue}>{targetPrice}</span>
          </div>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>유사한 전용면적:</span>
            <span className={styles.analysisValue}>{mostSimilarArea.area}㎡</span>
          </div>
          <div className={styles.analysisRow}>
            <span className={styles.analysisLabel}>해당 면적 매매 평균가:</span>
            <span className={styles.analysisValue}>{formatPrice(mostSimilarArea.averagePrice)}</span>
          </div>
          
                     {isDangerous ? (
             <div className={styles.analysisWarning}>
               <div className={styles.warningTitle}>⚠️ 주의!</div>
               <div className={styles.warningText}>전세 거래가가 매매 평균가에 맞먹습니다!</div>
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
           
           {/* 자동 저장 상태 표시 */}
           {isSaving && (
             <div className={styles.savingContainer}>
               <div className={styles.savingText}>
                 📝 결과를 자동으로 저장하고 있습니다...
               </div>
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className={`transaction-search-component ${className}`}>
      {/* 탭 네비게이션 */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

              {/* 탭 컨텐츠 */}
        <div className={styles.tabContent}>
          {activeTab === 'input' ? (
            /* 검색 폼 */
            <div className={styles.searchForm}>
              <h3 className={styles.formTitle}>실거래가 조회</h3>
            
            {/* 주소 정보 표시 */}
            {displayAddress && (
              <div className={styles.addressDisplay}>
                <label className={styles.formLabel}>선택된 주소:</label>
                <div className={styles.addressValue}>{displayAddress}</div>
              </div>
            )}

            {/* 조회 년도 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>조회 년도:</label>
              <DropDown
                value={selectedYear}
                onChange={(value) => setSelectedYear(value)}
                options={[
                  { value: '2025', label: '2025' },
                  { value: '2024', label: '2024' },
                  { value: '2023', label: '2023' },
                  { value: '2022', label: '2022' },
                  { value: '2021', label: '2021' },
                  { value: '2020', label: '2020' },
                ]}
              />
            </div>

            {/* 건물 타입 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>건물 타입:</label>
              <DropDown
                value={selectedType}
                onChange={(value) => setSelectedType(value)}
                options={[
                  { value: '0', label: '아파트' },
                  { value: '1', label: '연립/다세대' },
                  { value: '2', label: '오피스텔' },
                ]}
              />
            </div>

                         {/* 단지명 */}
             <div className={styles.formGroup}>
               <label className={styles.formLabel}>단지명:</label>
               <div className={styles.complexInputGroup}>
                 <div className={styles.complexDisplay}>
                   {danjiName || '세밀한 검색을 위한 단지명 검색'}
                 </div>
                 <Button 
                   onClick={handleFetchComplex} 
                   variant='primary'
                   className={styles.fetchButton}
                 >
                   가져오기
                 </Button>
               </div>
               {!danjiName && (
                 <p className={styles.danjiHint}>
                   * 아파트, 연립/다세대, 오피스텔 검색을 위해서는 단지명이 필요합니다
                 </p>
               )}
             </div>

                           {/* 거래하려는 집 정보 */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>거래하려는 집 전용면적 (㎡):</label>
                <TextInput
                  type="number"
                  step="0.1"
                  min="0"
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  placeholder="예: 84.5"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>전세 거래금액:</label>
                <TextInput
                  type="text"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="예: 5억5천만"
                />
                <p className={styles.priceHint}>
                  * &ldquo;억&rdquo;, &ldquo;천만&rdquo; 단위로 입력해주세요 (예: 5억5천만, 3억)
                </p>
              </div>

            {/* 실거래가 조회 버튼 */}
            <div className={styles.searchButtonContainer}>
              <Button
                onClick={handleTransactionSearch}
                disabled={!parsedAddress.addrSido || !parsedAddress.addrSigungu || isLoading || !complexName}
                variant='primary'
                className={styles.searchButton}
              >
                {isLoading ? '조회 중...' : '실거래가 조회하기'}
              </Button>
              {!complexName && (
                <p className={styles.complexError}>
                  단지명을 먼저 검색해주세요
                </p>
              )}
            </div>
          </div>
        ) : (
                     /* 검색 결과 */
                       <div className={styles.searchResults}>
              <div className={styles.resultsHeader}>
                <h3 className={styles.resultsTitle}>검색 결과 ({transactionData.length}건)</h3>
                <Button
                  onClick={() => setActiveTab('input')}
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
                            <div className={styles.averagePriceArea}>{item.area}㎡</div>
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
        )}
      </div>

      {/* 단지 일련번호 조회 모달 */}
      <ConfirmModal
        isOpen={showDanjiModal}
        onCancel={() => setShowDanjiModal(false)}
        title='단지 일련번호 조회'
        icon='info'
        cancelText='닫기'
        onConfirm={() => {}}
      >
        <DanjiSerialNumberContent
          searchParams={{
            addrSido: parsedAddress.addrSido,
            addrSigungu: parsedAddress.addrSigungu,
            addrDong: parsedAddress.addrDong,
          }}
          onSelect={handleDanjiSelect}
        />
      </ConfirmModal>
      
      {/* 하단 여백 추가 - 밑부분이 잘리지 않도록 */}
      <div className={styles.bottomSpacer}></div>
    </div>
  );
};
