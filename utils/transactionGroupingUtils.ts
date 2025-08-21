import { GetRealEstateTransactionItem } from '@be/applications/transactions/dtos/GetRealEstateTransactionResponse';
import {
  DongGroup,
  GroupedByDongData,
} from '@be/applications/transactions/dtos/GetAllTransactionResponse';

/**
 * 거래금액 문자열을 숫자로 변환
 * @param dealAmount 거래금액 문자열 (예: "1억 5,000")
 * @returns 숫자로 변환된 거래금액
 */
export function parseDealAmount(dealAmount: string): number {
  if (!dealAmount) return 0;

  // "억" 단위 처리
  const billionMatch = dealAmount.match(/(\d+)억/);
  const billion = billionMatch ? parseInt(billionMatch[1]) * 100000000 : 0;

  // 천 단위 콤마 제거 후 숫자 추출
  const remaining = dealAmount.replace(/\d+억\s*/, '').replace(/,/g, '');
  const remainingNumber = remaining ? parseInt(remaining) * 10000 : 0; // 만 단위로 처리

  return billion + remainingNumber;
}

/**
 * 실거래가 데이터를 동별로 그룹화
 * @param transactions 실거래가 데이터 배열
 * @returns 동별로 그룹화된 데이터
 */
export function groupTransactionsByDong(
  transactions: GetRealEstateTransactionItem[]
): GroupedByDongData {
  // 동별로 그룹화
  const dongGroups = new Map<string, GetRealEstateTransactionItem[]>();

  transactions.forEach((transaction) => {
    // 동 이름 추출 (aptDong 또는 umdNm에서)
    const dongName = transaction.aptDong || transaction.umdNm || '기타';

    if (!dongGroups.has(dongName)) {
      dongGroups.set(dongName, []);
    }

    dongGroups.get(dongName)!.push(transaction);
  });

  // 그룹 데이터 생성
  const groups: DongGroup[] = [];
  let mostActiveDong = { dongName: '', transactionCount: 0 };

  dongGroups.forEach((transactions, dongName) => {
    const transactionCount = transactions.length;

    // 거래금액 통계 계산
    const dealAmounts = transactions
      .map((t) => parseDealAmount(t.dealAmount))
      .filter((amount) => amount > 0);

    const averageDealAmount =
      dealAmounts.length > 0
        ? dealAmounts.reduce((sum, amount) => sum + amount, 0) /
          dealAmounts.length
        : 0;

    const maxDealAmount = dealAmounts.length > 0 ? Math.max(...dealAmounts) : 0;
    const minDealAmount = dealAmounts.length > 0 ? Math.min(...dealAmounts) : 0;

    const group: DongGroup = {
      dongName,
      transactions,
      transactionCount,
      averageDealAmount: Math.round(averageDealAmount),
      maxDealAmount: Math.round(maxDealAmount),
      minDealAmount: Math.round(minDealAmount),
    };

    groups.push(group);

    // 가장 활발한 동 업데이트
    if (transactionCount > mostActiveDong.transactionCount) {
      mostActiveDong = { dongName, transactionCount };
    }
  });

  // 거래 건수 기준으로 내림차순 정렬
  groups.sort((a, b) => b.transactionCount - a.transactionCount);

  return {
    groups,
    totalDongs: groups.length,
    mostActiveDong,
  };
}

/**
 * 동별 그룹화된 데이터에서 특정 동의 정보 조회
 * @param groupedData 그룹화된 데이터
 * @param dongName 조회할 동 이름
 * @returns 해당 동의 그룹 정보 또는 null
 */
export function getDongGroup(
  groupedData: GroupedByDongData,
  dongName: string
): DongGroup | null {
  return (
    groupedData.groups.find((group) => group.dongName === dongName) || null
  );
}

/**
 * 동별 그룹화된 데이터에서 상위 N개 동 조회
 * @param groupedData 그룹화된 데이터
 * @param limit 조회할 상위 개수
 * @returns 상위 N개 동의 그룹 정보
 */
export function getTopDongs(
  groupedData: GroupedByDongData,
  limit: number = 10
): DongGroup[] {
  return groupedData.groups.slice(0, limit);
}

/**
 * 동별 그룹화된 데이터에서 거래금액 기준 상위 동 조회
 * @param groupedData 그룹화된 데이터
 * @param limit 조회할 상위 개수
 * @returns 평균 거래금액 기준 상위 N개 동의 그룹 정보
 */
export function getTopDongsByAveragePrice(
  groupedData: GroupedByDongData,
  limit: number = 10
): DongGroup[] {
  return [...groupedData.groups]
    .sort((a, b) => b.averageDealAmount - a.averageDealAmount)
    .slice(0, limit);
}
