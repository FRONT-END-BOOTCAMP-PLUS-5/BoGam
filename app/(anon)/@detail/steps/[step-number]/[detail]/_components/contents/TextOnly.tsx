'use client';

import React from 'react';
import styles from './TextOnly.styles';
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
  console.log('TextOnly - data:', data);

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
      </div>
    );
  }

  // data가 없는 경우
  return (
    <div className={styles.container}>
      <div className={styles.noDataContainer}>
        데이터가 없습니다.
      </div>
    </div>
  );
};

export default TextOnly;
