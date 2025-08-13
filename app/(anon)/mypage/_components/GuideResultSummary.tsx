'use client';

import React from 'react';
import { styles } from './GuideResultSummary.styles';

interface GuideResultSummaryProps {
  safetyLevel?: number; // 1-5 단계
  safeCount?: number;
  warningCount?: number;
  unconfirmedCount?: number;
}

export default function GuideResultSummary({
  safetyLevel = 2,
  safeCount = 15,
  warningCount = 9,
  unconfirmedCount = 4
}: GuideResultSummaryProps = {}) {
  // 안전도 단계를 퍼센트로 변환 (1단계=20%, 2단계=40%, 3단계=60%, 4단계=80%, 5단계=100%)
  const safetyPercentage = (safetyLevel / 5) * 100;
  
  // 게이지 색상 결정
  const getGaugeColor = (level: number) => {
    if (level <= 2) return '#10b981'; // 초록색 (안전)
    if (level <= 3) return '#f59e0b'; // 주황색 (주의)
    return '#ef4444'; // 빨간색 (위험)
  };

  const gaugeColor = getGaugeColor(safetyLevel);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>가이드 결과 요약</h2>
      
      {/* 안전도 게이지 */}
      <div className={styles.gaugeContainer}>
        <div className={styles.gauge}>
          <svg width="200" height="100" viewBox="0 0 200 100">
            {/* 배경 원호 */}
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="16"
            />
            {/* 안전도 원호 */}
            <path
              d={`M 20 80 A 80 80 0 0 1 ${20 + (160 * safetyPercentage / 100)} ${80 - (80 * Math.sin((safetyPercentage / 100) * Math.PI))}`}
              fill="none"
              stroke={gaugeColor}
              strokeWidth="16"
              strokeLinecap="round"
            />
          </svg>
          
          {/* 중앙 텍스트 */}
          <div className={styles.gaugeText}>
            <span className={styles.safetyLabel}>안전도</span>
            <div className={styles.safetyLevel}>{safetyLevel}단계</div>
          </div>
        </div>
      </div>
      
      {/* 통계 카드들 */}
      <div className={styles.statsContainer}>
        {/* 안전 카드 */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <div className={styles.safeIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16 6L7 15L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <span className={styles.statLabel}>안전</span>
          <span className={styles.statCount}>{safeCount}건</span>
        </div>
        
        {/* 경고 카드 */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <div className={styles.warningIcon}>
              <span className={styles.warningEmoji}>😱</span>
            </div>
          </div>
          <span className={styles.statLabel}>경고</span>
          <span className={styles.statCount}>{warningCount}건</span>
        </div>
        
        {/* 미확인 카드 */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <div className={styles.unconfirmedIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <span className={styles.statLabel}>미확인</span>
          <span className={styles.statCount}>{unconfirmedCount}건</span>
        </div>
      </div>
    </div>
  );
}
