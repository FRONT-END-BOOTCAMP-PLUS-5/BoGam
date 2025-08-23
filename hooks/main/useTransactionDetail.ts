import { useMutation } from '@tanstack/react-query';
import { transactionDetailApi } from '@libs/api_front/transactionDetail.api';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import {
  parseTransactionDetailApart,
  parseTransactionDetailSingle,
  ParsedTransactionDetail,
} from '@utils/main/transactionDetailUtils';

export const useTransactionDetail = () => {
  const { setTransactionData, setLoading, setError } =
    useTransactionDataStore();

  // 아파트 계열 실거래가 상세조회
  const fetchTransactionDetailApartMutation = useMutation({
    onMutate: () => {
      console.log('🔍 fetchTransactionDetailApart 시작');
      setLoading(true);
      setError(null);
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
      console.log('🔍 fetchTransactionDetailApart 성공 - 원본 데이터:', data);

      try {
        const transformedData = parseTransactionDetailApart(data);

        // 상태 업데이트를 setTimeout으로 지연시켜 React의 상태 업데이트 순서 보장
        setTimeout(() => {
          setTransactionData(transformedData);
          setLoading(false);
          console.log('🔍 setTransactionData 완료');
        }, 0);
      } catch (error) {
        console.error('❌ 실거래가 데이터 파싱 실패:', error);
        setError(
          error instanceof Error
            ? error.message
            : '실거래가 데이터를 가져올 수 없습니다.'
        );
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('실거래가 상세조회 실패:', error);
      setError(
        error instanceof Error ? error.message : '실거래가 상세조회 실패'
      );
      setLoading(false);
    },
  });

  // 단독/다가구 실거래가 상세조회
  const fetchTransactionDetailSingleMutation = useMutation({
    onMutate: () => {
      console.log('🔍 fetchTransactionDetailSingle 시작');
      setLoading(true);
      setError(null);
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
        type,
        addrSido,
        addrSigungu,
        addrDong,
        contractYear,
        contractType,
      });

      return response;
    },
    onSuccess: (data) => {
      console.log('🔍 fetchTransactionDetailSingle 성공 - 원본 데이터:', data);

      try {
        const transformedData = parseTransactionDetailSingle(data);

        // 상태 업데이트를 setTimeout으로 지연시켜 React의 상태 업데이트 순서 보장
        setTimeout(() => {
          setTransactionData(transformedData);
          setLoading(false);
          console.log('🔍 setTransactionData 완료');
        }, 0);
      } catch (error) {
        console.error('❌ 실거래가 데이터 파싱 실패:', error);
        setError(
          error instanceof Error
            ? error.message
            : '실거래가 데이터를 가져올 수 없습니다.'
        );
        setLoading(false);
      }
    },
    onError: (error) => {
      setError(
        error instanceof Error ? error.message : '실거래가 상세조회 실패'
      );
      setLoading(false);
    },
  });

  return {
    fetchTransactionDetailApart: fetchTransactionDetailApartMutation.mutate,
    fetchTransactionDetailSingle: fetchTransactionDetailSingleMutation.mutate,
    isLoading:
      fetchTransactionDetailApartMutation.isPending ||
      fetchTransactionDetailSingleMutation.isPending,
    error:
      fetchTransactionDetailApartMutation.error ||
      fetchTransactionDetailSingleMutation.error,
  };
};
