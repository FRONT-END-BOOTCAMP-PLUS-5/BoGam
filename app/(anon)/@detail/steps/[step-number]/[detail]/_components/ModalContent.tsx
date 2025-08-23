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
import CombinedContent from './contents/CombinedContent';
import { parseStepUrl } from '@utils/stepUrlParser';
import { LegacyContentSection, StepContentData } from './contents/types';
import { RealEstateContainer } from '@/(anon)/_components/common/realEstate/realEstateContainer/RealEstateContainer';

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
      } catch {
        console.log(
          `Step content data not found for step-${stepNumber}-${detail}, using default DataGrid`
        );
        setDataType('default');
      }
    };

    loadContentData();
  }, [stepNumber, detail]);

  // 단계별 컴포넌트 라우팅
  const renderStepComponent = () => {
    // 등기부등본 관련 라우팅인 경우 RealEstateContainer 반환
    if (isRealEstateRoute) {
      return <RealEstateContainer />;
    }

    // 기타 단계들은 기존 JSON 데이터 기반 렌더링
    return null;
  };

  // dataType에 따라 SwiperSlide 안에 들어갈 컴포넌트 결정
  const renderSwiperContent = (pageData: LegacyContentSection[]) => {
    // LegacyContentSection[]를 { left: string; right?: string }[]로 변환하는 함수
    const convertToTableData = (
      data: LegacyContentSection[]
    ): Array<{ left: string; right?: string }> => {
      return data.map((item, index) => ({
        left: item.title || `항목 ${index + 1}`,
        right: item.summary || item.contents?.join(', ') || undefined,
      }));
    };

    switch (dataType) {
      case 'TextOnly':
        return <TextOnly data={pageData} />;
      case 'Table':
        return (
          <Table
            data={pageData as unknown as { left: string; right?: string }[]}
          />
        );
      case 'List':
        return (
          <List
            data={pageData as unknown as { left: string; right?: string }[]}
          />
        );
      case 'DataGrid':
        return (
          <DataGrid
            data={pageData as unknown as { left: string; right?: string }[]}
          />
        );
      case 'RadioGroup':
        return <RadioGroup data={pageData} />;
      case 'CombinedContent':
        // CombinedContent의 경우 전체 stepContentData.sections를 전달
        return stepContentData && stepContentData.sections ? (
          <CombinedContent
            sections={stepContentData.sections}
            spacing='lg'
            showDividers={true}
          />
        ) : null;
      default:
        console.log('renderSwiperContent - default case, dataType:', dataType);
        return null;
    }
  };

  // 등기부등본 관련 특정 라우팅 조합들
  const realEstateRoutes = [
    { step: '1', detail: '1' },
    { step: '2', detail: '2' },
    { step: '6', detail: '3' },
    { step: '5', detail: '2' },
    { step: '4', detail: '1' },
  ];

  const isRealEstateRoute = realEstateRoutes.some(
    (route) => route.step === stepNumber && route.detail === detail
  );

  // 등기부등본 관련 라우팅인 경우 해당 컴포넌트 렌더링
  if (isRealEstateRoute) {
    return (
      <>
        {/* 공통 헤더 렌더링 */}
        <div className={styles.stepHeader}>
          <h2 className={styles.stepTitle}>
            {`${stepNumber}-${detail}단계 상세 보기`}
          </h2>
        </div>

        {/* 단계별 컴포넌트 렌더링 */}
        {renderStepComponent()}
      </>
    );
  }

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
        <DataGrid data={[]} />
      </div>
    </>
  );
}
