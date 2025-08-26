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

import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';
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

  // 실제 데이터가 있는 항목들만 필터링
  const hasMatch = match > 0;
  const hasMismatch = mismatch > 0;
  const hasUnchecked = unchecked > 0;
  
  // 실제 항목 개수 계산
  const itemCount = (hasMatch ? 1 : 0) + (hasMismatch ? 1 : 0) + (hasUnchecked ? 1 : 0);
  
  // 간격 개수 계산 (항목이 1개면 간격 0개, 2개면 간격 1개, 3개면 간격 2개)
  const gapCount = Math.max(0, itemCount - 1);
  // 간격 크기를 1.5%로 고정 (total 값과 상관없이 항상 동일한 퍼센트)
  const gapSize = gapCount > 0 ? 1.5 : 0; // 간격이 있으면 1.5%로 고정, 없으면 0

  // Chart.js 데이터 설정 - 동적으로 간격 조정
  const chartData = {
    labels: ['안전', '간격1', '경고', '간격2', '미확인'].slice(0, itemCount + gapCount), // 필요한 라벨만 표시
    datasets: [
      {
        data: (() => {
          const data: number[] = [];
          
          if (hasMatch) {
            // 간격이 있으면 간격의 절반만큼 빼기
            const adjustedMatchPercentage = gapCount > 0 ? matchPercentage - (gapSize / 2) : matchPercentage;
            data.push(adjustedMatchPercentage);
            if (gapCount > 0) data.push(gapSize);
          }
          
          if (hasMismatch) {
            const mismatchPercentage = total > 0 ? Math.round((mismatch / total) * 100) : 0;
            // 간격이 2개 이상이면 양쪽 간격의 절반씩 빼기
            const adjustedMismatchPercentage = gapCount > 1 ? mismatchPercentage - gapSize : mismatchPercentage;
            data.push(adjustedMismatchPercentage);
            if (gapCount > 1) data.push(gapSize);
          }
          
          if (hasUnchecked) {
            const uncheckedPercentage = total > 0 ? Math.round((unchecked / total) * 100) : 0;
            // 간격이 있으면 간격의 절반만큼 빼기
            const adjustedUncheckedPercentage = gapCount > 0 ? uncheckedPercentage - (gapSize / 2) : uncheckedPercentage;
            data.push(adjustedUncheckedPercentage);
          }
          
          console.log('data :', data);
          return data;
        })(),
        backgroundColor: (() => {
          const colors: string[] = [];
          
          if (hasMatch) {
            colors.push(matchPercentage === 100 ? '#3E92F9' : '#4fa373');
            if (gapCount > 0) colors.push('#ffffff');
          }
          
          if (hasMismatch) {
            colors.push('#c24a4a');
            if (gapCount > 1) colors.push('#ffffff');
          }
          
          if (hasUnchecked) {
            colors.push('#e5e7eb');
          }
          
          return colors;
        })(),
        borderColor: (() => {
          const colors: string[] = [];
          
          if (hasMatch) {
            colors.push(matchPercentage === 100 ? '#3E92F9' : '#4fa373');
            if (gapCount > 0) colors.push('#ffffff');
          }
          
          if (hasMismatch) {
            colors.push('#c24a4a');
            if (gapCount > 1) colors.push('#ffffff');
          }
          
          if (hasUnchecked) {
            colors.push('#e5e7eb');
          }
          
          return colors;
        })(),
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
          <CircularIconBadge type="match-light-green" size="lg" weight="thick" />
          <div className={styles.statLabel}>안전</div>
          <div className={styles.statValue}>{match}건</div>
        </div>

        <div className={styles.statDivider}></div>

        <div className={styles.statCard}>
          <CircularIconBadge type="mismatch-emoji" size="lg" weight="thick" />
          <div className={styles.statLabel}>경고</div>
          <div className={styles.statValue}>{mismatch}건</div>
        </div>

        <div className={styles.statDivider}></div>

        <div className={styles.statCard}>
          <CircularIconBadge type="unchecked" size="lg" weight="thick" />
          <div className={styles.statLabel}>미확인</div>
          <div className={styles.statValue}>{unchecked}건</div>
        </div>
      </div>
    </div>
  );
}
