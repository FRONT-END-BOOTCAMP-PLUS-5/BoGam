import { useMutation } from '@tanstack/react-query';
import {
  transactionDetailApi,
  TransactionDetailApartSaleItem,
  TransactionDetailApartRentItem,
} from '@libs/api_front/transactionDetail.api';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';

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

      if (data.success && data.data) {
        // 매매 데이터와 전월세 데이터를 합쳐서 변환
        // API 응답에서 data가 중첩되어 있음: data.data.data.resSaleList
        const saleData =
          data.data.data?.resSaleList || data.data.resSaleList || [];
        const rentData =
          data.data.data?.resRentList || data.data.resRentList || [];

        console.log('🔍 파싱된 데이터:', { saleData, rentData });

        const transformedData = [...saleData, ...rentData].map(
          (
            item:
              | TransactionDetailApartSaleItem
              | TransactionDetailApartRentItem,
            index: number
          ) => ({
            id: `transaction-${index}`,
            아파트: item.resDong || '부동산',
            거래금액: item.resTranAmount || '0',
            전용면적: item.resArea || '0',
            층: item.resFloor || '0',
            건축년도: '',
            년: item.resYear || '',
            월: item.resMonth || '',
            일: item.resDays || '',
            법정동: '',
            지번: '',
            location: null, // 좌표 정보 없음
          })
        );

        console.log('🔍 변환된 데이터:', transformedData);

        // 상태 업데이트를 setTimeout으로 지연시켜 React의 상태 업데이트 순서 보장
        setTimeout(() => {
          setTransactionData(transformedData);
          setLoading(false);
          console.log('🔍 setTransactionData 완료');
        }, 0);

        // 성공 알림
      } else {
        console.error('❌ 실거래가 데이터 파싱 실패:', data);
        setError('실거래가 데이터를 가져올 수 없습니다.');
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

      if (data.success && data.data) {
        // 단독/다가구 데이터 변환 (아파트와 다른 구조일 수 있음)
        const transformedData = Array.isArray(data.data)
          ? data.data.map((item: Record<string, unknown>, index: number) => ({
              id: `transaction-${index}`,
              아파트: '단독/다가구',
              거래금액: String(item.resTranAmount || item.resDealAmount || '0'),
              전용면적: String(item.resArea || item.resExclusiveArea || '0'),
              층: String(item.resFloor || item.resFloorNum || '0'),
              건축년도: '',
              년: String(item.resYear || item.resContractYear || ''),
              월: String(item.resMonth || item.resContractMonth || ''),
              일: String(item.resDays || item.resContractDay || ''),
              법정동: '',
              지번: '',
              location: null, // 좌표 정보 없음
            }))
          : [];

        console.log('🔍 변환된 데이터:', transformedData);

        // 상태 업데이트를 setTimeout으로 지연시켜 React의 상태 업데이트 순서 보장
        setTimeout(() => {
          setTransactionData(transformedData);
          setLoading(false);
          console.log('🔍 setTransactionData 완료');
        }, 0);
      } else {
        setError('실거래가 데이터를 가져올 수 없습니다.');
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
