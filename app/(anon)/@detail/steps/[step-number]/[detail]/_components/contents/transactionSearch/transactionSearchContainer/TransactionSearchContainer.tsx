'use client';

import React, { forwardRef, useImperativeHandle, useEffect, useState, useCallback } from 'react';
import { TransactionSearchInput } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/transactionSearch/transactionSearchInput/TransactionSearchInput';
import { TransactionSearchOutput } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/transactionSearch/transactionSearchOutput/TransactionSearchOutput';
import { TransactionSearchFormData } from '../types';
import { DataContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/container/DataContainer';
import { useTransactionManagement } from '@/hooks/main/useTransactionManagement';
import { useMainPageState } from '@/hooks/main/useMainPageState';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useStepResultMutations } from '@/hooks/useStepResultMutations';
import { parseAddressString } from '@utils/main/addressUtils';
import { parseStepUrl } from '@utils/stepUrlParser';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { DanjiSerialNumberContent } from '@/(anon)/_components/common/modal/DanjiSerialNumberContent';

export interface TransactionSearchContainerRef {
  handleTransactionSearch: () => void;
}

export const TransactionSearchContainer = forwardRef<
  TransactionSearchContainerRef
>((_, ref) => {
  const [parsedAddress, setParsedAddress] = useState({
    addrSido: '',
    addrSigungu: '',
    addrDong: '',
  });
  const [complexName, setComplexName] = useState('');
  const [danjiName, setDanjiName] = useState('');
  const [selectedType, setSelectedType] = useState('0');
  const [targetArea, setTargetArea] = useState('');
  const [targetPrice, setTargetPrice] = useState(0);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [showDanjiModal, setShowDanjiModal] = useState(false);

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepInfo = parseStepUrl(pathname);
  const stepNumber = stepInfo?.stepNumber || 1;
  const detail = stepInfo?.detail || 6;

  // Hook들 사용
  const { selectedAddress } = useUserAddressStore();
  const { transactionData, isLoading, handleMoveToAddress } = useTransactionManagement();
  const { selectedYear, setSelectedYear } = useMainPageState();
  const { upsertStepResult, isLoading: isSaving } = useStepResultMutations();

  // 선택된 주소가 변경될 때마다 주소 파싱
  useEffect(() => {
    if (selectedAddress) {
      const address = selectedAddress.completeAddress || selectedAddress.roadAddress || '';
      const parsed = parseAddressString(address);
      setParsedAddress(parsed);
    }
  }, [selectedAddress]);


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

  // 전용면적별 평균가 계산 (사용되지 않음 - AreaGroup 사용)

  interface AreaGroup {
    area: number;
    transactions: TransactionData[];
  }

  const averagePricesByArea = transactionData.reduce((acc: AreaGroup[], transaction) => {
    if (transaction.거래금액.includes('보증금')) {
      return acc;
    }

    let area: number | null = null;
    if (transaction.전용면적) {
      const parsedArea = parseFloat(transaction.전용면적);
      if (!isNaN(parsedArea)) {
        area = Math.round(parsedArea * 10) / 10;
      }
    }

    if (area !== null) {
      const existingGroup = acc.find(item => item.area === area);
      
      if (existingGroup) {
        existingGroup.transactions.push(transaction);
      } else {
        acc.push({
          area,
          transactions: [transaction]
        });
      }
    }

    return acc;
  }, []).map(group => {
    const totalPrice = group.transactions.reduce((sum: number, t: TransactionData) => {
      // 거래금액원본을 억 단위로 변환 (만원 -> 억)
      const price = parseInt(t.거래금액원본) / 10000;
      return sum + price;
    }, 0);
    
    return {
      area: group.area,
      averagePrice: totalPrice / group.transactions.length,
      count: group.transactions.length,
    };
  }).sort((a, b) => a.area - b.area);

  // 분석 결과 자동 저장 함수
  const saveAnalysisResult = useCallback(() => {
    if (
      targetArea &&
      targetPrice > 0 &&
      averagePricesByArea.length > 0 &&
      selectedAddress?.nickname &&
      !isSaving
    ) {
      const targetAreaNum = parseFloat(targetArea);
      if (isNaN(targetAreaNum)) return;

      const mostSimilarArea = averagePricesByArea.reduce((prev, curr) => {
        return Math.abs(curr.area - targetAreaNum) < Math.abs(prev.area - targetAreaNum)
          ? curr
          : prev;
      });

      const targetPriceNum = parsePrice(targetPrice);
      if (targetPriceNum === 0) return;

      const ratio = targetPriceNum / mostSimilarArea.averagePrice;
      const result: 'match' | 'mismatch' = ratio >= 0.9 ? 'mismatch' : 'match';
      const jsonDetails = { 깡통주택: result };

      upsertStepResult.mutate({
        userAddressNickname: selectedAddress.nickname,
        stepNumber,
        detail,
        jsonDetails,
      });
    }
  }, [targetArea, targetPrice, averagePricesByArea, selectedAddress?.nickname, isSaving, upsertStepResult, stepNumber, detail]);

  // 트랜잭션 데이터가 완료되면 분석 결과 저장 (탭 이동은 조회 버튼에서 처리)
  useEffect(() => {
    // 데이터가 있으면 분석 결과만 저장 (탭 이동은 하지 않음)
    if (transactionData.length > 0) {
      saveAnalysisResult();
    }
  }, [transactionData, saveAnalysisResult]);

  const handleTransactionSearch = () => {
    if (selectedAddress) {
      // 조회 버튼을 누르자마자 output 탭으로 이동
      setActiveTab('output');
      handleMoveToAddress(selectedType, complexName);
    }
  };

  interface DanjiInfo {
    commBuildingCode: string;
    resBuildingName: string;
  }

  const handleDanjiSelect = (danji: DanjiInfo) => {
    setComplexName(danji.commBuildingCode);
    setDanjiName(danji.resBuildingName);
    setShowDanjiModal(false);
  };

  // ref를 통해 외부에서 접근할 수 있는 메서드 노출
  useImperativeHandle(ref, () => ({
    handleTransactionSearch,
  }));

  // 폼 데이터 생성
  const formData: TransactionSearchFormData = {
    selectedYear,
    selectedType,
    complexName,
    danjiName,
    targetArea,
    targetPrice,
    parsedAddress,
  };

  // 보증금 미포함 거래만 필터링 (averagePricesByArea 계산과 동일한 조건)
  const filteredTransactionData = transactionData.filter(transaction => 
    !transaction.거래금액.includes('보증금')
  );

  // API 응답 데이터 생성
  const response = transactionData.length > 0 ? {
    success: true,
    message: '조회 성공',
    data: transactionData,
    userAddressNickname: selectedAddress?.nickname || '',
    filteredCount: filteredTransactionData.length, // 보증금 미포함 거래 건수
  } : null;

  // 입력 컴포넌트
  const inputComponent = ({ onSuccess }: { onSuccess: () => void }) => (
    <TransactionSearchInput
      formData={formData}
      onSubmit={() => {
        handleTransactionSearch();
        onSuccess?.();
      }}
      loading={isLoading}
      onSuccess={onSuccess}
      onYearChange={setSelectedYear}
      onTypeChange={setSelectedType}
      onComplexNameChange={setComplexName}
      onDanjiNameChange={setDanjiName}
      onTargetAreaChange={setTargetArea}
      onTargetPriceChange={setTargetPrice}
      onFetchComplex={() => setShowDanjiModal(true)}
    />
  );

  // 결과 컴포넌트
  const outputComponent = (
    <TransactionSearchOutput
      response={response}
      loading={isLoading}
      averagePricesByArea={averagePricesByArea}
      targetArea={targetArea}
      targetPrice={targetPrice}
      onNewSearch={() => setActiveTab('input')}
    />
  );

  // 존재 여부 쿼리 객체 생성
  const checkExistsQuery = {
    data: transactionData.length > 0 ? {
      success: true,
      exists: true,
    } : undefined,
    isLoading: false,
    refetch: () => {
      // 필요시 재조회 로직 구현
    },
  };

  return (
    <>
      <DataContainer
        title='실거래가 조회'
        inputComponent={inputComponent}
        outputComponent={outputComponent}
        checkExistsQuery={checkExistsQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

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
    </>
  );
});

TransactionSearchContainer.displayName = 'TransactionSearchContainer';
