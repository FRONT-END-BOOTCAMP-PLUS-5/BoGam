'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Splash({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        onComplete(); // 700ms 후 Splash 완전히 제거
      }, 700);
    }, 2000); // splash 노출 시간

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <main
      className={`flex items-center justify-center h-screen bg-white px-4 transition-all duration-700 ease-in-out ${
        exiting ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'
      }`}
    >
      <section
        role='region'
        aria-label='앱 로딩 화면'
        className='w-full h-full bg-[#e3eff9] border flex flex-col items-center justify-center text-center'
      >
        <Image
          src='/images/logo.png'
          alt='전세보감 로고'
          width={80}
          height={80}
          priority
          className='mb-4'
        />
        <p className='text-sm text-gray-600'>전세 정보의 기준</p>
      </section>
    </main>
  );
}
