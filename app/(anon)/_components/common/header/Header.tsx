'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Profile from '@/(anon)/_components/common/profile/Profile';
import { headerStyles } from '@/(anon)/_components/common/header/Header.styles';
import { ChevronLeft } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isMainPage = pathname === '/main';
  const hiddenRoutes = ['/', '/signin', '/signup'];

  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <header
      className={headerStyles.wrapper}
      style={{
        paddingLeft: 'max(var(--page-x), env(safe-area-inset-left))',
        paddingRight: 'max(var(--page-x), env(safe-area-inset-right))',
      }}
    >
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
          className={headerStyles.backButton}
        >
          <ChevronLeft />
        </button>
      )}
      <Profile size='sm' />
    </header>
  );
}
