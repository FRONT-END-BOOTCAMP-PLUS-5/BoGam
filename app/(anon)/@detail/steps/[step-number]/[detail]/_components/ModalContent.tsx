'use client';

import { styles } from './ModalContent.styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useState, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import DataGrid from './contents/DataGrid';

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
  stepData: StepData | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function ModalContent({ stepData, isLoading, isError }: ModalContentProps) {
  const detailsEntries = Object.entries(stepData?.details || {});
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  // 20개씩 그룹화
  const groupedEntries: Record<string, string>[] = [];
  for (let i = 0; i < detailsEntries.length; i += 20) {
    const group = detailsEntries.slice(i, i + 20);
    const groupObj: Record<string, string> = {};
    group.forEach(([key, value]) => {
      groupObj[key] = value;
    });
    groupedEntries.push(groupObj);
  }


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (swiperRef.current) {
      swiperRef.current.slideTo(page);
    }
  };

  // 공통 헤더 렌더링
  const renderHeader = () => (
    <div className={styles.stepHeader}>
      <h2 className={styles.stepTitle}>
        {stepData ? `${stepData.mainNum}-${stepData.subNum}단계 상세 보기` : '단계 상세 보기'}
      </h2>
    </div>
  );

  // 로딩 상태
  if (isLoading) {
    return (
      <>
        {renderHeader()}
        
        {/* 로딩 콘텐츠 */}
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>로딩 중...</div>
        </div>
      </>
    );
  }

  // 에러 상태
  if (isError || !stepData) {
    return (
      <>
        {renderHeader()}
        
        {/* 에러 콘텐츠 */}
        <div className={styles.errorContainer}>
          <div className={styles.errorText}>
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        </div>
      </>
    );
  }

  // 정상 상태
  return (
    <>
      {renderHeader()}

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
               <DataGrid data={group} />
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
