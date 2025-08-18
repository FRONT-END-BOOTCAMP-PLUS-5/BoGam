'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

type HeaderProps = {
  nickname: string;
};

export default function Header({ nickname }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isMainPage = pathname === '/main';
  const initial = nickname?.charAt(0)?.toUpperCase() || '';

  return (
    <header className='w-full h-16 flex items-center justify-between border-b px-4'>
      {/* 왼쪽 영역 */}
      <div className='text-xl font-serif'>
        {isMainPage ? (
          <Image
            src='/images/Logo.png'
            alt='전세보감 로고'
            width={30}
            height={30}
          />
        ) : (
          <button onClick={() => router.back()} className='text-base'>
            ← 뒤로
          </button>
        )}
      </div>

      {/* 오른쪽 이니셜 */}
      <div className='w-10 h-10 bg-[#A38652] text-white rounded-full flex items-center justify-center font-bold'>
        {initial}
      </div>
    </header>
  );
}
