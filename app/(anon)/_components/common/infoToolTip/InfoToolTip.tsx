'use client';

import React, { useState, useEffect, useRef } from 'react';
import { styles } from './InfoToolTip.styles';

interface InfoToolTipProps {
  term: string;
  definition: string | string[];
  children?: React.ReactNode;
}

export default function InfoToolTip({
  term,
  definition,
  children,
}: InfoToolTipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
    top: 0,
    left: 0,
    arrowDirection: 'bottom',
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [isVisible]);

  const calculateTooltipPosition = () => {
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
    
    // 단순하게: 위아래 공간 중 더 넓은 쪽에 툴팁 배치
    const spaceBelow = viewportHeight - containerRect.bottom;
    const spaceAbove = containerRect.top;
    const gap = 3; // 글씨와 툴팁 사이 간격
    const textHeight = 16; // 글씨 높이 (16px)
    
    // 디버깅 정보 출력
    console.log('Tooltip positioning debug:', {
      containerRect: {
        top: containerRect.top,
        bottom: containerRect.bottom,
        left: containerRect.left,
        width: containerRect.width
      },
      viewport: { height: viewportHeight, width: viewportWidth },
      tooltip: { height: tooltipHeightPx, width: estimatedTooltipWidth * 16 },
      spaces: { below: spaceBelow, above: spaceAbove },
      gap,
      textHeight
    });
    
    // 기본적으로 아래쪽에 배치 시도
    if (spaceBelow >= tooltipHeightPx + gap) {
      // 아래쪽에 충분한 공간이 있으면 아래에 배치
      top = containerRect.bottom + gap;
      arrowDirection = 'bottom';
      console.log('Placing tooltip below text');
    } else if (spaceAbove >= tooltipHeightPx + gap + textHeight) {
      // 위쪽에 충분한 공간이 있으면 위에 배치 (글씨 높이만큼 추가 간격)
      top = containerRect.top - tooltipHeightPx - gap - textHeight*4.5;
      arrowDirection = 'top';
      console.log('Placing tooltip above text');
    } else {
      // 위아래 모두 공간이 부족하면 아래에 배치 (스크롤 가능)
      top = containerRect.bottom + gap;
      arrowDirection = 'bottom';
      console.log('Placing tooltip below text (forced)');
    }

    // 가로 위치 계산 (중앙 정렬)
    const tooltipWidthPx = estimatedTooltipWidth * 16;
    left = Math.max(
      15,
      Math.min(
        containerRect.left +
          containerRect.width / 2 -
          tooltipWidthPx / 2,
        viewportWidth - tooltipWidthPx - 15
      )
    );

    console.log('Final tooltip position:', { top, left, arrowDirection });
    setTooltipPosition({ top, left, arrowDirection });
  };

  const handleTermClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isVisible) {
      // 먼저 위치를 계산하고 툴팁을 표시
      calculateTooltipPosition();
      setIsVisible(true);
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

      {children}
    </div>
  );
}
