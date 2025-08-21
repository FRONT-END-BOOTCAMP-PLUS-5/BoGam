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
        const enrichedData = [];

        for (const item of transactionItems) {
          try {
            // 주소 정보 조합
            const address = `${item.umdNm} ${item.jibun}`;

            // 키워드 검색으로 좌표 가져오기
            const searchData = await placesApi.searchByKeyword(address);

            if (searchData && searchData.length > 0) {
              const location: Location = {
                lat: parseFloat(searchData[0].latitude),
                lng: parseFloat(searchData[0].longitude),
              };

              enrichedData.push({
                id: `${item.aptNm}-${item.dealYear}-${item.dealMonth}-${item.dealDay}`,
                아파트: item.aptNm,
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
              });
            } else {
              // 좌표를 찾을 수 없는 경우 원본 데이터 그대로 추가
              enrichedData.push({
                id: `${item.aptNm}-${item.dealYear}-${item.dealMonth}-${item.dealDay}`,
                아파트: item.aptNm,
                거래금액: item.dealAmount,
                전용면적: item.excluUseAr,
                층: item.floor,
                건축년도: item.buildYear,
                년: item.dealYear,
                월: item.dealMonth,
                일: item.dealDay,
                법정동: item.umdNm,
                지번: item.jibun,
              });
            }
          } catch (error) {
            console.error('좌표 추가 실패:', error);
            // 에러 발생 시 원본 데이터 그대로 추가
            enrichedData.push({
              id: `${item.aptNm}-${item.dealYear}-${item.dealMonth}-${item.dealDay}`,
              아파트: item.aptNm,
              거래금액: item.dealAmount,
              전용면적: item.excluUseAr,
              층: item.floor,
              건축년도: item.buildYear,
              년: item.dealYear,
              월: item.dealMonth,
              일: item.dealDay,
              법정동: item.umdNm,
              지번: item.jibun,
            });
          }
        }

        return enrichedData as TransactionData[];
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
