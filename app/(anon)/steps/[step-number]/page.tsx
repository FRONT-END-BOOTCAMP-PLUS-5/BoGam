import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { styles } from './page.styles';
import StateIcon from '@/(anon)/_components/common/stateIcon/StateIcon';
import ProgressBarChart from '@/(anon)/_components/common/stateIcon/ProgressBarChart';
import FlipBookSection from '@/(anon)/steps/[step-number]/_components/FlipBookSection';
import FlipPages, { PageData } from '@/(anon)/steps/[step-number]/_components/FlipPages';

// API 응답 타입 정의
interface StepResultSummary {
  stepCount: number;
  stepNumber: number;
  totalMatch: number;
  totalMismatch: number;
  totalUnchecked: number;
}

interface StepResultItem {
  id: number;
  userAddressId: number;
  stepId: number;
  stepNumber: number;
  mismatch: number;
  match: number;
  unchecked: number;
  jsonDetails: Record<string, 'match' | 'mismatch' | 'unchecked'>;
  createdAt: string;
  updatedAt: string;
  detail: number;
}

interface StepResultResponse {
  results: StepResultItem[];
  summary: StepResultSummary;
}


// 단계별 맞춤 키워드 및 메타데이터 (공통 함수)
const getStepSpecificMetadata = (stepNum: string) => {
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

// 메타데이터 생성 함수
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ 'step-number': string }> 
}): Promise<Metadata> {
  const { 'step-number': stepNumber } = await params;
  
  // 환경별 API URL 설정
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? 'https://lion5-bogam.site' : 'http://localhost:3000';
  
  // 페이지 데이터 가져오기
  let pages: PageData[] = [];
  try {
    const pagesData = await import(`./stepData/${stepNumber}.json`);
    if (Array.isArray(pagesData.default)) {
      pages = pagesData.default[0]?.pages || [];
    } else if (pagesData.default?.pages) {
      pages = pagesData.default.pages;
    } else if (Array.isArray(pagesData)) {
      pages = pagesData[0]?.pages || [];
    } else if (pagesData.pages) {
      pages = pagesData.pages;
    }
  } catch (error) {
    console.error('JSON 파일 로드 실패:', error);
    pages = [];
  }

  const stepMetadata = getStepSpecificMetadata(stepNumber);

  return {
    title: stepMetadata.title,
    description: stepMetadata.description,
    keywords: stepMetadata.keywords,
    openGraph: {
      title: stepMetadata.title,
      description: stepMetadata.description,
      type: 'website',
      url: `${baseUrl}/steps/${stepNumber}`,
      siteName: 'BoGam',
      images: [
        {
          url: `${baseUrl}/images/Logo.png`,
          width: 1200,
          height: 630,
          alt: `${stepMetadata.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: stepMetadata.title,
      description: stepMetadata.description,
      images: [`${baseUrl}/images/Logo.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/steps/${stepNumber}`,
    },
    other: {
      'application-name': 'BoGam',
      'apple-mobile-web-app-title': 'BoGam',
      'msapplication-TileColor': '#2563eb',
      'theme-color': '#2563eb',
    },
  };
}

export default async function MiddleStepPage({ 
  params 
}: { 
  params: Promise<{ 'step-number': string }> 
}) {
  const { 'step-number': stepNumber } = await params;
  
  // 환경별 API URL 설정 (중복 제거)
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? 'https://lion5-bogam.site' : 'http://localhost:3000';

  // 서버에서 페이지 데이터 가져오기
  let pages: PageData[] = [];
  try {
    const pagesData = await import(`./stepData/${stepNumber}.json`);
    if (Array.isArray(pagesData.default)) {
      pages = pagesData.default[0]?.pages || [];
    } else if (pagesData.default?.pages) {
      pages = pagesData.default.pages;
    } else if (Array.isArray(pagesData)) {
      pages = pagesData[0]?.pages || [];
    } else if (pagesData.pages) {
      pages = pagesData.pages;
    }
  } catch (error) {
    console.error('JSON 파일 로드 실패:', error);
    pages = [];
  }

  // 서버에서 선택된 주소 가져오기
  // 임시로 전체 주소를 가져와서 isSelected가 true인 주소를 가져옴
  // 추후 선택된 주소를 가져오는 api가 구현되면 해당 api를 사용하는 로직으로 변경
  let selectedAddressNickname: string | null = null;
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${baseUrl}/api/user-address/my-address-list`, {
      cache: 'no-store',
      headers: {
        'Cookie': cookieStore.toString(),
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        const selectedAddr = data.data?.find((addr: { isSelected: boolean; nickname: string }) => addr.isSelected);
        if (selectedAddr) {
          selectedAddressNickname = selectedAddr.nickname;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching selected address:', error);
  }

  // 서버에서 stepResults 데이터 가져오기
  let stepData: StepResultResponse | null = null;
  if (selectedAddressNickname) {
    try {
      const cookieStore = await cookies();
      const response = await fetch(
        `${baseUrl}/api/step-results?userAddressNickname=${encodeURIComponent(selectedAddressNickname)}&stepNumber=${stepNumber}`,
        {
          cache: 'no-store',
          headers: {
            'Cookie': cookieStore.toString(),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          stepData = data.data;
        }
      }
    } catch (error) {
      console.error('Error fetching step data:', error);
    }
  }

  // 서버에서 FlipPages 렌더링
  const flipPages = FlipPages({ pages, stepNumber });
  
  // 단계별 맞춤 JSON-LD 구조화 데이터 생성
  const getStepSpecificJsonLd = (stepNum: string) => {
    const stepMetadata = getStepSpecificMetadata(stepNum);
    const step = parseInt(stepNum);
    
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
      "url": `${baseUrl}/steps/${stepNumber}`,
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
        "url": `${baseUrl}/steps/${stepNumber}#step-${index + 1}`,
        "image": `${baseUrl}/images/Logo.png`
      }))
    };
  };

  const jsonLd = getStepSpecificJsonLd(stepNumber);
  
  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className={styles.mainContainer} role="main">
        <header className={styles.stateIconArea} role="banner">
          <h1 className={styles.srOnly}>{stepNumber}단계: 전세 안전 가이드</h1>
          <section aria-label="진행 상황">
            <div className={styles.progressContainer}>
              <ProgressBarChart 
                stepNumber={stepNumber}
                userAddressNickname={selectedAddressNickname || ''}
                initialData={{
                  match: stepData?.summary?.totalMatch || 0,
                  unchecked: stepData?.summary?.totalUnchecked || 0,
                  mismatch: stepData?.summary?.totalMismatch || 0,
                }}
              />
            </div>
          </section>
        </header>
        
        <section className={styles.flipBookArea} aria-label="단계별 가이드">
          <FlipBookSection
            flipPages={flipPages}
            stepNumber={stepNumber}
          />
        </section>
      </main>
    </>
  );
 }