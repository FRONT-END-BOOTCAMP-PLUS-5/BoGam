'use client';

import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthHeader() {
  const router = useRouter();

  return (
    <header className='relative h-14 flex items-center border-b border-gray-200 bg-white'>
      {/* 왼쪽: 이전 */}
      <button
        type='button'
        onClick={() => router.back()}
        className='text-sm font-semibold text-gray-900'
        aria-label='이전으로'
      >
        <ChevronLeft />
      </button>

      {/* 가운데: 로고 */}
      <div className='absolute left-1/2 -translate-x-1/2'>
        <Image
          src='/images/Logo.png'
          alt='로고'
          width={30}
          height={30}
          className='h-6 w-auto'
          priority
        />
      </div>
    </header>
  );
}
