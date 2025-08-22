import { styles } from './ModalContent.styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import DataGrid from './contents/DataGrid';
import TextOnly from './contents/TextOnly';
import Table from './contents/Table';
import List from './contents/List';
import RadioGroup from './contents/RadioGroup';
import Link from './contents/Link';
import BrokerForm from './contents/BrokerForm';
import { parseStepUrl } from '@utils/stepUrlParser';
import { LegacyContentSection } from './contents/types';

interface ContentSection {
  title?: string;
  subtitles?: string[];
  contents?: string[];
  contentSections?: Array<{
    subtitle: string;
    contents: string[];
  }>;
  summary?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  button?: {
    text: string;
    onClick?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    href?: string;
    fullWidth?: boolean;
  };
  buttons?: Array<{
    text: string;
    onClick?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    href?: string;
    fullWidth?: boolean;
  }>;
}

interface StepContentData {
  dataType: string;
  data: ContentSection[][];
  columns?: 2 | 3;
  title?: string;
  emptyRows?: number;
}

export default function ModalContent() {
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const [stepContentData, setStepContentData] =
    useState<StepContentData | null>(null);
  const [dataType, setDataType] = useState<string>('default');

  // URL에서 직접 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepUrlData = parseStepUrl(pathname);
  const stepNumber = stepUrlData?.stepNumber?.toString() || '1';
  const detail = stepUrlData?.detail?.toString() || '1';

  // JSON 파일에서 콘텐츠 데이터 가져오기
  useEffect(() => {
    const loadContentData = async () => {
      try {
        // 동적 import로 stepNumber와 detail을 자동 조합
        const contentModule = await import(
          `./contents/data/step-${stepNumber}-${detail}-contents.json`
        );
        setStepContentData(contentModule.default);
        setDataType(contentModule.default.dataType || 'default');
      } catch (error) {
        console.log(
          `Step content data not found for step-${stepNumber}-${detail}, using default DataGrid`
        );
        setDataType('default');
      }
    };

    loadContentData();
  }, [stepNumber, detail]);

  // dataType에 따라 SwiperSlide 안에 들어갈 컴포넌트 결정
  const renderSwiperContent = (pageData: LegacyContentSection[]) => {
  
    switch (dataType) {
      case 'TextOnly':
        return <TextOnly data={pageData} />;
      case 'Table':
        return <Table data={pageData as any} columns={stepContentData?.columns || 2} title={stepContentData?.title || '제출 서류'} emptyRows={stepContentData?.emptyRows || 0} />;
      case 'List':
        return <List data={pageData as unknown as Record<string, string>} />;
      case 'DataGrid':
        return <DataGrid data={pageData as unknown as Record<string, string>} />;
      case 'RadioGroup':
        return <RadioGroup data={pageData}/>;
      case 'Link':
        return <Link data={pageData as any} title={stepContentData?.title} />;
      case 'BrokerForm':
        return <BrokerForm data={pageData as any} title={stepContentData?.title} />;
      default:
        console.log('renderSwiperContent - default case, dataType:', dataType);
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
          {stepContentData.data.map(
            (pageData: LegacyContentSection[], pageIndex: number) => (
              <SwiperSlide key={pageIndex}>
                <div className={styles.mainContent}>
                  {renderSwiperContent(pageData)}
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>

        {/* 페이지 인디케이터 */}
        {stepContentData.data.length > 1 && (
          <div className={styles.pageIndicator} aria-label='페이지 인디케이터'>
            {stepContentData.data.map((_: unknown, index: number) => (
              <button
                key={index}
                className={`${styles.pageDot} ${
                  index === currentPage
                    ? styles.pageDotActive
                    : styles.pageDotInactive
                }`}
                aria-label={`페이지 ${index + 1}${
                  index === currentPage ? ' (현재)' : ''
                }`}
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