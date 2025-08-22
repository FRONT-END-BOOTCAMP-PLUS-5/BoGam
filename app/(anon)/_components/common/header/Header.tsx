'use client';

import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Profile from '@/(anon)/_components/common/profile/Profile';
import { styles } from '@/(anon)/_components/common/header/Header.styles';
import { ChevronLeft } from 'lucide-react';
import HambugiDashboard from '@/(anon)/_components/dashboard/HambugiDashboard';
import PageTitle from './PageTitle';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isMainPage = pathname === '/main';
  const hiddenRoutes = ['/', '/signin', '/signup'];
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <>
      <header
        className={styles.wrapper}
        style={{
          paddingLeft: 'max(var(--page-x), env(safe-area-inset-left))',
          paddingRight: 'max(var(--page-x), env(safe-area-inset-right))',
        }}
      >
        <div className={styles.headerLayout}>
          {/* 왼쪽: 로고 또는 뒤로가기 버튼 */}
          <div className={styles.leftSection}>
            {isMainPage ? (
              <Image
                src='/images/Logo.png'
                alt='전세보감 로고'
                width={30}
                height={30}
              />
            ) : (
              <button
                onClick={() => router.back()}
                className={styles.backButton}
              >
                <ChevronLeft />
              </button>
            )}
          </div>
          
          {/* 중앙: 페이지 제목 */}
          <div className={styles.centerSection}>
            <PageTitle pathname={pathname} />
          </div>
          
          {/* 오른쪽: 프로필 버튼 */}
          <div className={styles.rightSection}>
            <button
              type='button'
              onClick={() => setIsDashboardOpen(true)}
              aria-label='대시보드 열기'
            >
              <Profile size='sm' />
            </button>
          </div>
        </div>
      </header>

      <div 
        className={`${styles.slidePanel} ${
          isDashboardOpen ? styles.slideIn : styles.slideOut
        }`}
        data-dashboard="true"
      >
        <HambugiDashboard onClose={() => setIsDashboardOpen(false)} />
      </div>
    </>
  );
}
