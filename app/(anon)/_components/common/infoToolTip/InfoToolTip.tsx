'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { styles } from './InfoToolTip.styles';

interface InfoToolTipProps {
  term: string;
  definition: string | string[];
}

export default function InfoToolTip({
  term,
  definition,
}: InfoToolTipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
    top: 0,
    left: 0,
    arrowDirection: 'bottom',
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateTooltipPosition = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // 모바일 환경을 위한 정확한 뷰포트 크기 계산
    const viewportHeight = Math.min(window.innerHeight, window.visualViewport?.height || window.innerHeight);
    const viewportWidth = Math.min(window.innerWidth, window.visualViewport?.width || window.innerWidth);
    
    // 툴팁의 예상 높이를 계산 (텍스트 길이 기반)
    const definitionText = Array.isArray(definition)
      ? definition.join(' ')
      : definition;
    const estimatedTooltipHeight =
      Math.ceil(definitionText.length / 50) * 1.5 + 2.5;
    const estimatedTooltipWidth = Math.min(
      Math.max(12.5, definitionText.length * 0.5),
      Math.min(18.75, viewportWidth / 16 - 1.25)
    );

    let top = 0;
    let left = 0;
    let arrowDirection = 'bottom';

    // 툴팁 높이를 픽셀로 변환
    const tooltipHeightPx = estimatedTooltipHeight * 16;
    const tooltipWidthPx = estimatedTooltipWidth * 16;
    
    // 글씨 위치를 기준으로 tooltip 위치 계산
    const gap = 5; // 글씨와 툴팁 사이 간격
    
    // 세로 위치: 글씨 바로 아래 (뷰포트 기준)
    top = containerRect.bottom + gap;
    
    // 가로 위치: 글씨의 중앙에 tooltip 중앙이 오도록 설정
    const textCenter = containerRect.left + containerRect.width / 2;
    left = textCenter - tooltipWidthPx / 2;
    
    // 화면 경계 체크 및 조정
    // 좌측 경계 체크
    if (left < 15) {
      left = 15;
    }
    
    // 우측 경계 체크
    if (left + tooltipWidthPx > viewportWidth - 15) {
      left = viewportWidth - tooltipWidthPx - 15;
    }
    
    // 하단 경계 체크 (스크롤 가능하므로 경고만)
    if (top + tooltipHeightPx > viewportHeight - 15) {
      // 하단에 가까우면 간격을 줄임
      top = containerRect.bottom + 2;
    }
    
    arrowDirection = 'bottom';

    // 위치가 제대로 계산되었는지 확인
    if (top > 0 && left > 0) {
      setTooltipPosition({ top, left, arrowDirection });
    }
  }, [definition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
          !containerRef.current.contains(event.target as Node) &&
          tooltipRef.current &&
          !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      if (isVisible) {
        // 스크롤 시 즉시 위치 업데이트 (애니메이션 없음)
        calculateTooltipPosition();
      }
    };

    const handleResize = () => {
      if (isVisible) {
        calculateTooltipPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // 모바일 환경을 위한 추가 이벤트
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isVisible, calculateTooltipPosition]);

  const handleTermClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isVisible) {
      // 먼저 툴팁을 표시하고 DOM 업데이트 후 위치 계산
      setIsVisible(true);
      // DOM 업데이트 후 위치 계산
      setTimeout(() => {
        calculateTooltipPosition();
      }, 0);
    } else {
      setIsVisible(false);
    }
  };

  const renderDefinition = () => {
    if (Array.isArray(definition)) {
      return definition.map((line, index) => (
        <div
          key={index}
          className={index < definition.length - 1 ? 'mb-1' : ''}
        >
          {line}
        </div>
      ));
    }
    return definition;
  };

  const getArrowClasses = () => {
    if (tooltipPosition.arrowDirection === 'top') {
      return 'absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-brand-light-blue';
    }
    return 'absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-3 border-transparent border-b-brand-light-blue';
  };

  const getArrowBorderClasses = () => {
    if (tooltipPosition.arrowDirection === 'top') {
      return 'absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3.5 border-r-3.5 border-t-3.5 border-transparent border-t-brand-light-gray -z-10';
    }
    return 'absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3.5 border-r-3.5 border-b-3.5 border-transparent border-b-brand-light-gray -z-10';
  };

  return (
    <div className={styles.tooltipContainer} ref={containerRef}>
      <span className={styles.highlightedText} onClick={handleTermClick}>
        {term}
        {/* 툴팁이 표시될 때만 DOM에 추가 */}
        {isVisible && (
          <div
            ref={tooltipRef}
            className={`${styles.tooltip} ${styles.tooltipVisible}`}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
          >
            <div className={getArrowClasses()}></div>
            <div className={getArrowBorderClasses()}></div>
            <div className={styles.tooltipText}>{renderDefinition()}</div>
          </div>
        )}
      </span>
    </div>
  );
}
