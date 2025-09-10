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
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenDashboard = () => {
    setIsDashboardOpen(true);
    // 다음 프레임에서 애니메이션 시작
    requestAnimationFrame(() => {
      setIsAnimating(true);
    });
  };

  const handleCloseDashboard = () => {
    setIsAnimating(false);
    // 애니메이션 완료 후 대시보드 닫기
    setTimeout(() => {
      setIsDashboardOpen(false);
    }, 500); // duration과 동일하게 설정
  };

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
                onClick={() => {
                  // 상위 페이지로 이동
                  const pathSegments = pathname.split('/').filter(Boolean);
                  if (pathSegments.length > 1) {
                    // 첫 번째 세그먼트만 유지 (예: steps/4 -> steps)
                    const parentPath = '/' + pathSegments[0];
                    router.push(parentPath);
                  } else {
                    router.push('/main');
                  }
                }}
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
              onClick={handleOpenDashboard}
              aria-label='대시보드 열기'
            >
              <Profile size='sm' />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`${styles.slidePanel} ${
          isAnimating ? styles.slidePanelOpen : styles.slidePanelClosed
        }`}
        data-dashboard='true'
        style={{ display: isDashboardOpen ? 'block' : 'none' }}
      >
        {isDashboardOpen && (
          <HambugiDashboard onClose={handleCloseDashboard} />
        )}
      </div>
    </>
  );
}
