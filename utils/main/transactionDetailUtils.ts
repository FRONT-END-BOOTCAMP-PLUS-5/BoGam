import {
  TransactionDetailApartSaleItem,
  TransactionDetailApartRentItem,
  TransactionDetailApiResponse,
} from '@libs/api_front/transactionDetail.api';
import {
  formatTransactionAmount,
  formatDongData,
  sortTransactionDataByRent,
  formatContractDate,
} from '@utils/main/transactionUtils';

export interface ParsedTransactionDetail {
  id: string;
  아파트: string;
  거래금액: string;
  전용면적: string;
  층: string;
  건축년도: string;
  년: string;
  월: string;
  일: string;
  법정동: string;
  지번: string;
  location: null;
  // 전월세 추가 정보
  보증금?: string;
  월세?: string;
  계약구분?: string;
  계약시작일?: string;
  계약종료일?: string;
  종전보증금?: string;
  종전월세?: string;
}

// API 응답 데이터 타입 정의
interface TransactionApiResponse {
  success: boolean;
  data: {
    data?: {
      resSaleList?: TransactionDetailApartSaleItem[];
      resRentList?: TransactionDetailApartRentItem[];
    };
    resSaleList?: TransactionDetailApartSaleItem[];
    resRentList?: TransactionDetailApartRentItem[];
  };
}

/**
 * 아파트 계열 실거래가 데이터 파싱
 */
export const parseTransactionDetailApart = (
  data: TransactionApiResponse
): ParsedTransactionDetail[] => {
  if (!data.success || !data.data) {
    throw new Error('실거래가 데이터를 가져올 수 없습니다.');
  }

  // API 응답에서 data가 중첩되어 있음: data.data.data.resSaleList
  const saleData = data.data.data?.resSaleList || data.data.resSaleList || [];
  const rentData = data.data.data?.resRentList || data.data.resRentList || [];

  console.log('🔍 파싱된 데이터:', { saleData, rentData });

  // 각 아이템의 resTranAmount 값 확인
  console.log(
    '🔍 매매 데이터 resTranAmount 값들:',
    saleData.map((item: TransactionDetailApartSaleItem) => ({
      resTranAmount: item.resTranAmount,
      type: typeof item.resTranAmount,
      year: item.resYear,
      month: item.resMonth,
    }))
  );
  console.log(
    '🔍 전월세 데이터 resTranAmount 값들:',
    rentData.map((item: TransactionDetailApartRentItem) => ({
      resTranAmount: item.resTranAmount,
      type: typeof item.resTranAmount,
      year: item.resYear,
      month: item.resMonth,
    }))
  );

  // Rent 데이터를 우선으로 정렬
  const sortedData = sortTransactionDataByRent([...saleData, ...rentData]) as (
    | TransactionDetailApartSaleItem
    | TransactionDetailApartRentItem
  )[];

  const transformedData = sortedData.map(
    (
      item: TransactionDetailApartSaleItem | TransactionDetailApartRentItem,
      index: number
    ) => {
      // 전월세 데이터인지 확인 (resDeposit이나 resMonthlyRent가 있으면 전월세)
      const isRentData = 'resDeposit' in item || 'resMonthlyRent' in item;

      let formattedAmount: string;
      if (isRentData) {
        // 전월세 데이터인 경우 보증금만 표시
        const deposit = item.resDeposit || '0';
        const monthlyRent = item.resMonthlyRent || '0';

        if (deposit === '0' && monthlyRent === '0') {
          formattedAmount = '전월세';
        } else {
          const depositFormatted = formatTransactionAmount(deposit);
          formattedAmount = `보증금 ${depositFormatted}`;
        }
      } else {
        // 매매 데이터인 경우 기존 로직 사용
        formattedAmount = formatTransactionAmount(item.resTranAmount || '0');
      }

      console.log(`🔍 아이템 ${index} 포맷팅:`, {
        original: item.resTranAmount,
        formatted: formattedAmount,
        year: item.resYear,
        month: item.resMonth,
        isRentData,
        deposit: isRentData
          ? (item as TransactionDetailApartRentItem).resDeposit
          : 'N/A',
        monthlyRent: isRentData
          ? (item as TransactionDetailApartRentItem).resMonthlyRent
          : 'N/A',
      });

      return {
        id: `transaction-${index}`,
        아파트: formatDongData(item.resDong || ''),
        거래금액: formattedAmount,
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
          보증금: (item as TransactionDetailApartRentItem).resDeposit || '0',
          월세: (item as TransactionDetailApartRentItem).resMonthlyRent || '0',
          계약구분:
            (item as TransactionDetailApartRentItem).resContractType || '',
          계약시작일: formatContractDate(
            (item as TransactionDetailApartRentItem).commStartDate
          ),
          계약종료일: formatContractDate(
            (item as TransactionDetailApartRentItem).commEndDate
          ),
          종전보증금:
            (item as TransactionDetailApartRentItem).resPrevDeposit || '',
          종전월세:
            (item as TransactionDetailApartRentItem).resPrevMonthlyRent || '',
        }),
      };
    }
  );

  console.log('🔍 변환된 데이터:', transformedData);
  return transformedData;
};

// 단독/다가구 API 응답 데이터 타입 정의
interface SingleTransactionApiResponse {
  success: boolean;
  data: Array<Record<string, unknown>>;
}

/**
 * 단독/다가구 실거래가 데이터 파싱
 */
export const parseTransactionDetailSingle = (
  data: TransactionDetailApiResponse
): ParsedTransactionDetail[] => {
  if (!data.success || !data.data) {
    throw new Error('실거래가 데이터를 가져올 수 없습니다.');
  }

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
  return transformedData;
};
