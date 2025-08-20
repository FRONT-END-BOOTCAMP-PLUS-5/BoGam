'use client';

import { styles } from './ModalContent.styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import DataGrid from './contents/DataGrid';
import TextOnly from './contents/TextOnly';
import Table from './contents/Table';
import List from './contents/List';

interface ContentSection {
  title?: string;
  subtitle?: string;
  contents?: string[];
  summary?: string;
}

interface StepContentData {
  dataType: string;
  data: ContentSection[][];
}

export default function ModalContent() {
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const [stepContentData, setStepContentData] = useState<StepContentData | null>(null);
  const [dataType, setDataType] = useState<string>('default');
  
  // URL에서 직접 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/');
  const stepNumber = pathParts[2]; // /steps/4/2 에서 4
  const detail = pathParts[3];     // /steps/4/2 에서 2

  // JSON 파일에서 콘텐츠 데이터 가져오기
  useEffect(() => {
    const loadContentData = async () => {
      try {
        // 정적 import 방식으로 변경
        if (stepNumber === '4' && detail === '2') {
          const contentModule = await import('./contents/data/step-4-2-contents.json');
          setStepContentData(contentModule.default);
          setDataType(contentModule.default.dataType || 'default');
        } else if (stepNumber === '4' && detail === '3') {
          const contentModule = await import('./contents/data/step-4-3-contents.json');
          setStepContentData(contentModule.default);
          setDataType(contentModule.default.dataType || 'default');
        } else if (stepNumber === '4' && detail === '4') {
          const contentModule = await import('./contents/data/step-4-4-contents.json');
          setStepContentData(contentModule.default);
          setDataType(contentModule.default.dataType || 'default');
        }
      } catch {
        console.log('Step content data not found, using default DataGrid');
        setDataType('default');
      }
    };

    loadContentData();
  }, [stepNumber, detail]);

  // dataType에 따라 SwiperSlide 안에 들어갈 컴포넌트 결정
  const renderSwiperContent = (pageData: ContentSection[]) => {
    switch (dataType) {
      case 'TextOnly':
        return <TextOnly data={pageData}/>;
      case 'Table':
        return <Table data={pageData as unknown as Record<string, string>} />;
      case 'List':
        return <List data={pageData as unknown as Record<string, string>} />;
      case 'DataGrid':
        return <DataGrid data={pageData as unknown as Record<string, string>} />;
      default:
        return null;
    }
  };

  // JSON 데이터가 있는 경우 JSON의 data 배열을 페이지로 사용
  if (stepContentData && stepContentData.dataType && stepContentData.data) {
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      if (swiperRef.current) {
        swiperRef.current.slideTo(page);
      }
    };

    return (
      <>
        {/* 공통 헤더 렌더링 */}
        <div className={styles.stepHeader}>
          <h2 className={styles.stepTitle}>
            {`${stepNumber}-${detail}단계 상세 보기`}
          </h2>
        </div>

        {/* Swiper로 JSON의 data 배열 항목 하나당 한 페이지 */}
        <Swiper 
          spaceBetween={50} 
          slidesPerView={1} 
          className={styles.swiperContainer}
          onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {stepContentData.data.map((pageData: ContentSection[], pageIndex: number) => (
            <SwiperSlide key={pageIndex}>
              <div className={styles.mainContent}>
                {renderSwiperContent(pageData)}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 페이지 인디케이터 */}
        {stepContentData.data.length > 1 && (
          <div className={styles.pageIndicator} aria-label="페이지 인디케이터">
            {stepContentData.data.map((_: unknown, index: number) => (
              <button
                key={index}
                className={`${styles.pageDot} ${
                  index === currentPage ? styles.pageDotActive : styles.pageDotInactive
                }`}
                aria-label={`페이지 ${index + 1}${index === currentPage ? ' (현재)' : ''}`}
                onClick={() => handlePageChange(index)}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  // JSON 데이터가 없는 경우 기본 DataGrid 표시
  return (
    <>
      {/* 공통 헤더 렌더링 */}
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>
          {`${stepNumber}-${detail}단계 상세 보기`}
        </h2>
      </div>

      {/* 기본 DataGrid 표시 */}
      <div className={styles.mainContent}>
        <DataGrid data={{}} />
      </div>
    </>
  );
}
