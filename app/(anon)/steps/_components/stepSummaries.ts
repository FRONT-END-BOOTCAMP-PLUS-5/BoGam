export interface StepSummary {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

export const stepSummaries: StepSummary[] = [
  {
    id: 1,
    title: '1단계',
    subtitle: '집 고를 때',
    description: '깡통주택 사기 피하고 전세보증보험 조건도 확인해봐요'
  },
  {
    id: 2,
    title: '2단계',
    subtitle: '임대인 확인할 때',
    description: '가짜 임대인 피하고 등기부등본도 꼼꼼히 살펴봐요'
  },
  {
    id: 3,
    title: '3단계',
    subtitle: '계약서 작성할 때',
    description: '공인중개사 자격증 확인하고 이중계약도 조심해요'
  },
  {
    id: 4,
    title: '4단계',
    subtitle: '계약한 직후',
    description: '전세권 설정하고 계약서에 특약조항도 꼭 넣어요'
  },
  {
    id: 5,
    title: '5단계',
    subtitle: '입주한 이후',
    description: '납세증명서 확인하고 내 보증금 순위도 계산해봐요'
  },
  {
    id: 6,
    title: '6단계',
    subtitle: '계약기간이 끝난 후',
    description: '내용증명부터 시작해서 법적 절차까지 차근차근'
  },
  {
    id: 7,
    title: '7단계',
    subtitle: '특수 사기 유형 예방',
    description: '명의도용이나 브로커 사기 같은 특수한 케이스들'
  }
];
