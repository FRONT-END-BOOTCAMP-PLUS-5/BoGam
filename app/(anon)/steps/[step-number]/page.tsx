import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { styles } from './page.styles';
import ProgressBarChart from '@/(anon)/_components/common/stateIcon/ProgressBarChart';
import FlipBookSection from '@/(anon)/steps/[step-number]/_components/FlipBookSection';
import FlipPages, { PageData } from '@/(anon)/steps/[step-number]/_components/FlipPages';
import { getStepSpecificMetadata, getStepSpecificJsonLd } from '@metadata/stepMetadata';

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
  
  // 환경별 API URL 설정
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
  const jsonLd = getStepSpecificJsonLd(stepNumber, pages);
  
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