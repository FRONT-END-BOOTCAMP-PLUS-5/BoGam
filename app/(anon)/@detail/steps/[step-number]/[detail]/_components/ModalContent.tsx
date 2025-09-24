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
import {
  LegacyContentSection,
  StepContentData
} from './contents/types';
import { RealEstateContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/realEstate/realEstateContainer/RealEstateContainer';
import { BrokerContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/broker/brokerContainer/BrokerContainer';
import { TaxCertWrapperRef } from './contents/TaxCertWrapper';
import { TransactionSearchWrapperRef } from './contents/TransactionSearchWrapper';
import { TransactionSearchContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/transactionSearch/transactionSearchContainer/TransactionSearchContainer';
import { PageIndicator } from './PageIndicator';
import CombinedContent from './contents/CombinedContent';

// RegionData 타입 정의 (기존 호환성을 위해 유지)
interface RegionData {
  region: string;
  depositRange: string;
  priorityAmount: string;
  option: string;
}

interface ModalContentProps {
  onShowSimpleAuthModal: () => void;
  onSimpleAuthApprove: () => void;
  onSimpleAuthCancel: () => void;
  taxCertContainerRef?: React.RefObject<TaxCertWrapperRef | null>;
  transactionSearchContainerRef?: React.RefObject<TransactionSearchWrapperRef | null>;
}

export default function ModalContent({
  onShowSimpleAuthModal,
  onSimpleAuthApprove,
  onSimpleAuthCancel,
  taxCertContainerRef,
  transactionSearchContainerRef,
}: ModalContentProps) {
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

  // 특별한 컴포넌트는 JSON 파일로 처리

  // JSON 파일에서 콘텐츠 데이터 가져오기
  useEffect(() => {
    const loadContentData = async () => {
      try {
        const contentModule = await import(
          `./contents/data/step-${stepNumber}-${detail}-contents.json`
        );
        setStepContentData(contentModule.default);
        setDataType(contentModule.default.dataType || 'default');
      } catch {
        setDataType('default');
      }
    };

    loadContentData();
  }, [stepNumber, detail]);

  // Swiper 콘텐츠 렌더링 함수
  const renderSwiperContent = (pageData: LegacyContentSection[]) => {
    switch (dataType) {
      case 'TextOnly':
        return <TextOnly data={pageData} />;
      case 'List':
        return (
          <List
            title={(pageData[0] as { title?: string })?.title}
            data={pageData as unknown as string[]}
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
      case 'RealEstateContainer':
        return <RealEstateContainer />;
      case 'BrokerContainer':
        return <BrokerContainer />;
      case 'TransactionSearchContainer':
        return <TransactionSearchContainer />;
      default:
        return null;
    }
  };

  // 스크롤을 맨 위로 올리는 함수
  const scrollToTop = () => {
    // CSS 클래스명에 공백이 있으므로 직접 스타일 속성으로 찾기
    const scrollableContainer = document.querySelector(
      '[class*="max-h-[calc(100vh-200px)]"]'
    ) as HTMLElement;
    if (scrollableContainer) {
      scrollableContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (swiperRef.current) {
      swiperRef.current.slideTo(page);
    }
    // 페이지 변경 시 스크롤을 맨 위로 올리기
    scrollToTop();
  };

  // 공통 헤더 컴포넌트
  const StepHeader = () => (
    <div className={styles.stepHeader}>
      <h2 className={styles.stepTitle}>
        {`${stepNumber}-${detail}단계 상세 보기`}
      </h2>
    </div>
  );


  // CombinedContent 타입인 경우 sections를 사용하여 type별로 스와이퍼 분리
  if (
    stepContentData &&
    stepContentData.dataType === 'CombinedContent' &&
    stepContentData.sections
  ) {
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      if (swiperRef.current) {
        swiperRef.current.slideTo(page);
      }
    };

    return (
      <>
        <StepHeader />
        <CombinedContent
          sections={stepContentData.sections}
          stepNumber={stepNumber}
          detail={detail}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onShowSimpleAuthModal={onShowSimpleAuthModal}
          onSimpleAuthApprove={onSimpleAuthApprove}
          onSimpleAuthCancel={onSimpleAuthCancel}
          taxCertContainerRef={taxCertContainerRef}
          transactionSearchContainerRef={transactionSearchContainerRef}
          swiperRef={swiperRef}
        />
      </>
    );
  }

  // JSON 데이터가 있는 경우 렌더링
  if (stepContentData && stepContentData.dataType) {
    // Table 타입인 경우 Swiper 없이 직접 렌더링
    if (stepContentData.dataType === 'Table') {
      return (
        <>
          <StepHeader />
          <div className={styles.scrollableContent}>
            <div className={styles.swiperContainer}>
              <div className={styles.mainContent}>
                <Table
                  title={stepContentData.title || '테이블 제목'}
                  columnTitles={stepContentData.columnTitles || ['1', '2', '3']}
                  description={stepContentData.description}
                  data={stepContentData.data as unknown as RegionData[]}
                />
              </div>
            </div>
          </div>
        </>
      );
    }

    // data가 없는 경우 (특별한 컴포넌트들)
    if (!stepContentData.data) {
      return (
        <>
          <StepHeader />
          <div className={styles.scrollableContent}>
            <div className={styles.swiperContainer}>
              <div className={styles.mainContent}>
                {renderSwiperContent([])}
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <StepHeader />

        <div className={styles.scrollableContent}>
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            className={styles.swiperContainer}
            onSlideChange={(swiper) => {
              setCurrentPage(swiper.activeIndex);
              scrollToTop();
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {stepContentData.data.map(
              (pageData: LegacyContentSection[], pageIndex: number) => (
                <SwiperSlide key={pageIndex}>
                  <div
                    className={styles.mainContent}
                    style={{ paddingBottom: '80px' }}
                  >
                    {renderSwiperContent(pageData)}
                  </div>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>

        {/* 페이지 인디케이터 */}
        <PageIndicator
          totalPages={stepContentData.data.length}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </>
    );
  }

  // 기본 DataGrid 표시
  return (
    <>
      <StepHeader />
      <div className={styles.scrollableContent}>
        <div className={styles.mainContent} style={{ paddingBottom: '80px' }}>
          <DataGrid data={[]} />
        </div>
      </div>
    </>
  );
}
