import { useMutation } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import {
  transactionDetailApi,
  TransactionDetailApartSaleItem,
  TransactionDetailApartRentItem,
} from '@libs/api_front/transactionDetail.api';
import {
  formatTransactionAmount,
  formatDongData,
  sortTransactionDataByRent,
  formatContractDate,
} from '@utils/main/transactionUtils';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';

export const useTransactionDetail = () => {
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearTransactionData = useCallback(() => {
    setTransactionData([]);
    setError(null);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setErrorState = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);

  // 아파트 계열 실거래가 상세조회
  const fetchTransactionDetailApartMutation = useMutation({
    onMutate: () => {
      setLoading(true);
      setErrorState(null);
    },
    mutationFn: async ({
      buildingCode,
      type,
      contractYear,
      contractType = '0',
    }: {
      buildingCode: string;
      type: string;
      contractYear: string;
      contractType?: string;
    }) => {
      const response = await transactionDetailApi.getTransactionDetailApart({
        organization: '0010',
        type,
        buildingCode,
        contractYear,
        contractType,
      });

      return response;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        // 매매 데이터와 전월세 데이터를 합쳐서 변환
        // API 응답에서 data가 중첩되어 있음: data.data.data.resSaleList
        const saleData =
          data.data.data?.resSaleList || data.data.resSaleList || [];
        const rentData =
          data.data.data?.resRentList || data.data.resRentList || [];

        // Rent 데이터를 우선으로 정렬
        const sortedData = sortTransactionDataByRent([
          ...saleData,
          ...rentData,
        ]) as (
          | TransactionDetailApartSaleItem
          | TransactionDetailApartRentItem
        )[];

        const transformedData = sortedData.map(
          (
            item:
              | TransactionDetailApartSaleItem
              | TransactionDetailApartRentItem,
            index: number
          ) => {
            // 전월세 데이터인지 확인 (resDeposit이나 resMonthlyRent가 있으면 전월세)
            const isRentData = 'resDeposit' in item || 'resMonthlyRent' in item;

            let formattedAmount: string;
            let originalAmount: string; // 원본 숫자값 저장
            
            if (isRentData) {
              // 전월세 데이터인 경우 보증금만 표시
              const deposit = item.resDeposit || '0';
              const monthlyRent = item.resMonthlyRent || '0';

              if (deposit === '0' && monthlyRent === '0') {
                formattedAmount = '전월세';
                originalAmount = '0';
              } else {
                const depositFormatted = formatTransactionAmount(deposit);
                formattedAmount = `보증금 ${depositFormatted}`;
                originalAmount = deposit; // 원본 숫자값 저장
              }
            } else {
              // 매매 데이터인 경우 원본 숫자값 저장
              originalAmount = item.resTranAmount || '0';
              formattedAmount = formatTransactionAmount(originalAmount);
            }


            return {
              id: `transaction-${index}`,
              아파트: formatDongData(item.resDong || ''),
              거래금액: formattedAmount,
              거래금액원본: originalAmount, // 원본 숫자값 추가
              전용면적: item.resArea || '0',
              층: item.resFloor || '0',
              건축년도: '',
              년: item.resYear || '',
              월: item.resMonth || '',
              일: item.resDays || '',
              법정동: '',
              지번: '',
              location: null, // 좌표 정보 없음
              // 전월세 추가 정보
              ...(isRentData && {
                보증금:
                  (item as TransactionDetailApartRentItem).resDeposit || '0',
                월세:
                  (item as TransactionDetailApartRentItem).resMonthlyRent || '0',
                계약구분: '갱신',
                계약시작일: formatContractDate(
                  `${item.resYear || ''}-${item.resMonth || ''}-${item.resDays || ''}`
                ),
                계약종료일: formatContractDate(
                  `${item.resYear || ''}-${item.resMonth || ''}-${item.resDays || ''}`
                ),
                종전보증금: '0',
                종전월세: '0',
              }),
            };
          }
        );

        // 상태 업데이트를 setTimeout으로 지연시켜 React의 상태 업데이트 순서 보장
        setTimeout(() => {
          setTransactionData(transformedData);
          setLoading(false);
        }, 0);
      } else {
        setErrorState('데이터를 불러올 수 없습니다.');
        setLoading(false);
      }
    },
    onError: () => {
      setErrorState('실거래가 조회 중 오류가 발생했습니다.');
      setLoading(false);
    },
  });

  // 단독/연립 실거래가 상세조회
  const fetchTransactionDetailSingleMutation = useMutation({
    onMutate: () => {
      setLoading(true);
      setErrorState(null);
    },
    mutationFn: async ({
      addrSido,
      addrSigungu,
      addrDong,
      type,
      contractYear,
      contractType = '0',
    }: {
      addrSido: string;
      addrSigungu: string;
      addrDong: string;
      type: string;
      contractYear: string;
      contractType?: string;
    }) => {
      const response = await transactionDetailApi.getTransactionDetailSingle({
        organization: '0010',
        addrSido,
        addrSigungu,
        addrDong,
        type,
        contractYear,
        contractType,
      });

      return response;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        // 단독/연립 데이터 처리
        interface SingleDataItem {
          resTranAmount?: string;
          resDong?: string;
          resArea?: string;
          resFloor?: string;
          resYear?: string;
          resMonth?: string;
          resDays?: string;
        }
        
        const singleData = (data.data as { resSingleList?: SingleDataItem[] })?.resSingleList || [];

        const transformedData = singleData.map(
          (item: SingleDataItem, index: number) => {
            const originalAmount = item.resTranAmount || '0';
            const formattedAmount = formatTransactionAmount(originalAmount);

            return {
              id: `transaction-${index}`,
              아파트: formatDongData(item.resDong || ''),
              거래금액: formattedAmount,
              거래금액원본: originalAmount,
              전용면적: item.resArea || '0',
              층: item.resFloor || '0',
              건축년도: '',
              년: item.resYear || '',
              월: item.resMonth || '',
              일: item.resDays || '',
              법정동: '',
              지번: '',
              location: null,
            };
          }
        );

        // 상태 업데이트를 setTimeout으로 지연시켜 React의 상태 업데이트 순서 보장
        setTimeout(() => {
          setTransactionData(transformedData);
          setLoading(false);
        }, 0);
      } else {
        setErrorState('데이터를 불러올 수 없습니다.');
        setLoading(false);
      }
    },
    onError: () => {
      setErrorState('실거래가 조회 중 오류가 발생했습니다.');
      setLoading(false);
    },
  });

  return {
    transactionData,
    isLoading,
    error,
    clearTransactionData,
    fetchTransactionDetailApartMutation,
    fetchTransactionDetailSingleMutation,
  };
};