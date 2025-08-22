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
    subtitle: '집 선택 시 주의사항',
    description: '깡통주택 사기 피하기 & 전세반환 보증보험 가입조건 확인'
  },
  {
    id: 2,
    title: '2단계',
    subtitle: '임대인 확인 절차',
    description: '가짜 임대인 피하기 & 등기부등본 상세 분석'
  },
  {
    id: 3,
    title: '3단계',
    subtitle: '중개사무소 사기 예방',
    description: '공인중개사 자격증 조회 & 이중계약 방지'
  },
  {
    id: 4,
    title: '4단계',
    subtitle: '전세권 설정 및 계약 보호',
    description: '전세권 설정 등기 & 계약서 특약조항 안내'
  },
  {
    id: 5,
    title: '5단계',
    subtitle: '세금 및 채권 우선순위 확인',
    description: '납세증명서 확인 & 우선변제권 계산'
  },
  {
    id: 6,
    title: '6단계',
    subtitle: '보증금 반환 절차',
    description: '내용증명 → 임차권등기명령 → 지급명령 신청'
  },
  {
    id: 7,
    title: '7단계',
    subtitle: '특수 사기 유형 예방',
    description: '명의도용 대출 사기 & 브로커 전세보증 사기 방지'
  }
];
