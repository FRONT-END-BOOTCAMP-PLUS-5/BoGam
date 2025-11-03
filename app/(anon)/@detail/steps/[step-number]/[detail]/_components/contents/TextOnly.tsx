'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './TextOnly.styles';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { useStepResultMutations } from '@/hooks/useStepResultMutations';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { parseStepUrl } from '@utils/stepUrlParser';
import Button from '@/(anon)/_components/common/button/Button';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';

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

interface TextOnlyProps {
  data: ContentSection[];
  currentPage: number;
}

const TextOnly = ({ data, currentPage }: TextOnlyProps) => {
  // 전역 store에서 선택된 주소 가져오기
  const selectedAddress = useUserAddressStore((state) => state.selectedAddress);

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepInfo = parseStepUrl(pathname);

  // 초기화 여부를 추적하는 ref
  const hasInitialized = useRef(false);

  // useStepResultMutations 훅 사용
  const { upsertStepResult, removeQueries } = useStepResultMutations();

  // useGetStepResult 훅 사용
  const {
    data: stepData,
    isLoading,
    isError,
  } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: stepInfo?.stepNumber?.toString() || '',
    detail: stepInfo?.detail?.toString() || '',
  });

  // stepData가 배열인지 단일 객체인지 확인하고 jsonDetails 추출
  const stepResultData = Array.isArray(stepData) ? stepData[0] : stepData;
  const jsonDetails =
    stepResultData && 'jsonDetails' in stepResultData
      ? stepResultData.jsonDetails
      : undefined;
  //console.log('currentPage', currentPage);
  // currentPage가 변경될 때마다 해당 슬라이드를 읽음 처리
  useEffect(() => {
    if (data.length === 0 || !jsonDetails) {
      return;
    }

    // currentPage가 유효하지 않으면 리턴
    if (typeof currentPage !== 'number' || isNaN(currentPage)) {
      return;
    }

    // 현재 슬라이드가 이미 읽음 처리되었는지 확인
    const slideKey = `읽음_슬라이드${currentPage + 1}`;
    if (jsonDetails[slideKey] === 'match') {
      return;
    }

    if (selectedAddress?.id && stepInfo?.stepNumber && stepInfo?.detail) {
      // 기존 jsonDetails에서 현재 슬라이드만 match로 변경
      const updatedDetails = {
        ...jsonDetails,
        [slideKey]: 'match' as const,
      };

      // DB 저장
      upsertStepResult.mutate({
        userAddressNickname: selectedAddress.nickname,
        stepNumber: stepInfo.stepNumber,
        detail: stepInfo.detail,
        jsonDetails: updatedDetails,
      });

      // 쿼리 완전 중단
      removeQueries(
        selectedAddress.nickname,
        stepInfo.stepNumber,
        stepInfo.detail
      );
    }
  }, [currentPage, jsonDetails]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <LoadingOverlay
            isVisible={true}
            title="데이터를 불러오고 있습니다..."
            currentStep={1}
            totalSteps={1}
            variant="inline"
            spinnerSize="small"
          />
        </div>
      </div>
    );
  }

  // 에러 상태 (400 에러 시 데이터를 찾을 수 없다고 표시)
  if (isError && !hasInitialized.current) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }
  //console.log('jsonDetails', jsonDetails);
  // stepData 표시 함수 - jsonDetails의 값들을 CircularIconBadge로 표시
  const renderStepData = () => {
    const slideKey = `읽음_슬라이드${currentPage + 1}`;
    const slideValue = jsonDetails?.[slideKey];
    
    return (
      <div className={styles.stepDataSection}>
        <div className={styles.badgeContainer}>
          {slideValue && (
            <CircularIconBadge
              key={slideKey}
              type={slideValue as 'match' | 'mismatch' | 'unchecked'}
              size='sm'
            />
          )}
          <span className={styles.stepDataTitle}>읽음</span>
        </div>
      </div>
    );
  };

  // data가 배열인 경우만 처리
  if (Array.isArray(data) && data.length > 0) {
    return (
      <div className={styles.container}>
        {data.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.section}>
            {section.title && (
              <div className={styles.sectionTitle}>{section.title}</div>
            )}

            {section.subtitles && section.subtitles.length > 0 && (
              <div className={styles.subtitlesContainer}>
                {section.subtitles.map((subtitle, index) => (
                  <div key={index} className={styles.sectionSubtitle}>
                    {subtitle}
                  </div>
                ))}
              </div>
            )}
            {section.image && (
              <div className={styles.imageContainer}>
                <Image
                  src={section.image.src}
                  alt={section.image.alt}
                  width={section.image.width || 300}
                  height={section.image.height || 200}
                  className={styles.contentImage}
                  priority={false}
                />
              </div>
            )}
            {section.contents && (
              <div className={styles.contents}>
                {section.contents.map(
                  (content: string, contentIndex: number) => (
                    <p key={contentIndex} className={styles.contentItem}>
                      {content}
                    </p>
                  )
                )}
              </div>
            )}
            {section.contentSections && section.contentSections.length > 0 && (
              <div className={styles.contentSectionsContainer}>
                {section.contentSections.map((contentSection, sectionIndex) => (
                  <div key={sectionIndex} className={styles.contentSection}>
                    <div className={styles.sectionSubtitle}>
                      {contentSection.subtitle}
                    </div>
                    <div className={styles.contents}>
                      {contentSection.contents.map(
                        (content: string, contentIndex: number) => (
                          <p key={contentIndex} className={styles.contentItem}>
                            {content}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {section.summary && (
              <div className={styles.summary}>{section.summary}</div>
            )}
            {section.button && (
              <div className={styles.buttonContainer}>
                <Button
                  variant={section.button.variant || 'primary'}
                  href={section.button.href}
                  onClick={() => {
                    if (section.button?.onClick) {
                      // 여기에 onClick 로직 추가 가능
                    }
                  }}
                  fullWidth={section.button.fullWidth}
                >
                  {section.button.text}
                </Button>
              </div>
            )}
            {section.buttons && section.buttons.length > 0 && (
              <div className={styles.buttonsContainer}>
                {section.buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant || 'primary'}
                    href={button.href}
                    onClick={() => {
                      if (button.href) {
                        window.open(
                          button.href,
                          '_blank',
                          'noopener,noreferrer'
                        );
                      }
                    }}
                    fullWidth={button.fullWidth}
                  >
                    {button.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 스텝 데이터 표시 */}
        {renderStepData()}
      </div>
    );
  }

  // data가 없는 경우
  return (
    <div className={styles.container}>
      <div className={styles.noDataContainer}>데이터가 없습니다.</div>

      {/* 스텝 데이터 표시 */}
      {renderStepData()}
    </div>
  );
};

export default TextOnly;
