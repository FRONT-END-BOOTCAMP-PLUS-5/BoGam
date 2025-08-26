'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './TextOnly.styles';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { useStepResultMutations } from '@/hooks/useStepResultMutations';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';
import InfoToolTip from '@/(anon)/_components/common/infoToolTip/InfoToolTip';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { parseStepUrl } from '@utils/stepUrlParser';
import { loadTooltipWords, applyTooltipsToText } from '@utils/tooltipUtils';
import Button from '@/(anon)/_components/common/button/Button';

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
}

const TextOnly = ({ data }: TextOnlyProps) => {
  const [tooltipWords, setTooltipWords] = useState<Record<string, string | string[]>>({});

  // 전역 store에서 선택된 주소 가져오기
  const selectedAddress = useUserAddressStore((state) => state.selectedAddress);

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepInfo = parseStepUrl(pathname);

  // 초기화 여부를 추적하는 ref
  const hasInitialized = useRef(false);

  // tooltip 단어들을 로드
  useEffect(() => {
    const loadTooltips = async () => {
      const tooltipData = await loadTooltipWords();
      setTooltipWords(tooltipData.tooltips);
    };
    loadTooltips();
  }, []);

  // tooltip이 적용된 텍스트를 렌더링하는 함수
  const renderTextWithTooltips = (text: string) => {
    const parts = applyTooltipsToText(text, tooltipWords);
    
    return parts.map((part, index) => {
      if (typeof part === 'string') {
        return part;
      } else {
        return (
          <InfoToolTip
            key={index}
            term={part.term}
            definition={part.definition}
          />
        );
      }
    });
  };

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

  // json이 {}이거나 에러 시 기본값으로 초기화
  useEffect(() => {
    if (data.length === 0 || hasInitialized.current) {
      return;
    }

    // jsonDetails가 {}이거나 에러가 발생했을 때 POST 요청
    const shouldInitialize =
      (isError && !hasInitialized.current) ||
      (jsonDetails && Object.keys(jsonDetails).length === 0);

    if (
      shouldInitialize &&
      selectedAddress?.id &&
      stepInfo?.stepNumber &&
      stepInfo?.detail
    ) {
      const defaultDetails: Record<string, 'match'> = {
        열람: 'match', // TextOnly는 기본적으로 열람 완료 상태
      };

      const logMessage = isError
        ? '400 에러 시 기본값 초기화 진행'
        : '빈 jsonDetails 시 기본값 초기화 진행';

      // DB 저장
      upsertStepResult.mutate({
        userAddressNickname: selectedAddress.nickname,
        stepNumber: stepInfo.stepNumber,
        detail: stepInfo.detail,
        jsonDetails: defaultDetails,
      });

      // 쿼리 완전 중단
      removeQueries(
        selectedAddress.nickname,
        stepInfo.stepNumber,
        stepInfo.detail
      );

      hasInitialized.current = true;
    }
  }, [
    stepData,
    isError,
    data,
    selectedAddress?.id,
    selectedAddress?.nickname,
    stepInfo?.stepNumber,
    stepInfo?.detail,
    upsertStepResult,
    removeQueries,
  ]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div>로딩 중...</div>
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

  // stepData 표시 함수 - jsonDetails의 값들을 CircularIconBadge로 표시
  const renderStepData = () => (
    <div className={styles.stepDataSection}>
      <div className={styles.stepDataTitle}>스텝 데이터</div>
      <div>
        <div className={styles.badgeContainer}>
          {Object.entries(jsonDetails || {}).map(([key, value]) => (
            <CircularIconBadge
              key={key}
              type={value as 'match' | 'mismatch' | 'unchecked'}
              size='xsm'
            />
          ))}
        </div>
      </div>
    </div>
  );

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
                      {renderTextWithTooltips(content)}
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
                            {renderTextWithTooltips(content)}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {section.summary && (
              <div className={styles.summary}>
                {renderTextWithTooltips(section.summary)}
              </div>
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

        {/* Step5Detail3Component에서는 스텝 데이터를 표시하지 않음 */}
        {!window.location.pathname.includes('/5/3') && renderStepData()}
      </div>
    );
  }

  // data가 없는 경우
  return (
    <div className={styles.container}>
      <div className={styles.noDataContainer}>데이터가 없습니다.</div>

      {/* Step5Detail3Component에서는 스텝 데이터를 표시하지 않음 */}
      {!window.location.pathname.includes('/5/3') && renderStepData()}
    </div>
  );
};

export default TextOnly;
