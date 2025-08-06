"use client";

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function CopyTestIndexPage() {
  const testPages = [
    {
      title: '등기부등본 조회 테스트',
      description: '저장된 등기부등본 데이터를 조회, 수정, 삭제할 수 있는 테스트 페이지입니다.',
      path: '/test/real-estate-copy',
      icon: '🏠',
      features: [
        '사용자별 등기부등본 목록 조회',
        '등기부등본 데이터 수정',
        '등기부등본 삭제',
        'JSON 데이터 직접 편집'
      ]
    },
    {
      title: '납세증명서 조회 테스트',
      description: '저장된 납세증명서 데이터를 조회, 수정, 삭제할 수 있는 테스트 페이지입니다.',
      path: '/test/tax-cert-copy',
      icon: '📋',
      features: [
        '사용자별 납세증명서 목록 조회',
        '납세증명서 정보 요약 표시',
        '납세증명서 데이터 수정',
        '납세증명서 삭제'
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>문서 조회 테스트 페이지</h1>
        <p className={styles.description}>
          발급된 등기부등본과 납세증명서 데이터를 조회하고 관리할 수 있는 테스트 도구입니다.
        </p>
      </div>

      <div className={styles.cardGrid}>
        {testPages.map((page, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>{page.icon}</span>
              <h2 className={styles.cardTitle}>{page.title}</h2>
            </div>
            
            <p className={styles.cardDescription}>
              {page.description}
            </p>
            
            <div className={styles.features}>
              <h3 className={styles.featuresTitle}>주요 기능:</h3>
              <ul className={styles.featuresList}>
                {page.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={styles.featureItem}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={styles.cardFooter}>
              <Link href={page.path} className={styles.testButton}>
                테스트 시작
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.notice}>
        <h3 className={styles.noticeTitle}>⚠️ 주의사항</h3>
        <ul className={styles.noticeList}>
          <li>이 페이지들은 개발 및 테스트 목적으로만 사용하세요.</li>
          <li>실제 운영 환경에서는 적절한 권한 검증이 필요합니다.</li>
          <li>데이터 수정 시 JSON 형식을 정확히 입력해주세요.</li>
          <li>삭제된 데이터는 복구할 수 없으니 신중히 사용하세요.</li>
        </ul>
      </div>

      <div className={styles.navigation}>
        <Link href="/test" className={styles.backButton}>
          ← 테스트 메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}