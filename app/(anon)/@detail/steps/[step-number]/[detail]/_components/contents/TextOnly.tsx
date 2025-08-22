'use client';

import React from 'react';
import styles from './TextOnly.styles';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { parseStepUrl } from '@utils/stepUrlParser';
import Button from '@/(anon)/_components/common/button/Button';

interface ContentSection {
  title?: string;
  subtitle?: string;
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
  // 전역 store에서 선택된 주소 가져오기
  const selectedAddress = useUserAddressStore((state) => state.selectedAddress);
  
  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepInfo = parseStepUrl(pathname);
  
  // useGetStepResult 훅 사용
  const { data: stepData, isLoading, isError } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: stepInfo?.mainNum?.toString() || '',
    detail: stepInfo?.subNum?.toString() || ''
  });

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

  // 에러 상태
  if (isError || !stepData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  // stepData 표시 함수 - jsonDetails의 값들을 CircularIconBadge로 표시
  const renderStepData = () => (
    <div className={styles.stepDataSection}>
      <div className={styles.stepDataTitle}>스텝 데이터</div>
      <div>
        <div className={styles.badgeContainer}>
          {Object.entries(stepData.jsonDetails).map(([key, value]) => (
            <CircularIconBadge 
              key={key} 
              type={value as 'match' | 'mismatch' | 'unchecked'} 
              size="xsm" 
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
            {section.subtitle && (
              <div className={styles.sectionSubtitle}>{section.subtitle}</div>
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
                <img
                  src={section.image.src}
                  alt={section.image.alt}
                  width={section.image.width}
                  height={section.image.height}
                  className={styles.contentImage}
                />
              </div>
            )}
            {section.contents && (
              <div className={styles.contents}>
                {section.contents.map((content: string, contentIndex: number) => (
                  <p key={contentIndex} className={styles.contentItem}>
                    {content}
                  </p>
                ))}
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
                      {contentSection.contents.map((content: string, contentIndex: number) => (
                        <p key={contentIndex} className={styles.contentItem}>
                          {content}
                        </p>
                      ))}
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
                      console.log('Button clicked:', section.button.onClick);
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
                  <button
                    key={index}
                    className={`${styles.customButton} ${button.variant === 'primary' ? styles.primaryButton : styles.secondaryButton}`}
                    onClick={() => {
                      if (button.href) {
                        window.open(button.href, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {renderStepData()}
      </div>
    );
  }

  // data가 없는 경우
  return (
    <div className={styles.container}>
      <div className={styles.noDataContainer}>
        데이터가 없습니다.
      </div>
      
      {renderStepData()}
    </div>
  );
};

export default TextOnly;
