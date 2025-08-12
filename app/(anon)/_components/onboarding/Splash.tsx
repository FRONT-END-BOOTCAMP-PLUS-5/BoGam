'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '@/(anon)/_components/onboarding/Splash.module.css';

export default function Splash({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        onComplete();
      }, 700);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const wrapperClass = `${styles.wrapper} ${
    exiting ? styles.wrapperExit : styles.wrapperEnter
  }`;

  return (
    <main className={wrapperClass}>
      <section
        role='region'
        aria-label='앱 로딩 화면'
        className={styles.section}
      >
        <Image
          src='/images/Logo.png'
          alt='전세보감 로고'
          width={80}
          height={80}
          priority
          className={styles.logo}
        />
        <p className={styles.subText}>전세 정보의 기준</p>
      </section>
    </main>
  );
}
