import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';
import { placesApi } from '@libs/api_front/places.api';
import { transactionsApi } from '@libs/api_front/transactions.api';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';

interface TransactionItem {
  aptNm: string;
  dealAmount: string;
  excluUseAr: string;
  floor: string;
  buildYear: string;
  dealYear: string;
  dealMonth: string;
  dealDay: string;
  umdNm: string;
  jibun: string;
}

export const useTransactionData = () => {
  const { setTransactionData, setLoading, setError } =
    useTransactionDataStore();
  const queryClient = useQueryClient();

  // 법정동 코드로 직접 실거래가 데이터 가져오기
  const fetchTransactionDataByCodeMutation = useMutation({
    mutationFn: async ({
      lawdCd,
      selectedYear,
      selectedMonth,
    }: {
      lawdCd: string;
      selectedYear: string;
      selectedMonth: string;
    }) => {
      const responseData = await transactionsApi.getAllTransactions({
        LAWD_CD: lawdCd,
        DEAL_YMD: `${selectedYear}${selectedMonth.padStart(2, '0')}`,
      });

      if (responseData.success) {
        const transactionItems = responseData.data?.items?.item || [];

        // 상위 10개 데이터만 좌표 변환
        const topTenData = transactionItems.slice(0, 10);

        // 각 거래 데이터에 좌표 추가
        const dataWithCoordinates = await Promise.all(
          topTenData.map(async (item: TransactionItem) => {
            try {
              const address = `${item.umdNm || ''} ${item.jibun || ''}`;
              console.log(
                '실거래가 주소 좌표 변환 (법정동코드 기반):',
                address
              );
              const coordData = await placesApi.address2Coord(address);
              const location =
                coordData.success && coordData.data
                  ? {
                      lat: coordData.data.y,
                      lng: coordData.data.x,
                    }
                  : null;

              if (location) {
                return {
                  id: item.aptNm || `item-${Math.random()}`,
                  아파트: item.aptNm || '',
                  거래금액: item.dealAmount,
                  전용면적: item.excluUseAr,
                  층: item.floor,
                  건축년도: item.buildYear,
                  년: item.dealYear,
                  월: item.dealMonth,
                  일: item.dealDay,
                  법정동: item.umdNm,
                  지번: item.jibun,
                  location,
                };
              }
              return null;
            } catch (error) {
              console.error('좌표 변환 실패:', error);
              return null;
            }
          })
        );

        const filteredData = dataWithCoordinates.filter(
          (item): item is TransactionData =>
            item !== null && item.location !== undefined
        );

        return filteredData;
      }
      return [];
    },
    onSuccess: (data) => {
      setTransactionData(data);
      setLoading(false);
      // 캐시 업데이트
      queryClient.setQueryData(['transactionData'], data);
    },
    onError: (error) => {
      console.error('실거래가 데이터 가져오기 실패:', error);
      setError(
        error instanceof Error ? error.message : '실거래가 데이터 가져오기 실패'
      );
      setLoading(false);
    },
  });

  return {
    fetchTransactionDataByCode: fetchTransactionDataByCodeMutation.mutate,
  };
};
