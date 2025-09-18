// 메인 페이지 메타데이터 관리 파일

import { Metadata } from 'next';

// 메인 페이지 메타데이터
export const mainPageMetadata: Metadata = {
  title: 'Bogam',
  description: '전세 매물을 검색하고 리스크를 분석하여 안전한 전세 계약을 도와드립니다.',
  keywords: [
    '전세', '매물', '검색', '리스크', '분석', '부동산', 
    '전세 사기', '전세 사기 예방', '가이드', '체크리스트', 
    '안전한 전세', '전세 피해 예방', '전세정보', 'BoGam'
  ],
  openGraph: {
    title: 'Bogam',
    description: '전세 매물을 검색하고 리스크를 분석하여 안전한 전세 계약을 도와드립니다.',
    type: 'website',
    url: 'https://lion5-bogam.site/',
    siteName: '전세보감',
    images: [
      {
        url: '/images/Logo.png',
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

// 메인 페이지 JSON-LD 구조화 데이터
export const getMainPageJsonLd = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? 'https://lion5-bogam.site' : 'http://localhost:3000';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bogam",
    "description": "전세 매물을 검색하고 리스크를 분석하여 안전한 전세 계약을 도와드리는 서비스",
    "url": baseUrl,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    },
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
    "keywords": "전세, 매물, 검색, 리스크, 분석, 부동산, 전세 사기 예방, 안전한 전세",
    "featureList": [
      "전세 매물 검색",
      "리스크 분석",
      "전세 사기 예방 가이드",
      "체크리스트 제공",
      "안전한 전세 계약 지원"
    ]
  };
};
