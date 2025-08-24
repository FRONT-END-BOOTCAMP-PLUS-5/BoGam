import { styles } from './ModalContent.styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import DataGrid from './contents/DataGrid';
import TextOnly from './contents/TextOnly';
import Table from './contents/Table';
import List from './contents/List';
import CheckListGroup from './contents/CheckListGroup';
import RadioGroup from './contents/RadioGroup';
import { parseStepUrl } from '@utils/stepUrlParser';
import { LegacyContentSection, StepContentData } from './contents/types';
import { TaxCertContainer } from '@/(anon)/_components/common/taxCert/taxCertContainer/TaxCertContainer';
import { RealEstateContainer } from '@/(anon)/_components/common/realEstate/realEstateContainer/RealEstateContainer';
import { BrokerContainer } from '@/(anon)/_components/common/broker/brokerContainer/BrokerContainer';

export default function ModalContent() {
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const [stepContentData, setStepContentData] =
    useState<StepContentData | null>(null);
  const [dataType, setDataType] = useState<string>('default');

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepUrlData = parseStepUrl(pathname);
  const stepNumber = stepUrlData?.stepNumber?.toString() || '1';
  const detail = stepUrlData?.detail?.toString() || '1';

  // 특별한 컴포넌트를 사용할 단계들 정의
  const specialSteps = {
    taxCert:
      (stepNumber === '1' && detail === '5') ||
      (stepNumber === '5' && detail === '1'),
    broker: stepNumber === '3' && detail === '1',
    realEstate: [
      { step: '1', detail: '3' },
      { step: '2', detail: '3' },
      { step: '6', detail: '3' },
      { step: '5', detail: '2' },
      { step: '4', detail: '1' },
    ].some((route) => route.step === stepNumber && route.detail === detail),
  };

  // JSON 파일에서 콘텐츠 데이터 가져오기 (특별한 컴포넌트가 아닌 경우에만)
  useEffect(() => {
    const shouldLoadJsonData =
      !specialSteps.taxCert && !specialSteps.broker && !specialSteps.realEstate;
    if (shouldLoadJsonData) {
      const loadContentData = async () => {
        try {
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
    }
  }, [stepNumber, detail, specialSteps]);

  // 특별한 컴포넌트 렌더링 함수
  const renderSpecialComponent = () => {
    if (specialSteps.taxCert) {
      return <TaxCertContainer />;
    }

    if (specialSteps.broker) {
      return <BrokerContainer />;
    }

    if (specialSteps.realEstate) {
      return <RealEstateContainer />;
    }

    return null;
  };

  // Swiper 콘텐츠 렌더링 함수
  const renderSwiperContent = (pageData: LegacyContentSection[]) => {
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
      case 'CheckListGroup':
        return <CheckListGroup data={pageData} />;
      case 'RadioGroup':
        return <RadioGroup data={pageData} />;
      default:
        console.log('renderSwiperContent - default case, dataType:', dataType);
        return null;
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (swiperRef.current) {
      swiperRef.current.slideTo(page);
    }
  };

  // 공통 헤더 컴포넌트
  const StepHeader = () => (
    <div className={styles.stepHeader}>
      <h2 className={styles.stepTitle}>
        {`${stepNumber}-${detail}단계 상세 보기`}
      </h2>
    </div>
  );

  // 특별한 컴포넌트가 있는 경우 렌더링
  const specialComponent = renderSpecialComponent();
  if (specialComponent) {
    return (
      <>
        <StepHeader />
        <div className={styles.scrollableContent}>
          <div className={styles.mainContent}>{specialComponent}</div>
        </div>
      </>
    );
  }

  // CombinedContent 타입인 경우 sections를 사용
  if (stepContentData && stepContentData.dataType === 'CombinedContent' && stepContentData.sections) {
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      if (swiperRef.current) {
        swiperRef.current.slideTo(page);
      }
    };

    return (
      <>
        <StepHeader />

        <div className={styles.scrollableContent}>
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
        </div>

        {/* Swiper로 각 섹션을 별도 슬라이드로 렌더링 */}
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
                {section.type === 'CheckListGroup' && (
                  <CheckListGroup data={section.data} />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* 페이지 인디케이터 */}
        {stepContentData.sections.length > 1 && (
          <div className={styles.pageIndicator} aria-label='페이지 인디케이터'>
            {stepContentData.sections.map((_: unknown, index: number) => (
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

  // JSON 데이터가 있는 경우 Swiper로 렌더링
  if (stepContentData && stepContentData.dataType && stepContentData.data) {
    return (
      <>
        <StepHeader />

        <div className={styles.scrollableContent}>
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
        </div>

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

  // 기본 DataGrid 표시
  return (
    <>
      <StepHeader />
      <div className={styles.scrollableContent}>
        <div className={styles.mainContent}>
          <DataGrid data={[]} />
        </div>
      </div>
    </>
  );
}
