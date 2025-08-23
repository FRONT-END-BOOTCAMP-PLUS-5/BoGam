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
    return <RealEstateContainer />;
  }

  // CombinedContent 타입인 경우 각 섹션을 별도 페이지로 처리
  if (stepContentData && stepContentData.dataType === 'CombinedContent' && stepContentData.sections) {
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

        {/* Swiper로 각 섹션을 별도 페이지로 렌더링 */}
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          className={styles.swiperContainer}
          onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {stepContentData.sections.map((section, sectionIndex) => (
            <SwiperSlide key={sectionIndex}>
              <div className={styles.mainContent}>
                {/* 각 섹션의 제목과 부제목 표시 */}
                {(section.title || section.subtitle) && (
                  <div className={styles.sectionHeader}>
                    {section.title && (
                      <h3 className={styles.sectionTitle}>{section.title}</h3>
                    )}
                    {section.subtitle && (
                      <p className={styles.sectionSubtitle}>{section.subtitle}</p>
                    )}
                  </div>
                )}
                
                {/* 섹션 타입에 따른 컴포넌트 렌더링 */}
                {section.type === 'TextOnly' && (
                  <TextOnly data={section.data} />
                )}
                {section.type === 'RadioGroup' && (
                  <RadioGroup data={section.data} />
                )}
                {section.type === 'Table' && (
                  <Table
                    data={section.data as unknown as { left: string; right?: string }[]}
                  />
                )}
                {section.type === 'List' && (
                  <List
                    data={section.data as unknown as { left: string; right?: string }[]}
                  />
                )}
                {section.type === 'DataGrid' && (
                  <DataGrid
                    data={section.data as unknown as { left: string; right?: string }[]}
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 페이지 네비게이션 */}
        <div className={styles.pageNavigation}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={styles.navButton}
          >
            이전
          </button>
          <span className={styles.pageIndicator}>
            {currentPage + 1} / {stepContentData.sections.length}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === stepContentData.sections.length - 1}
            className={styles.navButton}
          >
            다음
          </button>
        </div>
      </>
    );
  }

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

  // 기본 렌더링 (기존 JSON 데이터 기반)
  if (!stepContentData || !stepContentData.data) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      {/* 공통 헤더 렌더링 */}
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>
          {`${stepNumber}-${detail}단계 상세 보기`}
        </h2>
      </div>

      {/* Swiper로 각 페이지를 별도 슬라이드로 렌더링 */}
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        className={styles.swiperContainer}
        onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {stepContentData.data.map((pageData, pageIndex) => (
          <SwiperSlide key={pageIndex}>
            <div className={styles.mainContent}>
              {renderSwiperContent(pageData)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 페이지 네비게이션 */}
      <div className={styles.pageNavigation}>
        <button
          onClick={() => {
            setCurrentPage(currentPage - 1);
            if (swiperRef.current) {
              swiperRef.current.slideTo(currentPage - 1);
            }
          }}
          disabled={currentPage === 0}
          className={styles.navButton}
        >
          이전
        </button>
        <span className={styles.pageIndicator}>
          {currentPage + 1} / {stepContentData.data.length}
        </span>
        <button
          onClick={() => {
            setCurrentPage(currentPage + 1);
            if (swiperRef.current) {
              swiperRef.current.slideTo(currentPage + 1);
            }
          }}
          disabled={currentPage === stepContentData.data.length - 1}
          className={styles.navButton}
        >
          다음
        </button>
      </div>
    </>
  );
}
