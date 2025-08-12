'use client';

import { useState, useEffect } from 'react';
import styles from '../stepDetail.module.css';

interface StepDetailCardProps {
  stepNumber: string;
  detail: string;
}

interface StepDetailData {
  detailTitle: string;
  isSafe: boolean;
  expandableTitle: string;
  details: Array<{
    key: string;
    value: string;
  }>;
}

export default function StepDetailCard({
  stepNumber,
  detail
}: StepDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stepData, setStepData] = useState<StepDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // API 요청을 통해 단계별 상세 데이터 가져오기
  useEffect(() => {
    const fetchStepDetail = async () => {
      try {
        setLoading(true);
        // TODO: 실제 API 엔드포인트로 변경
        const response = await fetch(`/api/step-result?stepNumber=${stepNumber}&detail=${detail}`);
        
        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setStepData(data);
      } catch (err) {
        console.error('Step detail fetch error:', err);
        // 에러 시 기본 데이터 사용 (개발용)
        setStepData({
          detailTitle: `${stepNumber}-${detail}단계 상세 보기`,
          isSafe: true,
          expandableTitle: '가짜 임대인 확인하기',
          details: [
            { key: '사업자상호', value: '신흥사부동산중개인사무소' },
            { key: '등록번호', value: '가123456-789' },
            { key: '중개업자면', value: '홍길동' },
            { key: '상태구분명', value: '영업중' },
            { key: '등록일자', value: '2016-08-15' },
            { key: '데이터기준일자', value: '2016-08-15' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStepDetail();
  }, [stepNumber, detail]);

  if (loading) {
    return (
      <div className={styles.mainCard}>
        <div className={styles.loading}>데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (!stepData) {
    return (
      <div className={styles.mainCard}>
        <div className={styles.error}>데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.mainCard}>
      <div className={styles.scrollIndicator}></div>
      
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
            className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 12L10 8L6 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{stepData.expandableTitle}</span>
        </button>
        
        {isExpanded && (
          <div className={styles.detailsList}>
            {stepData.details.map((detail, index) => (
              <div key={index} className={styles.detailItem}>
                <span className={styles.detailKey}>{detail.key} :</span>
                <span className={styles.detailValue}>{detail.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
