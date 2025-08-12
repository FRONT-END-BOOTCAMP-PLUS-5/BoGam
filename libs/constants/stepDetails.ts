// 단계별 상세 정보 상수
export interface StepDetailItem {
  key: string;
  value: string;
}

export interface StepDetailData {
  detailTitle: string;
  isSafe: boolean;
  expandableTitle: string;
  details: StepDetailItem[];
}

export interface StepDetailConfig {
  [stepNumber: string]: {
    [detail: string]: StepDetailData;
  };
}

// 3-1 단계 상세 정보
export const STEP_DETAILS: StepDetailConfig = {
  '3': {
    '1': {
      detailTitle: '3-1단계 상세 보기',
      isSafe: true,
      expandableTitle: '가짜 임대인 확인하기',
      details: [
        { key: '사업자상호', value: '신흥사부동산중개인사무소' },
        { key: '등록번호', value: '가123456-789' },
        { key: '중개업자면', value: '홍길동' },
        { key: '상태구분명', value: '영업중' },
        { key: '등록일자', value: '2016-08-15' },
        { key: '데이터기준일자', value: '2016-08-15' }
      ]
    },
    '2': {
      detailTitle: '3-2단계 상세 보기',
      isSafe: true,
      expandableTitle: '계약서 필수 조항 확인하기',
      details: [
        { key: '임대료', value: '월 50만원' },
        { key: '보증금', value: '500만원' },
        { key: '계약기간', value: '2년' },
        { key: '관리비', value: '월 5만원' },
        { key: '입주일', value: '2024-01-01' }
      ]
    },
    '3': {
      detailTitle: '3-3단계 상세 보기',
      isSafe: false,
      expandableTitle: '주의사항 확인하기',
      details: [
        { key: '특별약정', value: '없음' },
        { key: '해지조건', value: '계약서 참조' },
        { key: '연체이자', value: '연 20%' },
        { key: '분쟁해결', value: '소재지 관할법원' }
      ]
    }
  },
  '1': {
    '1': {
      detailTitle: '1-1단계 상세 보기',
      isSafe: true,
      expandableTitle: '부동산 기본 정보 확인하기',
      details: [
        { key: '주소', value: '서울시 강남구 테헤란로 123' },
        { key: '면적', value: '32.5㎡' },
        { key: '방향', value: '남향' },
        { key: '층수', value: '15층/25층' },
        { key: '준공년도', value: '2010년' }
      ]
    }
  },
  '2': {
    '1': {
      detailTitle: '2-1단계 상세 보기',
      isSafe: true,
      expandableTitle: '계약 조건 확인하기',
      details: [
        { key: '임대료', value: '월 50만원' },
        { key: '보증금', value: '500만원' },
        { key: '계약기간', value: '2년' },
        { key: '관리비', value: '월 5만원' }
      ]
    }
  }
};

// 단계별 제목 매핑
export const STEP_TITLES: Record<string, string> = {
  '1': '부동산 정보 확인할 때',
  '2': '계약 조건 확인할 때',
  '3': '계약서 확인할 때',
  '4': '계약 완료 후',
  '5': '이사 후 정리'
};

// 단계별 상세 정보를 가져오는 유틸리티 함수
export function getStepDetail(stepNumber: string, detail: string): StepDetailData | null {
  return STEP_DETAILS[stepNumber]?.[detail] || null;
}

// 단계 제목을 가져오는 유틸리티 함수
export function getStepTitle(stepNumber: string): string {
  return STEP_TITLES[stepNumber] || '단계별 가이드';
}

// 특정 단계의 모든 상세 정보를 가져오는 유틸리티 함수
export function getStepDetails(stepNumber: string): Record<string, StepDetailData> | null {
  return STEP_DETAILS[stepNumber] || null;
}
