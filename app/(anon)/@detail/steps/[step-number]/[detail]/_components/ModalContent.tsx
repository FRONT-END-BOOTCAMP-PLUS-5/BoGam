'use client';

import { modalContentStyles } from './ModalContent.styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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

  // 20개씩 그룹화
  const groupedEntries = [];
  for (let i = 0; i < detailsEntries.length; i += 20) {
    groupedEntries.push(detailsEntries.slice(i, i + 20));
  }

  return (
    <>
      {/* 스텝 번호 표시 */}
      <div className={modalContentStyles.stepHeader}>
        <h2 className={modalContentStyles.stepTitle}>
          {stepData.mainNum}-{stepData.subNum}단계 상세 보기
        </h2>
      </div>

      {/* Swiper로 20개씩 그룹화된 슬라이드 */}
      <Swiper spaceBetween={50} slidesPerView={1} className={modalContentStyles.swiperContainer}>
        {groupedEntries.map((group, groupIndex) => (
          <SwiperSlide key={groupIndex}>
            <div className={modalContentStyles.mainContent}>
              {group.map(([key, value]) => (
                <div key={key} className={modalContentStyles.detailItem}>
                  <span className={modalContentStyles.detailKey}>
                    {key}:
                  </span>
                  <div className={modalContentStyles.detailValue}>
                    {value === null || value === undefined ? '없음' : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
