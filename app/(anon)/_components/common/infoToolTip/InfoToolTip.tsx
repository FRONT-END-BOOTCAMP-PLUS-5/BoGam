'use client';

import React, { useRef, useEffect, useId } from 'react';
import { styles } from './InfoToolTip.styles';
import { useTooltipStore } from '@libs/stores/tooltipStore';

interface InfoToolTipProps {
  term: string;
  definition: string | string[];
}

export default function InfoToolTip({
  term,
  definition,
}: InfoToolTipProps) {
  const { activeTooltipTerm, setActiveTooltip, closeAllTooltips } = useTooltipStore();
  
  // 현재 툴팁이 활성화되어 있는지 확인
  const isVisible = activeTooltipTerm === term;
  
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLSpanElement>(null);

  // term이 변경될 때마다 ref 업데이트
  useEffect(() => {
    if (termRef.current) {
      termRef.current.textContent = term;
    }
    // term이 변경되면 툴팁 숨기기
    setActiveTooltip(null);
  }, [term, setActiveTooltip]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
          !containerRef.current.contains(event.target as Node) &&
          tooltipRef.current &&
          !tooltipRef.current.contains(event.target as Node)
      ) {
        setActiveTooltip(null);
      }
    };

    const handleGlobalClick = (event: MouseEvent) => {
      // 툴팁 영역 외부 클릭 시 모든 툴팁 닫기
      if (
        !containerRef.current?.contains(event.target as Node) &&
        !tooltipRef.current?.contains(event.target as Node)
      ) {
        closeAllTooltips();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      // 터치 시 툴팁 영역 외부를 터치했는지 확인
      if (
        !containerRef.current?.contains(event.target as Node) &&
        !tooltipRef.current?.contains(event.target as Node)
      ) {
        closeAllTooltips();
      }
    };

    const handleScroll = () => {
      if (isVisible) {
        // 스크롤 시 툴팁 닫기
        setActiveTooltip(null);
      }
    };

    const handleResize = () => {
      if (isVisible) {
        // 리사이즈 시 툴팁 닫기
        setActiveTooltip(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // 모바일 환경을 위한 추가 이벤트
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
    };
  }, [isVisible, setActiveTooltip, closeAllTooltips]);

  const handleTermClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isVisible) {
      // 툴팁을 표시하고 즉시 위치 계산
      setActiveTooltip(term);
      // DOM 업데이트 후 위치 계산을 위해 requestAnimationFrame 사용
    } else {
      setActiveTooltip(null);
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

  return (
    <div className={styles.tooltipContainer} ref={containerRef}>
      <span className={styles.highlightedText} onClick={handleTermClick} ref={termRef}>
        {term}
        {/* 툴팁을 화면 중앙에 고정 배치 */}
        {isVisible && (
          <div
            ref={tooltipRef}
            className={`${styles.tooltip} ${styles.tooltipVisible}`}
          >
            <div className={styles.tooltipText}>{renderDefinition()}</div>
          </div>
        )}
      </span>
    </div>
  );
}
