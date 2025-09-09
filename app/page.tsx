import RootFlow from '@/(anon)/_components/onboarding/RootFlow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bogam',
  description: '전세 매물을 검색하고 리스크를 분석하여 안전한 전세 계약을 도와드립니다.',
  keywords: ['전세', '매물', '검색', '리스크', '분석', '부동산', '전세 사기', '전세 사기 예방', '가이드', '체크리스트', '안전한 전세', '전세 피해 예방', '전세정보', 'BoGam'],
  openGraph: {
    title: 'Bogam',
    description: '전세 매물을 검색하고 리스크를 분석하여 안전한 전세 계약을 도와드립니다.',
    type: 'website',
    url: 'https://lion5-bogam.site/',
    siteName: '전세보감',
    images: [
      {
        url: '/images/Logo.png', // 소셜 공유용 이미지
        width: 1200,
        height: 1200,
        alt: 'Bogam - 전세 매물 검색과 리스크 분석',
      },
    ],
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bogam',
    description: '전세 매물을 검색하고 리스크를 분석하여 안전한 전세 계약을 도와드립니다.',
    images: ['/images/Logo.png'],
  },
};

export default function Page() {
  return <RootFlow />;
}
