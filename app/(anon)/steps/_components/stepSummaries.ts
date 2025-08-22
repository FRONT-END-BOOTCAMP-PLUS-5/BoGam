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
    subtitle: '집 고를 때 이것만은!',
    description: '깡통주택 사기 피하고 전세보증보험 조건도 확인해봐요'
  },
  {
    id: 2,
    title: '2단계',
    subtitle: '진짜 집주인 맞나요?',
    description: '가짜 임대인 피하고 등기부등본도 꼼꼼히 살펴봐요'
  },
  {
    id: 3,
    title: '3단계',
    subtitle: '부동산 중개사 믿어도 될까?',
    description: '공인중개사 자격증 확인하고 이중계약도 조심해요'
  },
  {
    id: 4,
    title: '4단계',
    subtitle: '계약할 때 놓치면 안 되는 것들',
    description: '전세권 설정하고 계약서에 특약조항도 꼭 넣어요'
  },
  {
    id: 5,
    title: '5단계',
    subtitle: '집주인 세금 체크해봐야죠',
    description: '납세증명서 확인하고 내 보증금 순위도 계산해봐요'
  },
  {
    id: 6,
    title: '6단계',
    subtitle: '보증금 안 돌려준다고요?',
    description: '내용증명부터 시작해서 법적 절차까지 차근차근'
  },
  {
    id: 7,
    title: '7단계',
    subtitle: '이런 사기도 있다고요?',
    description: '명의도용이나 브로커 사기 같은 특수한 케이스들'
  }
];
