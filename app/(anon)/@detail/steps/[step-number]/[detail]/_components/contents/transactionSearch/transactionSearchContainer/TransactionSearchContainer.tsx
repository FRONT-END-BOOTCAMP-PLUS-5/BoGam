'use client';

import React, { forwardRef, useImperativeHandle, useEffect, useState, useCallback } from 'react';
import { TransactionSearchInput } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/transactionSearch/transactionSearchInput/TransactionSearchInput';
import { TransactionSearchOutput } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/transactionSearch/transactionSearchOutput/TransactionSearchOutput';
import { TransactionSearchFormData } from '../types';
import { DataContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/container/DataContainer';
import { useTransactionManagement } from '@/hooks/useTransactionManagement';
import { useMainPageState } from '@/hooks/main/useMainPageState';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useStepResultMutations } from '@/hooks/useStepResultMutations';
import { parseAddressString } from '@utils/main/addressUtils';
import { parseStepUrl } from '@utils/stepUrlParser';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';
import { DanjiSerialNumberContent } from '@/(anon)/_components/common/modal/DanjiSerialNumberContent';
import { useModalStore } from '@libs/stores/modalStore';
import type { ActualDanjiInfo } from '@/(anon)/_components/common/modal/useDanjiSerialNumber';
import { useCreateTransactionSearch, useCheckTransactionSearchCopyExists } from '@/hooks/useTransactionSearch';
import { TransactionSearchData } from '@libs/api_front/transactionSearch.api';

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
  const { openModal, closeModal } = useModalStore();

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

  // API 훅
  const { mutate: createTransactionSearch } = useCreateTransactionSearch();

  // 존재 여부 확인 쿼리
  const {
    data: existsQuery,
    isLoading: isExistsLoading,
    refetch,
  } = useCheckTransactionSearchCopyExists(selectedAddress?.nickname || null);

  // 주소 파싱
  useEffect(() => {
    if (selectedAddress) {
      const address = selectedAddress.completeAddress || selectedAddress.roadAddress || '';
      const parsed = parseAddressString(address);
      setParsedAddress(parsed);
    }
  }, [selectedAddress]);

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

  // API 호출 성공 시 콜백
  const handleApiSuccess = useCallback(() => {
    // 성공 시 아무것도 하지 않음 (DataContainer에서 자동으로 결과 탭으로 이동)
  }, []);

  // API 호출 실패 시 에러 모달 표시
  const handleApiError = useCallback((message: string) => {
    openModal({
      title: '오류',
      content: message,
      icon: 'error',
      confirmText: '확인',
      onConfirm: async () => {
        // 확인 버튼 클릭 시 아무것도 하지 않음 (모달만 닫힘)
      },
    });
  }, [openModal]);

  // 분석 결과 저장 함수 (API를 통해 저장)
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

      const targetPriceNum = targetPrice / 100000000; // 억원 단위로 변환
      if (targetPriceNum === 0) return;

      // TransactionSearchData 객체 생성
      const transactionSearchData: TransactionSearchData = {
        complexName: danjiName || complexName,
        targetArea: targetAreaNum,
        targetPrice: targetPriceNum,
        similarArea: mostSimilarArea.area,
        averagePrice: mostSimilarArea.averagePrice,
        searchResultCount: transactionData.length,
        areaAveragePrices: averagePricesByArea.map(item => ({
          area: item.area,
          averagePrice: item.averagePrice,
          transactionCount: item.count,
        })),
      };

      // API를 통해 저장
      createTransactionSearch({
        ...transactionSearchData,
        userAddressNickname: selectedAddress.nickname,
      }, {
        onSuccess: (data) => {
          if (data.success) {
            handleApiSuccess();
          } else {
            handleApiError(data.message || '실거래가 검색 데이터 저장 중 오류가 발생했습니다.');
          }
        },
        onError: (error) => {
          console.error('❌ TransactionSearchContainer - 저장 API 오류:', error);
          handleApiError('API 호출 중 오류가 발생했습니다.');
        }
      });

      // 기존 stepResult 저장도 유지
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
  }, [targetArea, targetPrice, averagePricesByArea, selectedAddress?.nickname, isSaving, upsertStepResult, stepNumber, detail, danjiName, complexName, transactionData.length, createTransactionSearch, handleApiSuccess, handleApiError]);


  const handleTransactionSearch = () => {
    if (selectedAddress) {
      // 조회 버튼을 누르자마자 output 탭으로 이동
      setActiveTab('output');
      handleMoveToAddress(selectedType, complexName);
    }
  };

  const handleDanjiSelect = (danji: ActualDanjiInfo) => {
    setComplexName(danji.commBuildingCode);
    setDanjiName(danji.resBuildingName);
    closeModal();
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

  const openDanjiModal = () => {
    openModal({
      title: '단지 일련번호 조회',
      icon: 'info',
      cancelText: '닫기',
      content: (
        <DanjiSerialNumberContent
          searchParams={{
            addrSido: parsedAddress.addrSido,
            addrSigungu: parsedAddress.addrSigungu,
            addrDong: parsedAddress.addrDong,
          }}
          onSelect={handleDanjiSelect}
        />
      ),
    });
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
      onFetchComplex={openDanjiModal}
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
      complexName={danjiName || complexName}
      onNewSearch={() => setActiveTab('input')}
      onSaveResult={saveAnalysisResult}
    />
  );

  // 존재 여부 쿼리 객체 생성
  const checkExistsQuery = {
    data: existsQuery?.success
      ? {
          success: true,
          exists: (existsQuery.exists as boolean) || false,
        }
      : undefined,
    isLoading: isExistsLoading,
    refetch: refetch,
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
    </>
  );
});

TransactionSearchContainer.displayName = 'TransactionSearchContainer';
