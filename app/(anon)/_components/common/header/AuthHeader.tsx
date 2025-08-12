'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './AuthHeader.module.css';

export default function AuthHeader() {
  const router = useRouter();

  return (
    <header className={styles.headerEdge}>
      <div className={styles.inner}>
        <button
          type='button'
          onClick={() => router.back()}
          className={styles.backBtn}
          aria-label='이전으로'
        >
          <ChevronLeft className={styles.icon} aria-hidden />
        </button>

        <div className={styles.logoWrap}>
          <Link href='/' aria-label='홈으로'>
            <Image
              src='/images/Logo.png'
              alt='로고'
              width={35}
              height={35}
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
