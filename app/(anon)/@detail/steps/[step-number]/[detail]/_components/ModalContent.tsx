'use client';

import { styles } from './ModalContent.styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';
import { useState, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';

interface StepData {
  id: number;
  userAddressId: number;
  stepId: number;
  mismatch: number;
  match: number;
  unchecked: number;
  details: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  mainNum: number;
  subNum: number;
}

interface ModalContentProps {
  stepData: StepData;
}

export default function ModalContent({ stepData }: ModalContentProps) {
  const detailsEntries = Object.entries(stepData.details);
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  // 20개씩 그룹화
  const groupedEntries = [];
  for (let i = 0; i < detailsEntries.length; i += 20) {
    groupedEntries.push(detailsEntries.slice(i, i + 20));
  }

  // value 값에 따라 렌더링할 내용 결정
  const renderValue = (value: string) => {
    if (value === 'match') {
      return <CircularIconBadge type="match" size="xsm" />;
    }
    if (value === 'mismatch') {
      return <CircularIconBadge type="mismatch" size="xsm" />;
    }
    if (value === 'unchecked') {
      return <CircularIconBadge type="unchecked" size="xsm" />;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (swiperRef.current) {
      swiperRef.current.slideTo(page);
    }
  };

  return (
    <>
      {/* 스텝 번호 표시 */}
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>
          {stepData.mainNum}-{stepData.subNum}단계 상세 보기
        </h2>
      </div>

      {/* Swiper로 20개씩 그룹화된 슬라이드 */}
      <Swiper 
        spaceBetween={50} 
        slidesPerView={1} 
        className={styles.swiperContainer}
        onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {groupedEntries.map((group, groupIndex) => (
          <SwiperSlide key={groupIndex}>
            <div className={styles.mainContent}>
              {group.map(([key, value]) => (
                <div key={key} className={styles.detailItem}>
                  <span className={styles.detailKey}>
                    {key}:
                  </span>
                  <div className={styles.detailValue}>
                    {renderValue(value)}
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 페이지 인디케이터 */}
      {groupedEntries.length > 1 && (
        <div className={styles.pageIndicator} aria-label="페이지 인디케이터">
          {groupedEntries.map((_, index) => (
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
