'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import clsx from 'clsx';
import { styles } from './GuideResultSummary.styles';

// Chart.js 컴포넌트 등록
ChartJS.register(ArcElement, Tooltip, Legend);

interface GuideResultSummaryProps {
  match?: number;
  mismatch?: number;
  unchecked?: number;
}

export default function GuideResultSummary({
  match = 0,
  mismatch = 0,
  unchecked = 0
}: GuideResultSummaryProps = {}) {
  // 전체 합계 계산
  const total = match + mismatch + unchecked;
  
  // 각 항목의 비율 계산 (퍼센트)
  const matchPercentage = total > 0 ? Math.round((match / total) * 100) : 0;
  const mismatchPercentage = total > 0 ? Math.round((mismatch / total) * 100) : 0;
  const uncheckedPercentage = total > 0 ? Math.round((unchecked / total) * 100) : 0;

  // Chart.js 데이터 설정
  const chartData = {
    labels: ['안전', '간격1', '경고', '간격2', '미확인'],
    datasets: [
      {
        data: [match, 0.3, mismatch, 0.3, unchecked], // 0.3으로 간격 줄임
        backgroundColor: [
          matchPercentage === 100 ? '#3E92F9' : '#4fa373', // 100%면 파란색, 아니면 원래 색상
          '#ffffff', 
          '#c24a4a', 
          '#ffffff', 
          '#e5e7eb'
        ],
        borderColor: [
          matchPercentage === 100 ? '#3E92F9' : '#4fa373', // 100%면 파란색, 아니면 원래 색상
          '#ffffff', 
          '#c24a4a', 
          '#ffffff', 
          '#e5e7eb'
        ],
        borderWidth: 0,
        cutout: '80%', // 중앙 구멍을 더 늘려서 차트를 더 얇게 만듦
        circumference: 180, // 반원형 (180도)
        rotation: -90, // 서쪽(왼쪽)에서 시작
      }
    ]
  };

  // Chart.js 옵션 설정
  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 범례 숨기기
      },
      tooltip: {
        enabled: false, // 툴팁 숨기기
      }
    }
  };

  // 안전도 단계 계산 (7단계)
  const getSafetyLevel = () => {
    if (matchPercentage === 100) return '매우 안전';      // 100%: 매우 안전
    if (matchPercentage >= 80) return '안전';            // 80-99%: 안전
    if (matchPercentage >= 60) return '양호';            // 60-79%: 양호
    if (matchPercentage >= 40) return '보통';            // 40-59%: 보통
    if (matchPercentage >= 20) return '주의';            // 20-39%: 주의
    if (matchPercentage > 0) return '경고';              // 1-19%: 경고
    return '위험';                                        // 0%: 위험
  };

  // 안전도 단계별 색상 클래스 반환
  const getSafetyLevelColorClass = () => {
    if (matchPercentage === 100) return 'bg-[#3E92F9]';           // 100%: 파란색
    if (matchPercentage >= 80) return 'bg-brand-green';           // 80-99%: 브랜드 그린
    if (matchPercentage >= 60) return 'bg-[#76A34F]';            // 60-79%: 연한 초록색
    if (matchPercentage >= 40) return 'bg-[#A3954F]';            // 40-59%: 노란색
    if (matchPercentage >= 20) return 'bg-[#A36E4F]';            // 20-39%: 주황색
    if (matchPercentage > 0) return 'bg-[#A34F4F]';              // 1-19%: 빨간색
    return 'bg-[#870F0F]';                                        // 0%: 진한 빨간색
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>가이드 결과 요약</h2>
      
      {/* 반원형 게이지 */}
      <div className={styles.gaugeContainer}>
        <div className={styles.chartWrapper}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        <div className={styles.centerText}>
          <div className={styles.safetyLabel}>안전도</div>
          <div className={styles.safetyLevelContainer}>
            <div className={styles.safetyLevelTop}></div>
            <div className={styles.safetyLevelText}>{getSafetyLevel()}</div>
            <div className={clsx(styles.safetyLevelBottom, getSafetyLevelColorClass())}></div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className={styles.divider}></div>

      {/* 통계 카드들 */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIconSafe}>
            <span className={styles.checkmark}>✓</span>
          </div>
          <div className={styles.statLabel}>안전</div>
          <div className={styles.statValue}>{match}건</div>
        </div>

        <div className={styles.statDivider}></div>

        <div className={styles.statCard}>
          <div className={styles.statIconWarning}>
            <span className={styles.emoji}>😮</span>
          </div>
          <div className={styles.statLabel}>경고</div>
          <div className={styles.statValue}>{mismatch}건</div>
        </div>

        <div className={styles.statDivider}></div>

        <div className={styles.statCard}>
          <div className={styles.statIconUnchecked}>
            <span className={styles.xmark}>✗</span>
          </div>
          <div className={styles.statLabel}>미확인</div>
          <div className={styles.statValue}>{unchecked}건</div>
        </div>
      </div>
    </div>
  );
}
