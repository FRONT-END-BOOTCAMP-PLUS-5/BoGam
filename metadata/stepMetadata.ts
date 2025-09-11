// 메타데이터 관련 함수들을 관리하는 파일

// 단계별 메타데이터 타입 정의
export interface StepMetadata {
  title: string;
  description: string;
  keywords: string[];
}

// 단계별 맞춤 키워드 및 메타데이터
export const getStepSpecificMetadata = (stepNum: string): StepMetadata => {
  const step = parseInt(stepNum);
  
  switch (step) {
    case 1:
      return {
        title: `깡통주택 사기 피하기 | 전세 사기 예방 가이드 1단계 | BoGam`,
        description: `깡통주택 사기 피하기, 실거래가 확인, 등기부등본 분석, 전세반환보증보험 가입조건 확인 방법을 단계별로 안내합니다.`,
        keywords: [
          '깡통주택', '깡통주택 사기', '전세 사기', '등기부등본', '실거래가', '전세반환보증보험',
          '근저당권', '채권최고액', '납세증명서', '전세보증금', '전세 사기 예방', '안전한 전세',
          '전세계약', '임대인 확인', '전세 피해 예방', 'BoGam'
        ]
      };
    case 2:
      return {
        title: `가짜 임대인 피하기 | 전세 사기 예방 가이드 2단계 | BoGam`,
        description: `가짜 임대인 피하기, 신탁원부 확인, 등기부등본 상세분석, 확정일자 확인동의서 방법을 안내합니다.`,
        keywords: [
          '가짜 임대인', '임대인 확인', '신탁원부', '등기부등본 분석', '확정일자', '확정일자 확인동의서',
          '다가구주택', '대리인 계약', '명의도용', '전세 사기 예방', '안전한 전세계약', '임대인 위임장',
          '부동산 신탁', '전세보증금 보호', '전세 피해 예방', 'BoGam'
        ]
      };
    case 3:
      return {
        title: `공인중개사 확인 | 전세 사기 예방 가이드 3단계 | BoGam`,
        description: `공인중개사 자격증 확인, 최우선변제 금액 안내, 공제증서 발급 방법을 통해 안전한 계약서 작성을 돕습니다.`,
        keywords: [
          '공인중개사', '중개사 자격증', '최우선변제', '공제증서', '주택임대차보호법', '월셋집 전세',
          '이중계약', '중개사무소', '무자격 중개', '전세계약서', '안전한 계약', '전세보증금 보호',
          '전세 사기 예방', '전세 피해 예방', 'BoGam'
        ]
      };
    case 4:
      return {
        title: `계약 후 전세 사기 예방 | 전세 사기 예방 가이드 4단계 | BoGam`,
        description: `계약 후 등기부등본 확인, 특약조항 추가, 전입신고 확정일자, 전세권 설정 등기 방법을 안내합니다.`,
        keywords: [
          '계약 후 전세사기', '등기부등본 확인', '특약조항', '전입신고', '확정일자', '전세권 설정등기',
          '주택담보대출', '이중계약', '선순위 근저당', '신탁등기말소', '전세보증금 보호', '안전한 전세',
          '전세계약 특약', '전세 사기 예방', '전세 피해 예방', 'BoGam'
        ]
      };
    case 5:
      return {
        title: `입주 후 전세 사기 예방 | 전세 사기 예방 가이드 5단계 | BoGam`,
        description: `입주 후 납세증명서 확인, 등기부등본 압류가압류 확인, 전세보증금반환보증 가입 방법을 안내합니다.`,
        keywords: [
          '입주 후 전세사기', '납세증명서', '미납국세', '압류 가압류', '전세보증금반환보증', '전출신고',
          '대항력', '전세금 보호', '임대인 세금', '당해세', '경매', '전세사기 예방', '안전한 전세',
          '전세 피해 예방', 'BoGam'
        ]
      };
    case 6:
      return {
        title: `계약 종료 후 전세 사기 예방 | 전세 사기 예방 가이드 6단계 | BoGam`,
        description: `계약 종료 후 내용증명, 임차권등기명령, 지급명령 신청 방법을 통해 전세보증금 반환을 보장합니다.`,
        keywords: [
          '계약 종료', '전세보증금 반환', '내용증명', '임차권등기명령', '지급명령', '전세금 소송',
          '전세사기 예방', '보증금 회수', '법적 대응', '전세계약 종료', '안전한 전세', '전세 분쟁',
          '전세금 반환 소송', '전세 피해 예방', 'BoGam'
        ]
      };
    case 7:
      return {
        title: `전세 사기 사례 및 대처방법 | 전세 사기 예방 가이드 7단계 | BoGam`,
        description: `명의도용 대출사기, 브로커를 통한 전세보증사기 등 다양한 전세사기 사례와 대처방법을 안내합니다.`,
        keywords: [
          '전세사기 사례', '명의도용 대출', '브로커 사기', '전세대출보증', '명의 빌려주기', '전세보증 사기',
          '전세 사기', '전세 사기 예방', '사기 대처방법', '안전한 전세', '전세계약 주의사항',
          '전세 피해 예방', 'BoGam'
        ]
      };
    default:
      return {
        title: `전세 사기 예방 가이드 ${stepNum}단계 | BoGam`,
        description: `전세 ${stepNum}단계별 사기 예방 가이드와 체크리스트를 제공합니다.`,
        keywords: [
          '전세', '전세 사기', '전세 사기 예방', '가이드', `${stepNum}단계`, '체크리스트', '안전한 전세',
          '전세 피해 예방', '전세정보', 'BoGam'
        ]
      };
  }
};


// 단계별 JSON-LD 구조화 데이터 생성
export const getStepSpecificJsonLd = (stepNum: string, pages: any[]) => {
  const stepMetadata = getStepSpecificMetadata(stepNum);
  const step = parseInt(stepNum);
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? 'https://lion5-bogam.site' : 'http://localhost:3000';
  
  const stepNames = {
    1: "깡통주택 사기 피하기",
    2: "가짜 임대인 피하기", 
    3: "공인중개사 확인",
    4: "계약 후 전세 사기 예방",
    5: "입주 후 전세 사기 예방",
    6: "계약 종료 후 전세 사기 예방",
    7: "전세 사기 사례 및 대처방법"
  };

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": stepMetadata.title,
    "description": stepMetadata.description,
    "image": `${baseUrl}/images/Logo.png`,
    "url": `${baseUrl}/steps/${stepNum}`,
    "author": {
      "@type": "Organization",
      "name": "BoGam",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "BoGam",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/Logo.png`
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "inLanguage": "ko-KR",
    "about": {
      "@type": "Thing",
      "name": stepNames[step as keyof typeof stepNames] || "전세 사기 예방 가이드",
      "description": "전세 거래 시 발생할 수 있는 사기와 위험을 예방하는 방법"
    },
    "keywords": stepMetadata.keywords.join(", "),
    "step": pages.map((page, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": page.title,
      "text": page.type === 'general' 
        ? page.content 
        : page.type === 'summary' 
          ? page.contents?.map((c: { subtitle: string }) => c.subtitle).join(', ')
          : '',
      "url": `${baseUrl}/steps/${stepNum}#step-${index + 1}`,
      "image": `${baseUrl}/images/Logo.png`
    }))
  };
};
