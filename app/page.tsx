'use client';

import Link from 'next/link';
import styles from '@/page.module.css';
import { useEffect, useState } from 'react';
import Splash from '@/(anon)/_components/Splash';
import PWAInstallPrompt from '@/(anon)/_components/common/PWAInstallPrompt';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return showSplash ? (
    <Splash onComplete={() => setShowSplash(false)} />
  ) : (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>전세보감</h1>
        <p className={styles.subtitle}>부동산 정보를 한눈에 확인하는 서비스</p>

        <div className={styles.grid}>
          <Link href='/test/post-code' className={styles.card}>
            <h2>🏠 우편번호 테스트</h2>
            <p>우편번호 검색 및 주소 입력 기능을 테스트합니다.</p>
          </Link>

          <Link href='/test/transaction' className={styles.card}>
            <h2>📊 거래내역 테스트</h2>
            <p>부동산 거래내역 조회 기능을 테스트합니다.</p>
          </Link>

          <Link href='/test/tax-cert' className={styles.card}>
            <h2>📋 납세확인서 발급 테스트</h2>
            <p>납세확인서 발급 및 CODEF API 연동을 테스트합니다.</p>
          </Link>

          <Link href='/test/real-estate-search' className={styles.card}>
            <h2>🏢 등기부등본 조회 테스트</h2>
            <p>고유번호, 지번, 도로명 주소로 등기부등본을 조회합니다.</p>
          </Link>

          <Link href='/test/copy-test' className={styles.card}>
            <h2>📁 문서 조회 테스트 모음</h2>
            <p>등기부등본과 납세확인서 조회 테스트를 한 곳에서 관리합니다.</p>
          </Link>

          <Link href='/test/big-step' className={styles.card}>
            <h2>📚 3D 책 애니메이션 테스트</h2>
            <p>Three.js를 사용한 3D 책 애니메이션 및 상호작용을 테스트합니다.</p>
          </Link>

          <Link href='/page-flip' className={styles.card}>
            <h2>📕 책 넘기기 테스트</h2>
            <p>Turn.js를 사용한 책 넘기기를 테스트합니다.</p>
          </Link>
        </div>
      </main>
      <PWAInstallPrompt />
    </div>
  );
}
