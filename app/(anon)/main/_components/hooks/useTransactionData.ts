import { useCallback } from 'react';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { TransactionData } from '@/(anon)/main/_components/types/mainPage.types';
import { placesApi } from '@libs/api_front/places.api';
import { transactionsApi } from '@libs/api_front/transactions.api';

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

export const useTransactionData = (
  setTransactionData: (data: TransactionData[]) => void,
  addressToCoordinates: (address: string) => Promise<Location | null>
) => {
  // 실거래가 데이터 가져오기 (좌표 기반)
  const fetchTransactionData = useCallback(
    async (location: Location, selectedYear: string, selectedMonth: string) => {
      try {
        // 좌표를 법정동코드로 변환 (로컬 API 사용)
        const coordData = await placesApi.coord2Address(
          location.lng,
          location.lat
        );
        if (coordData.documents && coordData.documents.length > 0) {
          const hCode = coordData.documents[0].address.h_code;

          // 실거래가 데이터 가져오기
          const responseData = await transactionsApi.getAllTransactions({
            LAWD_CD: hCode,
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
                  console.log('실거래가 주소 좌표 변환 (좌표 기반):', address);
                  const location = await addressToCoordinates(address);

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

            setTransactionData(filteredData);
          }
        }
      } catch (error) {
        console.error('실거래가 데이터 가져오기 실패:', error);
      }
    },
    [setTransactionData, addressToCoordinates]
  );

  // 법정동 코드로 직접 실거래가 데이터 가져오기
  const fetchTransactionDataByCode = useCallback(
    async (lawdCd: string, selectedYear: string, selectedMonth: string) => {
      try {
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
                const location = await addressToCoordinates(address);

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

          setTransactionData(filteredData);
        }
      } catch (error) {
        console.error('실거래가 데이터 가져오기 실패:', error);
      }
    },
    [setTransactionData, addressToCoordinates]
  );

  return {
    fetchTransactionData,
    fetchTransactionDataByCode,
  };
};
