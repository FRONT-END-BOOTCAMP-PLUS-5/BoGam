// 지역 코드 옵션
export const REGION_OPTIONS = [
  { value: '11000', label: '서울특별시' },
  { value: '26000', label: '부산광역시' },
  { value: '27000', label: '대구광역시' },
  { value: '28000', label: '인천광역시' },
  { value: '29000', label: '광주광역시' },
  { value: '30000', label: '대전광역시' },
  { value: '31000', label: '울산광역시' },
  { value: '41000', label: '경기도' },
  { value: '42000', label: '강원도' },
  { value: '43000', label: '충청북도' },
  { value: '44000', label: '충청남도' },
  { value: '45000', label: '전라북도' },
  { value: '46000', label: '전라남도' },
  { value: '47000', label: '경상북도' },
  { value: '48000', label: '경상남도' },
  { value: '50000', label: '제주특별자치도' },
] as const;

// 결혼상태 옵션
export const MARRIAGE_OPTIONS = [
  { value: '1', label: '미혼' },
  { value: '2', label: '기혼' },
  { value: '3', label: '이혼' },
  { value: '4', label: '사별' },
] as const;

// 보유주택수 옵션
export const HOUSE_COUNT_OPTIONS = [
  { value: '0', label: '0개' },
  { value: '1', label: '1개' },
  { value: '2', label: '2개' },
  { value: '3', label: '3개 이상' },
] as const;

// 필수 필드 목록
export const REQUIRED_FIELDS = [
  'rentGrntAmt',
  'trgtLwdgCd',
  'age',
  'weddStcd',
  'myIncmAmt',
  'myTotDebtAmt',
  'ownHsCnt',
  'mmrtAmt',
] as const;

// 필드별 에러 메시지
export const FIELD_ERROR_MESSAGES = {
  rentGrntAmt: '전세보증금을 입력해주세요',
  trgtLwdgCd: '지역을 선택해주세요',
  age: '나이를 입력해주세요',
  weddStcd: '결혼상태를 선택해주세요',
  myIncmAmt: '소득금액을 입력해주세요',
  myTotDebtAmt: '총부채금액을 입력해주세요',
  ownHsCnt: '보유주택수를 선택해주세요',
  mmrtAmt: '월세금액을 입력해주세요',
} as const;

// 필드별 플레이스홀더
export const FIELD_PLACEHOLDERS = {
  rentGrntAmt: '전세보증금을 입력하세요',
  trgtLwdgCd: '지역을 선택하세요',
  age: '나이를 입력하세요',
  weddStcd: '결혼상태를 선택하세요',
  myIncmAmt: '연간 소득금액을 입력하세요',
  myTotDebtAmt: '총부채금액을 입력하세요 (0원 가능)',
  ownHsCnt: '보유주택수를 선택하세요',
  mmrtAmt: '월세금액을 입력하세요 (0원 가능)',
} as const;

// 필드별 라벨
export const FIELD_LABELS = {
  rentGrntAmt: '전세보증금',
  trgtLwdgCd: '지역',
  age: '나이',
  weddStcd: '결혼상태',
  myIncmAmt: '소득금액',
  myTotDebtAmt: '총부채금액',
  ownHsCnt: '보유주택수',
  mmrtAmt: '월세금액',
} as const;
