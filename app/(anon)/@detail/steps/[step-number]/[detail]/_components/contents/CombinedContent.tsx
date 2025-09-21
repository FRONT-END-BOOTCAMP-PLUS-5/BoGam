'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import type { Swiper as SwiperType } from 'swiper';
import { styles } from './CombinedContent.styles';
import { ContentSection } from './types';
import DataGrid from './DataGrid';
import TextOnly from './TextOnly';
import Table from './Table';
import List from './List';
import CheckListGroup from './CheckListGroup';
import RadioGroup from './RadioGroup';
import { RealEstateContainer } from '@/(anon)/_components/common/realEstate/realEstateContainer/RealEstateContainer';
import GuaranteeLimitContainer from '@/(anon)/_components/common/guaranteeLimit/GuaranteeLimitContainer';
import TaxCertWrapper, { TaxCertWrapperRef } from './TaxCertWrapper';
import { PageIndicator } from '../PageIndicator';

interface CombinedContentProps {
  sections: ContentSection[];
  stepNumber: string;
  detail: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onShowSimpleAuthModal: () => void;
  onSimpleAuthApprove: () => void;
  onSimpleAuthCancel: () => void;
  taxCertContainerRef?: React.RefObject<TaxCertWrapperRef | null>;
  swiperRef: React.RefObject<SwiperType | null>;
}

export default function CombinedContent({
  sections,
  currentPage,
  onPageChange,
  onShowSimpleAuthModal,
  onSimpleAuthApprove,
  onSimpleAuthCancel,
  taxCertContainerRef,
  swiperRef,
}: CombinedContentProps) {

  // 스크롤을 맨 위로 올리는 함수
  const scrollToTop = () => {
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

  return (
    <>
      <div className={styles.scrollableContent}>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          className={styles.swiperContainer}
          onSlideChange={(swiper) => {
            onPageChange(swiper.activeIndex);
            scrollToTop();
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {sections.map((section, sectionIndex) => (
            <SwiperSlide key={sectionIndex}>
              <div
                className={styles.mainContent}
                style={{ paddingBottom: '80px' }}
              >
                {/* 모든 섹션을 통일된 방식으로 처리 */}
                {(section.title || section.subtitle) && (
                  <div className={styles.sectionHeader}>
                    {section.title && (
                      <h3 className={styles.sectionTitle}>
                        {section.title}
                      </h3>
                    )}
                    {section.subtitle && (
                      <p className={styles.sectionSubtitle}>
                        {section.subtitle}
                      </p>
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
                    title={
                      section.title || '소액보증금 최우선변제 기준 변천사'
                    }
                    columnTitles={
                      section.columnTitles || [
                        '지역',
                        '소액보증금의 범위',
                        '최우선변제금액',
                      ]
                    }
                    data={section.data || []}
                  />
                )}
                {section.type === 'List' && (
                  <List
                    title={section.title}
                    data={
                      section.data as Array<{
                        title: string;
                        content: string;
                      }>
                    }
                  />
                )}
                {section.type === 'DataGrid' && (
                  <DataGrid
                    data={
                      section.data as unknown as {
                        left: string;
                        right?: string;
                      }[]
                    }
                  />
                )}
                {section.type === 'CheckListGroup' && (
                  <CheckListGroup data={section.data} />
                )}
                {(section.type === 'TaxCertIntro' ||
                  section.type === 'TaxCertContainer') && (
                  <TaxCertWrapper
                    sectionIndex={sectionIndex}
                    section={section}
                    onShowSimpleAuthModal={onShowSimpleAuthModal}
                    onSimpleAuthApprove={onSimpleAuthApprove}
                    onSimpleAuthCancel={onSimpleAuthCancel}
                    ref={taxCertContainerRef}
                  />
                )}
                {section.type === 'RealEstateContainer' && (
                  <RealEstateContainer />
                )}
                {section.type === 'GuaranteeLimit' && (
                  <GuaranteeLimitContainer />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 페이지 인디케이터 */}
      <PageIndicator
        totalPages={sections.length}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </>
  );
}
