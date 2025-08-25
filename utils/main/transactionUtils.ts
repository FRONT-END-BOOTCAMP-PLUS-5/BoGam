import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';

export const createApartmentParams = (
  buildingType: string,
  complexName: string
) => {
  return {
    buildingCode: complexName,
    type: buildingType,
    contractYear: new Date().getFullYear().toString(),
    contractType: '0', // 전체
  };
};

export const createSingleParams = (
  buildingType: string,
  selectedAddress: UserAddress
) => {
  return {
    addrSido: '서울', // TODO: 동적으로 설정
    addrSigungu: '성동구', // TODO: 동적으로 설정
    addrDong: selectedAddress.dong || '',
    type: buildingType,
    contractYear: new Date().getFullYear().toString(),
    contractType: '0', // 전체
  };
};

export const isValidBuildingType = (buildingType: string): boolean => {
  return ['0', '1', '2'].includes(buildingType);
};

export const isValidLawdCode = (lawdCode?: string): boolean => {
  return !!lawdCode && lawdCode.length === 5;
};

export const validateTransactionSearch = (
  selectedAddress: UserAddress | null,
  buildingType: string,
  complexName: string
): { isValid: boolean; error?: string } => {
  if (!selectedAddress) {
    return { isValid: false, error: '선택된 주소가 없습니다.' };
  }

  if (!isValidBuildingType(buildingType)) {
    return { isValid: false, error: '유효하지 않은 건물 타입입니다.' };
  }

  if (buildingType === '0' && !complexName) {
    return { isValid: false, error: '단지명을 입력해주세요.' };
  }

  return { isValid: true };
};

/**
 * 거래 금액을 억/만/천 단위로 포맷팅
 * @param amount 거래 금액 (문자열)
 * @returns 포맷팅된 거래 금액
 */
export const formatTransactionAmount = (amount: string): string => {
  if (!amount || amount === '0') {
    return '전월세';
  }

  const numAmount = parseInt(amount, 10);

  if (isNaN(numAmount) || numAmount === 0) {
    return '전월세';
  }

  // 만원 단위를 억/만/천 단위로 변환
  const 억 = Math.floor(numAmount / 10000);
  const 천만 = Math.floor((numAmount % 10000) / 1000);

  let result = '';

  if (억 > 0) {
    result += `${억}억`;
  }

  if (천만 > 0) {
    result += `${천만}천만`;
  }

  const finalResult = result || '0';
  return finalResult;
};

/**
 * 동 데이터를 포맷팅 (숫자 + "동", 없으면 "미확인")
 * @param dong 동 데이터
 * @returns 포맷팅된 동 데이터
 */
export const formatDongData = (dong: string): string => {
  if (!dong || dong.trim() === '') {
    return '상세 주소가 가려졌어요.';
  }

  // 숫자만 추출
  const dongNumber = dong.replace(/[^0-9]/g, '');

  if (dongNumber === '') {
    return '상세 주소가 가려졌어요.';
  }

  return `${dongNumber}동`;
};

/**
 * 실거래가 데이터를 Rent 데이터 기준으로 정렬
 * @param data 실거래가 데이터 배열
 * @returns Rent 데이터가 우선인 정렬된 데이터
 */
export const sortTransactionDataByRent = (
  data: Array<{
    resTranAmount: string;
    resYear: string;
    resMonth: string;
    resDays: string;
    resArea?: string;
    resFloor?: string;
    resDong?: string;
    resDeposit?: string;
    resMonthlyRent?: string;
  }>
): Array<{
  resTranAmount: string;
  resYear: string;
  resMonth: string;
  resDays: string;
  resArea?: string;
  resFloor?: string;
  resDong?: string;
  resDeposit?: string;
  resMonthlyRent?: string;
}> => {
  return data.sort((a, b) => {
    // Rent 데이터를 우선으로 정렬
    const aIsRent = a.resTranAmount === '0' || a.resTranAmount === '';
    const bIsRent = b.resTranAmount === '0' || b.resTranAmount === '';

    if (aIsRent && !bIsRent) return -1;
    if (!aIsRent && bIsRent) return 1;

    // 동일한 타입 내에서는 날짜순 정렬
    const aDate = new Date(`${a.resYear}-${a.resMonth}-${a.resDays}`);
    const bDate = new Date(`${b.resYear}-${b.resMonth}-${b.resDays}`);

    return bDate.getTime() - aDate.getTime();
  });
};

/**
 * 계약기간을 "YYMM" 형식에서 "YY년 MM월" 형식으로 변환
 * @param dateStr "YYMM" 형식의 날짜 문자열
 * @returns "YY년 MM월" 형식의 문자열
 */
export const formatContractDate = (dateStr?: string): string => {
  if (!dateStr || dateStr.length !== 4) {
    return '';
  }

  const year = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4);

  return `${year}.${month}`;
};
