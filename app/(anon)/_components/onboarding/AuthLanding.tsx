'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/(anon)/_components/onboarding/AuthLanding.module.css';

export default function AuthLanding() {
  return (
    <main className={styles.container}>
      <div className={styles.wrap}>
        {/* 타이틀 로고 */}
        <div className={styles.titleArea}>
          <Image
            src='/images/Logo.png'
            alt='전세보감 로고'
            className={styles.logoImg}
            width={84}
            height={84}
            priority
          />
        </div>

        {/* 버튼들 */}
        <div className={styles.btns}>
          <Link href='/login' className={styles.primary}>
            로그인
          </Link>
          <Link href='/signup' className={styles.outline}>
            회원가입
          </Link>
        </div>

        {/* 소셜 로그인 */}
        <div className={styles.socialRow}>
          <button
            className={`${styles.socialBtn} ${styles.kakao}`}
            aria-label='카카오로 시작'
          >
            <Image
              src='/images/KakaoLogo.png'
              alt=''
              width={20}
              height={20}
              className={styles.socialIcon}
            />
          </button>

          <button
            className={`${styles.socialBtn} ${styles.naver}`}
            aria-label='네이버로 시작'
          >
            <Image
              src='/images/NaverLogo.png'
              alt=''
              width={20}
              height={20}
              className={styles.socialIcon}
            />
          </button>
        </div>
      </div>
    </main>
  );
}
