'use client';

import { useState, useEffect, useRef, TouchEvent, MouseEvent } from 'react';
import { getStepDetail, StepDetailData } from '@libs/constants/stepDetails';
import { styles } from './StepDetail.styles';

interface StepDetailProps {
  stepNumber: string;
  detail: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StepDetail({
  stepNumber,
  detail,
  isOpen,
  onClose
}: StepDetailProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stepData, setStepData] = useState<StepDetailData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  
  const modalRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // constants에서 단계별 상세 데이터 가져오기
  useEffect(() => {
    if (isOpen) {
      const data = getStepDetail(stepNumber, detail);
      if (data) {
        setStepData(data);
      } else {
        // 데이터가 없을 경우 기본 데이터 사용
        setStepData({
          detailTitle: `${stepNumber}-${detail}단계 상세 보기`,
          isSafe: true,
          expandableTitle: '상세 정보 확인하기',
          details: [
            { key: '정보', value: '데이터를 찾을 수 없습니다.' }
          ]
        });
      }
      // 모달이 열릴 때 translateY 초기화
      setTranslateY(0);
    }
  }, [stepNumber, detail, isOpen]);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setStartY(touch.clientY);
    setCurrentY(touch.clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;
    
    // 위로는 드래그 제한, 아래로만 드래그 허용
    if (deltaY > 0) {
      setTranslateY(deltaY);
      setCurrentY(touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const deltaY = currentY - startY;
    
    // 드래그 거리가 100px 이상이면 모달 닫기
    if (deltaY > 100) {
      onClose();
    } else {
      // 원래 위치로 복귀
      setTranslateY(0);
    }
  };

  // 마우스 이벤트 핸들러 (데스크톱 지원)
  const handleMouseDown = (e: MouseEvent) => {
    setStartY(e.clientY);
    setCurrentY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - startY;
    
    // 위로는 드래그 제한, 아래로만 드래그 허용
    if (deltaY > 0) {
      setTranslateY(deltaY);
      setCurrentY(e.clientY);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const deltaY = currentY - startY;
    
    // 드래그 거리가 100px 이상이면 모달 닫기
    if (deltaY > 100) {
      onClose();
    } else {
      // 원래 위치로 복귀
      setTranslateY(0);
    }
  };

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e as any);
      const handleGlobalMouseUp = () => handleMouseUp();
      
      document.addEventListener('mousemove', handleGlobalMouseMove as any);
      document.addEventListener('mouseup', handleGlobalMouseUp as any);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove as any);
        document.removeEventListener('mouseup', handleGlobalMouseUp as any);
      };
    }
  }, [isDragging, startY, currentY]);

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e as any);
      const handleGlobalMouseUp = () => handleMouseUp();
      
      document.addEventListener('mousemove', handleGlobalMouseMove as any);
      document.addEventListener('mouseup', handleGlobalMouseUp as any);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove as any);
        document.removeEventListener('mouseup', handleGlobalMouseUp as any);
      };
    }
  }, [isDragging, startY, currentY]);

  if (!isOpen || !stepData) {
    return null;
  }

  return (
    <div 
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className={styles.modalContent}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div 
          className={styles.dragHandle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className={styles.dragIndicator}></div>
        </div>
        
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.detailTitle}>{stepData.detailTitle}</h2>
            {stepData.isSafe && (
              <div className={styles.safetyBadge}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 4L6 11L3 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>안전</span>
              </div>
            )}
          </div>

          {/* Expandable Section */}
          <div className={styles.expandableSection}>
            <button 
              className={styles.expandableHeader}
              onClick={toggleExpanded}
            >
              <svg 
                className={`${styles.expandIcon} ${isExpanded ? 'rotate-90' : ''}`}
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 12L10 8L6 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.expandableTitle}>{stepData.expandableTitle}</span>
            </button>
            
            {isExpanded && (
              <div className={styles.detailsList}>
                {stepData.details.map((detailItem, index) => (
                  <div key={index} className={styles.detailItem}>
                    <span className={styles.detailKey}>{detailItem.key} :</span>
                    <span className={styles.detailValue}>{detailItem.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
